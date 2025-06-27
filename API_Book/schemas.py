from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class ReviewBase(BaseModel):
    text: str
    screenshot_path: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: int
    book_id: int

    model_config = ConfigDict(from_attributes=True)

class BookBase(BaseModel):
    title: str
    author: str

class BookCreate(BookBase):
    pass

class Book(BookBase):
    id: int
    reviews: List[Review] = []

    model_config = ConfigDict(from_attributes=True)
