from datetime import date, time, datetime

from app.core.exceptions import ConflictException
from app.models.room import MeetingRoom, RoomStatus
from app.models.system_settings import SystemSettings


class BookingValidationService:

    def validate_room(
        self,
        room: MeetingRoom,
    ) -> None:

        if room.status != RoomStatus.ACTIVE:
            raise ConflictException(
                "Room is not active"
            )

    def validate_date(
        self,
        booking_date: date,
    ) -> None:

        if booking_date < date.today():
            raise ConflictException(
                "Booking date cannot be in the past"
            )

    def validate_time_order(
        self,
        start_time: time,
        end_time: time,
    ) -> None:

        if start_time >= end_time:
            raise ConflictException(
                "Start time must be before end time"
            )

    def validate_15_minute_alignment(
        self,
        start_time: time,
        end_time: time,
    ) -> None:

        if (
            start_time.minute % 15 != 0
            or end_time.minute % 15 != 0
        ):
            raise ConflictException(
                "Booking time must align to 15-minute intervals"
            )

        if start_time.second != 0 or end_time.second != 0:
            raise ConflictException(
                "Booking time must align to 15-minute intervals"
            )

    def validate_working_hours(
        self,
        start_time: time,
        end_time: time,
        settings: SystemSettings,
    ) -> None:

        if (
            start_time < settings.working_day_start
            or end_time > settings.working_day_end
        ):
            raise ConflictException(
                "Booking must be inside working hours"
            )

    def validate_duration(
        self,
        start_time: time,
        end_time: time,
        settings: SystemSettings,
    ) -> None:

        start = datetime.combine(
            date.today(),
            start_time,
        )

        end = datetime.combine(
            date.today(),
            end_time,
        )

        duration_minutes = (
            end - start
        ).total_seconds() / 60

        if duration_minutes < settings.minimum_booking_duration:
            raise ConflictException(
                "Booking duration is below the minimum"
            )

        if duration_minutes > settings.maximum_booking_duration:
            raise ConflictException(
                "Booking duration exceeds the maximum"
            )

    def validate_all(
        self,
        room: MeetingRoom,
        booking_date: date,
        start_time: time,
        end_time: time,
        settings: SystemSettings,
    ) -> None:

        self.validate_room(room)
        self.validate_date(booking_date)
        self.validate_time_order(start_time, end_time)
        self.validate_15_minute_alignment(
            start_time,
            end_time,
        )
        self.validate_working_hours(
            start_time,
            end_time,
            settings,
        )
        self.validate_duration(
            start_time,
            end_time,
            settings,
        )