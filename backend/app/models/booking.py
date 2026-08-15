# from __future__ import annotations

# from datetime import date, datetime, time, timezone
# from enum import Enum
# from uuid import UUID, uuid4

# from sqlalchemy import Date, DateTime, String, Text, Time
# from sqlalchemy.dialects.postgresql import UUID as PGUUID
# from sqlalchemy.orm import Mapped, mapped_column, relationship

# from app.core.database import Base


# class BookingStatus(str, Enum):
#     CONFIRMED = "CONFIRMED"
#     CANCELLED = "CANCELLED"


# class Booking(Base):
#     __tablename__ = "bookings"

#     id: Mapped[UUID] = mapped_column(
#         PGUUID(as_uuid=True),
#         primary_key=True,
#         default=uuid4,
#     )

#     booking_code: Mapped[str] = mapped_column(
#         String(30),
#         unique=True,
#         nullable=False,
#         index=True,
#     )

#     room_id: Mapped[UUID] = mapped_column(
#         PGUUID(as_uuid=True),
#         nullable=False,
#         index=True,
#     )

#     user_id: Mapped[UUID] = mapped_column(
#         PGUUID(as_uuid=True),
#         nullable=False,
#         index=True,
#     )

#     booking_date: Mapped[date] = mapped_column(
#         Date,
#         nullable=False,
#         index=True,
#     )

#     start_time: Mapped[time] = mapped_column(
#         Time,
#         nullable=False,
#     )

#     end_time: Mapped[time] = mapped_column(
#         Time,
#         nullable=False,
#     )

#     title: Mapped[str] = mapped_column(
#         String(200),
#         nullable=False,
#     )

#     purpose: Mapped[str | None] = mapped_column(
#         Text,
#         nullable=True,
#     )

#     notes: Mapped[str | None] = mapped_column(
#         Text,
#         nullable=True,
#     )

#     status: Mapped[BookingStatus] = mapped_column(
#         String(30),
#         default=BookingStatus.CONFIRMED,
#         nullable=False,
#         index=True,
#     )

#     created_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         default=lambda: datetime.now(timezone.utc),
#         nullable=False,
#     )

#     updated_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         default=lambda: datetime.now(timezone.utc),
#         onupdate=lambda: datetime.now(timezone.utc),
#         nullable=False,
#     )

#     room: Mapped["MeetingRoom"] = relationship(
#         "MeetingRoom",
#         back_populates="bookings",
#     )

#     user: Mapped["User"] = relationship(
#         "User",
#         back_populates="bookings",
#     )

#     attendees: Mapped[list["BookingAttendee"]] = relationship(
#         "BookingAttendee",
#         back_populates="booking",
#         cascade="all, delete-orphan",
#     )


# class BookingAttendee(Base):
#     __tablename__ = "booking_attendees"

#     id: Mapped[UUID] = mapped_column(
#         PGUUID(as_uuid=True),
#         primary_key=True,
#         default=uuid4,
#     )

#     booking_id: Mapped[UUID] = mapped_column(
#         PGUUID(as_uuid=True),
#         nullable=False,
#         index=True,
#     )

#     name: Mapped[str] = mapped_column(
#         String(150),
#         nullable=False,
#     )

#     designation: Mapped[str | None] = mapped_column(
#         String(150),
#         nullable=True,
#     )

#     booking: Mapped["Booking"] = relationship(
#         "Booking",
#         back_populates="attendees",
#     )







from __future__ import annotations

from datetime import date, datetime, time, timezone
from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Date, DateTime, ForeignKey, String, Text, Time
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.room import MeetingRoom
    from app.models.user import User


class BookingStatus(str, Enum):
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    booking_code: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
    )

    room_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("meeting_rooms.id"),
        nullable=False,
        index=True,
    )

    user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    booking_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )

    start_time: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    end_time: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    purpose: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    status: Mapped[BookingStatus] = mapped_column(
        String(30),
        default=BookingStatus.CONFIRMED,
        nullable=False,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    room: Mapped["MeetingRoom"] = relationship(
        "MeetingRoom",
        back_populates="bookings",
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="bookings",
    )

    attendees: Mapped[list["BookingAttendee"]] = relationship(
        "BookingAttendee",
        back_populates="booking",
        cascade="all, delete-orphan",
    )


class BookingAttendee(Base):
    __tablename__ = "booking_attendees"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    booking_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("bookings.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    designation: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    booking: Mapped["Booking"] = relationship(
        "Booking",
        back_populates="attendees",
    )