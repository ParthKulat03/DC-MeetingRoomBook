from typing import Generic, TypeVar

from pydantic import BaseModel, Field


T = TypeVar("T")


class MessageResponse(BaseModel):
    message: str


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    page: int
    limit: int
    total: int
    total_pages: int


class PaginationQuery(BaseModel):
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)