from app.repositories.booking_repository import (
    BookingRepository,
)


class ReportService:

    def __init__(
        self,
        booking_repository: BookingRepository,
    ):
        self.booking_repository = booking_repository

    async def booking_report(
        self,
        from_date=None,
        to_date=None,
        room_id=None,
        employee_id=None,
    ) -> dict:

        bookings, _ = (
            await self.booking_repository.list_all(
                page=1,
                limit=10000,
                room_id=room_id,
                employee_id=employee_id,
                from_date=from_date,
                to_date=to_date,
            )
        )

        rows = []

        for booking in bookings:

            rows.append(
                {
                    "Booking ID": booking.booking_code,
                    "Room": (
                        booking.room.name
                        if booking.room
                        else ""
                    ),
                    "Employee": (
                        booking.user.name
                        if booking.user
                        else ""
                    ),
                    "Date": booking.booking_date.isoformat(),
                    "Start": booking.start_time.strftime(
                        "%H:%M"
                    ),
                    "End": booking.end_time.strftime(
                        "%H:%M"
                    ),
                    "Status": booking.status.value,
                }
            )

        return {
            "rows": rows
        }

    async def room_utilization_report(
        self,
        from_date=None,
        to_date=None,
        room_id=None,
        employee_id=None,
    ) -> dict:

        # Detailed aggregation will be added once
        # reporting queries are finalized.

        return {
            "rows": []
        }

    async def cancellation_report(
        self,
        from_date=None,
        to_date=None,
        room_id=None,
        employee_id=None,
    ) -> dict:

        return {
            "rows": []
        }