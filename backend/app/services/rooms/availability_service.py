from datetime import date, time
from uuid import UUID

from app.core.exceptions import NotFoundException
from app.repositories.booking_repository import BookingRepository
from app.repositories.room_repository import RoomRepository
from app.repositories.settings_repository import (
    SettingsRepository,
)
from app.schemas.availability import (
    AvailabilityResponse,
    AvailabilitySlot,
)


class AvailabilityService:

    def __init__(
        self,
        room_repository: RoomRepository,
        booking_repository: BookingRepository,
        settings_repository: SettingsRepository,
    ):
        self.room_repository = room_repository
        self.booking_repository = booking_repository
        self.settings_repository = settings_repository

    async def get_availability(
        self,
        room_id: UUID,
        booking_date: date,
    ) -> AvailabilityResponse:

        room = await self.room_repository.get_by_id(
            room_id
        )

        if not room:
            raise NotFoundException(
                "Room not found"
            )

        settings = await self.settings_repository.get()

        if not settings:
            raise NotFoundException(
                "System settings not configured"
            )

        bookings = (
            await self.booking_repository.find_conflicts(
                room_id=room_id,
                booking_date=booking_date,
                start_time=settings.working_day_start,
                end_time=settings.working_day_end,
            )
        )

        occupied = [
            (
                booking.start_time,
                booking.end_time,
            )
            for booking in bookings
        ]

        slots: list[AvailabilitySlot] = []

        current = settings.working_day_start

        while current < settings.working_day_end:

            minutes = (
                current.hour * 60
                + current.minute
                + 15
            )

            next_slot = time(
                hour=minutes // 60,
                minute=minutes % 60,
            )

            available = not any(
                start < next_slot
                and end > current
                for start, end in occupied
            )

            slots.append(
                AvailabilitySlot(
                    room_id=room_id,
                    date=booking_date,
                    start_time=current,
                    end_time=next_slot,
                    available=available,
                )
            )

            current = next_slot

        return AvailabilityResponse(
            room_id=room_id,
            date=booking_date,
            slots=slots,
        )