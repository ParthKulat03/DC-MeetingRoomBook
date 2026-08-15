from uuid import UUID

from pydantic import BaseModel, Field


class RoomCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    description: str | None = None
    capacity: int = Field(gt=0)
    status: str = "ACTIVE"


class RoomUpdateRequest(BaseModel):
    name: str | None = Field(default=None, max_length=150)
    description: str | None = None
    capacity: int | None = Field(default=None, gt=0)
    status: str | None = None


class RoomStatusUpdateRequest(BaseModel):
    status: str


class RoomResponse(BaseModel):
    id: UUID
    name: str
    description: str | None
    capacity: int
    status: str

    model_config = {
        "from_attributes": True
    }