from datetime import datetime, timezone
from uuid import UUID

from app.core.exceptions import (
    ConflictException,
    NotFoundException,
)
from app.models.booking import (
    Booking,
    BookingAttendee,
    BookingStatus,
)
from app.models.system_settings import SystemSettings
from app.repositories.booking_repository import BookingRepository
from app.repositories.room_repository import RoomRepository
from app.schemas.booking import (
    CreateBookingRequest,
    UpdateBookingRequest,
)
from app.services.bookings.booking_conflict_service import (
    BookingConflictService,
)
from app.services.bookings.booking_validation_service import (
    BookingValidationService,
)


class BookingService:

    def __init__(
        self,
        booking_repository: BookingRepository,
        room_repository: RoomRepository,
        validation_service: BookingValidationService,
        conflict_service: BookingConflictService,
        settings_repository=None,
    ):
        self.booking_repository = booking_repository
        self.room_repository = room_repository
        self.validation_service = validation_service
        self.conflict_service = conflict_service
        self.settings_repository = settings_repository

    async def _get_settings(self) -> SystemSettings:
        settings = await self.settings_repository.get()

        if not settings:
            raise NotFoundException(
                "System settings are not configured"
            )

        return settings

    async def get_booking(
        self,
        booking_id: UUID,
    ) -> Booking:

        booking = (
            await self.booking_repository.get_by_id(
                booking_id
            )
        )

        if not booking:
            raise NotFoundException(
                "Booking not found"
            )

        return booking

    async def create_booking(
        self,
        user_id: UUID,
        data: CreateBookingRequest,
    ) -> Booking:

        room = await self.room_repository.get_by_id(
            data.room_id
        )

        if not room:
            raise NotFoundException(
                "Room not found"
            )

        settings = await self._get_settings()

        self.validation_service.validate_all(
            room=room,
            booking_date=data.booking_date,
            start_time=data.start_time,
            end_time=data.end_time,
            settings=settings,
        )

        await self.conflict_service.ensure_no_conflict(
            room_id=data.room_id,
            booking_date=data.booking_date,
            start_time=data.start_time,
            end_time=data.end_time,
        )

        booking = Booking(
            booking_code=self._generate_booking_code(),
            room_id=data.room_id,
            user_id=user_id,
            booking_date=data.booking_date,
            start_time=data.start_time,
            end_time=data.end_time,
            title=data.title,
            purpose=data.purpose,
            notes=data.notes,
            status=BookingStatus.CONFIRMED,
        )

        for attendee in data.attendees:
            booking.attendees.append(
                BookingAttendee(
                    name=attendee.name,
                    designation=attendee.designation,
                )
            )

        return await self.booking_repository.create(
            booking
        )

    async def update_booking(
        self,
        booking_id: UUID,
        data: UpdateBookingRequest,
    ) -> Booking:

        booking = await self.get_booking(booking_id)

        updates = data.model_dump(
            exclude_unset=True
        )

        new_room_id = updates.get(
            "room_id",
            booking.room_id,
        )

        new_date = updates.get(
            "booking_date",
            booking.booking_date,
        )

        new_start = updates.get(
            "start_time",
            booking.start_time,
        )

        new_end = updates.get(
            "end_time",
            booking.end_time,
        )

        room = await self.room_repository.get_by_id(
            new_room_id
        )

        if not room:
            raise NotFoundException(
                "Room not found"
            )

        settings = await self._get_settings()

        self.validation_service.validate_all(
            room,
            new_date,
            new_start,
            new_end,
            settings,
        )

        await self.conflict_service.ensure_no_conflict(
            room_id=new_room_id,
            booking_date=new_date,
            start_time=new_start,
            end_time=new_end,
            exclude_booking_id=booking.id,
        )

        attendees = updates.pop(
            "attendees",
            None,
        )

        for key, value in updates.items():
            if key == "status":
                value = BookingStatus(value)

            setattr(booking, key, value)

        if attendees is not None:
            booking.attendees.clear()

            for attendee in attendees:
                booking.attendees.append(
                    BookingAttendee(
                        name=attendee.name,
                        designation=attendee.designation,
                    )
                )

        return await self.booking_repository.update(
            booking
        )

    async def cancel_booking(
        self,
        booking_id: UUID,
    ) -> Booking:

        booking = await self.get_booking(
            booking_id
        )

        if booking.status == BookingStatus.CANCELLED:
            return booking

        booking.status = BookingStatus.CANCELLED

        return await self.booking_repository.update(
            booking
        )

    async def get_user_bookings(
        self,
        user_id: UUID,
        page: int,
        limit: int,
        status: str | None = None,
        room_id: UUID | None = None,
        from_date=None,
        to_date=None,
    ):
        return await self.booking_repository.list_user_bookings(
            user_id=user_id,
            page=page,
            limit=limit,
            status=status,
            room_id=room_id,
            from_date=from_date,
            to_date=to_date,
        )

    async def get_all_bookings(
        self,
        page: int,
        limit: int,
        search: str | None = None,
        room_id: UUID | None = None,
        employee_id: str | None = None,
        status: str | None = None,
        from_date=None,
        to_date=None,
    ):
        return await self.booking_repository.list_all(
            page=page,
            limit=limit,
            search=search,
            room_id=room_id,
            employee_id=employee_id,
            status=status,
            from_date=from_date,
            to_date=to_date,
        )

    @staticmethod
    def _generate_booking_code() -> str:
        timestamp = int(
            datetime.now(timezone.utc).timestamp()
        )

        return f"BK-{timestamp}"