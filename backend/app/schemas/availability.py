from datetime import date, time
from uuid import UUID

from pydantic import BaseModel


class AvailabilitySlot(BaseModel):
    room_id: UUID
    date: date
    start_time: time
    end_time: time
    available: bool


class AvailabilityResponse(BaseModel):
    room_id: UUID
    date: date
    slots: list[AvailabilitySlot]