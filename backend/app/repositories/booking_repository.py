from datetime import date, time
from uuid import UUID

from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.booking import Booking, BookingStatus
from app.models.user import User


class BookingRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(
        self,
        booking_id: UUID,
    ) -> Booking | None:

        result = await self.db.execute(
            select(Booking)
            .options(selectinload(Booking.attendees))
            .where(Booking.id == booking_id)
        )

        return result.scalar_one_or_none()

    async def create(
        self,
        booking: Booking,
    ) -> Booking:
        self.db.add(booking)
        await self.db.flush()
        await self.db.refresh(booking)
        return booking

    async def update(
        self,
        booking: Booking,
    ) -> Booking:
        await self.db.flush()
        await self.db.refresh(booking)
        return booking

    async def delete(
        self,
        booking: Booking,
    ) -> None:
        await self.db.delete(booking)
        await self.db.flush()

    async def find_conflicts(
        self,
        room_id: UUID,
        booking_date: date,
        start_time: time,
        end_time: time,
        exclude_booking_id: UUID | None = None,
    ) -> list[Booking]:

        conditions = [
            Booking.room_id == room_id,
            Booking.booking_date == booking_date,
            Booking.status == BookingStatus.CONFIRMED,
            Booking.start_time < end_time,
            Booking.end_time > start_time,
        ]

        if exclude_booking_id:
            conditions.append(
                Booking.id != exclude_booking_id
            )

        result = await self.db.execute(
            select(Booking).where(and_(*conditions))
        )

        return list(result.scalars().all())

    async def list_user_bookings(
        self,
        user_id: UUID,
        page: int,
        limit: int,
        status: str | None = None,
        room_id: UUID | None = None,
        from_date: date | None = None,
        to_date: date | None = None,
    ) -> tuple[list[Booking], int]:

        conditions = [
            Booking.user_id == user_id
        ]

        if status:
            conditions.append(
                Booking.status == BookingStatus(status)
            )

        if room_id:
            conditions.append(
                Booking.room_id == room_id
            )

        if from_date:
            conditions.append(
                Booking.booking_date >= from_date
            )

        if to_date:
            conditions.append(
                Booking.booking_date <= to_date
            )

        query = (
            select(Booking)
            .options(selectinload(Booking.attendees))
            .where(and_(*conditions))
            .order_by(
                Booking.booking_date.desc(),
                Booking.start_time.desc(),
            )
            .offset((page - 1) * limit)
            .limit(limit)
        )

        count_query = (
            select(func.count())
            .select_from(Booking)
            .where(and_(*conditions))
        )

        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)

        return (
            list(result.scalars().all()),
            count_result.scalar_one(),
        )

    async def list_all(
        self,
        page: int,
        limit: int,
        search: str | None = None,
        room_id: UUID | None = None,
        employee_id: str | None = None,
        status: str | None = None,
        from_date: date | None = None,
        to_date: date | None = None,
    ) -> tuple[list[Booking], int]:

        query = (
            select(Booking)
            .join(User, Booking.user_id == User.id)
            .options(selectinload(Booking.attendees))
        )

        count_query = (
            select(func.count())
            .select_from(Booking)
            .join(User, Booking.user_id == User.id)
        )

        conditions = []

        if search:
            pattern = f"%{search}%"

            conditions.append(
                or_(
                    Booking.booking_code.ilike(pattern),
                    Booking.title.ilike(pattern),
                    User.name.ilike(pattern),
                    User.employee_id.ilike(pattern),
                )
            )

        if room_id:
            conditions.append(Booking.room_id == room_id)

        if employee_id:
            conditions.append(
                User.employee_id == employee_id
            )

        if status:
            conditions.append(
                Booking.status == BookingStatus(status)
            )

        if from_date:
            conditions.append(
                Booking.booking_date >= from_date
            )

        if to_date:
            conditions.append(
                Booking.booking_date <= to_date
            )

        if conditions:
            query = query.where(and_(*conditions))
            count_query = count_query.where(
                and_(*conditions)
            )

        query = (
            query
            .order_by(
                Booking.booking_date.desc(),
                Booking.start_time.desc(),
            )
            .offset((page - 1) * limit)
            .limit(limit)
        )

        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)

        return (
            list(result.scalars().all()),
            count_result.scalar_one(),
        )