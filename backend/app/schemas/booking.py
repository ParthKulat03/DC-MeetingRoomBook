from datetime import date, time
from uuid import UUID

from pydantic import BaseModel, Field


class AttendeeRequest(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    designation: str | None = Field(default=None, max_length=150)


class CreateBookingRequest(BaseModel):
    room_id: UUID
    booking_date: date
    start_time: time
    end_time: time
    title: str = Field(min_length=1, max_length=200)
    purpose: str | None = None
    notes: str | None = None
    attendees: list[AttendeeRequest] = Field(default_factory=list)


class UpdateBookingRequest(BaseModel):
    room_id: UUID | None = None
    booking_date: date | None = None
    start_time: time | None = None
    end_time: time | None = None
    title: str | None = Field(default=None, max_length=200)
    purpose: str | None = None
    notes: str | None = None
    status: str | None = None
    attendees: list[AttendeeRequest] | None = None


class BookingAttendeeResponse(BaseModel):
    id: UUID
    name: str
    designation: str | None

    model_config = {
        "from_attributes": True
    }


class BookingResponse(BaseModel):
    id: UUID
    booking_code: str
    room_id: UUID
    user_id: UUID
    booking_date: date
    start_time: time
    end_time: time
    title: str
    purpose: str | None
    notes: str | None
    status: str
    attendees: list[BookingAttendeeResponse] = Field(
        default_factory=list
    )

    model_config = {
        "from_attributes": True
    }


class BookingListQuery(BaseModel):
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)
    status: str | None = None
    room_id: UUID | None = None
    employee_id: str | None = None
    search: str | None = None
    from_date: date | None = None
    to_date: date | None = None