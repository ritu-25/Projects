# Book Review API

This is a simple Book Review service built with Python, FastAPI, and SQLAlchemy. It provides a RESTful API for managing books and their reviews, including support for screenshot uploads.

## Features

- List all books
- Add a new book
- Get all reviews for a specific book
- Add a new review for a book, with an optional screenshot upload
- Caching for the book list to improve performance
- Database migrations managed with Alembic
- Automated unit and integration tests

## Setup

1.  **Clone the repository** (if applicable)

2.  **Install dependencies**:
    Make sure you have Python 3.8+ installed. Then, install the required packages using pip:
    ```bash
    pip install -r requirements.txt
    ```

## Database Migrations

This project uses Alembic to manage database schema migrations. To apply all migrations and bring the database up to date, run the following command:

```bash
python -m alembic upgrade head
```

## Running the Service

To start the development server, run the following command from the project's root directory:

```bash
python -m uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`. You can access the interactive API documentation (Swagger UI) at `http://127.0.0.1:8000/docs`.

## Running Tests

To run the automated tests, use `pytest`:

```bash
python -m pytest
```

This will discover and run all the tests in the `tests` directory.

## API Endpoints

- `GET /books`: Retrieve a list of all books.
- `POST /books`: Add a new book.
- `GET /books/{id}/reviews`: Get all reviews for a specific book.
- `POST /books/{id}/reviews`: Add a new review for a book. This endpoint accepts a multipart form with a `text` field and an optional `file` upload for a screenshot.
