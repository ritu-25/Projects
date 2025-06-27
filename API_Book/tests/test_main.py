import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import fakeredis
import os

from main import app
from database import Base, get_db
import models

# Setup the TestClient
client = TestClient(app)

# Setup the in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_db.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Mock Redis
mock_redis_server = fakeredis.FakeServer()
mock_redis = fakeredis.FakeRedis(server=mock_redis_server)

# Dependency override for the database
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Fixture to create a fresh database for each test
@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

# Fixture to mock the redis cache
@pytest.fixture(autouse=True)
def mock_cache(monkeypatch):
    monkeypatch.setattr("main.cache", mock_redis)
    mock_redis.flushall()
    yield

# --- Unit Tests ---

def test_create_book(db_session):
    response = client.post("/books", json={"title": "Test Book", "author": "Test Author"})
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Book"
    assert data["author"] == "Test Author"
    assert "id" in data

def test_create_review_for_book(db_session):
    # First, create a book
    book_response = client.post("/books", json={"title": "Another Test Book", "author": "Another Author"})
    book_id = book_response.json()["id"]

    # Then, create a review for that book with a file upload
    test_filename = "test_screenshot.png"
    with open(test_filename, "wb") as f:
        f.write(b"fake image data")
    
    uploaded_file_path = f"uploads/{test_filename}"

    try:
        with open(test_filename, "rb") as f:
            review_response = client.post(
                f"/books/{book_id}/reviews",
                data={"text": "This is a great book!"},
                files={"file": (test_filename, f, "image/png")}
            )

        assert review_response.status_code == 200
        data = review_response.json()
        assert data["text"] == "This is a great book!"
        assert data["book_id"] == book_id
        assert uploaded_file_path in data["screenshot_path"]
    finally:
        # Clean up the created files
        if os.path.exists(test_filename):
            os.remove(test_filename)
        if os.path.exists(uploaded_file_path):
            os.remove(uploaded_file_path)

# --- Integration Test ---

def test_get_books_cache_miss(db_session):
    # 1. Add a book directly to the DB
    db_book = models.Book(title="Cache Test Book", author="Cache Author")
    db_session.add(db_book)
    db_session.commit()

    # 2. Ensure cache is empty
    assert mock_redis.get("books") is None

    # 3. First call to /books (cache miss)
    response = client.get("/books")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Cache Test Book"

    # 4. Verify cache is now populated
    cached_books = mock_redis.get("books")
    assert cached_books is not None

    # 5. Second call to /books (should be a cache hit)
    # To prove it's a cache hit, we'll delete the book from the DB
    db_session.delete(db_book)
    db_session.commit()

    response_from_cache = client.get("/books")
    assert response_from_cache.status_code == 200
    assert len(response_from_cache.json()) == 1
    assert response_from_cache.json()[0]["title"] == "Cache Test Book"
