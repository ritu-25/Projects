from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Form
from fastapi.staticfiles import StaticFiles
import shutil
from sqlalchemy.orm import Session
from typing import List
import redis
import json

from database import get_db
import models
import schemas

app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Mock Redis cache
cache = redis.Redis(host='localhost', port=6379, db=0)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Book Review API. Go to /docs for the API documentation."}

@app.get("/books", response_model=List[schemas.Book])
def get_books(db: Session = Depends(get_db)):
    try:
        cached_books = cache.get("books")
        if cached_books:
            return json.loads(cached_books)
    except redis.exceptions.ConnectionError:
        pass # Cache is down, proceed to fetch from DB

    books = db.query(models.Book).all()

    # Convert to a list of dicts for JSON serialization
    books_list = []
    for b in books:
        # NOTE: reviews are not included here to avoid N+1 queries.
        # The schema for /books doesn't require them.
        books_list.append({"id": b.id, "title": b.title, "author": b.author, "reviews": []})

    try:
        cache.set("books", json.dumps(books_list))
    except redis.exceptions.ConnectionError:
        pass # Cache is down, unable to set cache

    return books

@app.post("/books", response_model=schemas.Book)
def create_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    db_book = models.Book(title=book.title, author=book.author)
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

@app.get("/books/{book_id}/reviews", response_model=List[schemas.Review])
def get_reviews_for_book(book_id: int, db: Session = Depends(get_db)):
    reviews = db.query(models.Review).filter(models.Review.book_id == book_id).all()
    return reviews

@app.post("/books/{book_id}/reviews", response_model=schemas.Review)
def create_review_for_book(book_id: int, text: str = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    # Save the uploaded file
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db_review = models.Review(text=text, book_id=book_id, screenshot_path=file_path)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review
