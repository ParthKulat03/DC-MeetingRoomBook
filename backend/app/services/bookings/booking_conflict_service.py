from datetime import date, time
from uuid import UUID

from app.core.exceptions import ConflictException
from app.repositories.booking_repository import BookingRepository


class BookingConflictService:

    def __init__(
        self,
        booking_repository: BookingRepository,
    ):
        self.booking_repository = booking_repository

    async def ensure_no_conflict(
        self,
        room_id: UUID,
        booking_date: date,
        start_time: time,
        end_time: time,
        exclude_booking_id: UUID | None = None,
    ) -> None:

        conflicts = (
            await self.booking_repository.find_conflicts(
                room_id=room_id,
                booking_date=booking_date,
                start_time=start_time,
                end_time=end_time,
                exclude_booking_id=exclude_booking_id,
            )
        )

        if conflicts:
            raise ConflictException(
                "The selected room is already booked "
                "for this time"
            )