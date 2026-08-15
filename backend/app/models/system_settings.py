from __future__ import annotations

from datetime import datetime, time, timezone
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Integer, String, Time
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class SystemSettings(Base):
    __tablename__ = "system_settings"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    minimum_booking_duration: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=15,
    )

    maximum_booking_duration: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=180,
    )

    cancellation_cutoff_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=30,
    )

    reminder_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=15,
    )

    working_day_start: Mapped[time] = mapped_column(
        Time,
        nullable=False,
        default=time(9, 0),
    )

    working_day_end: Mapped[time] = mapped_column(
        Time,
        nullable=False,
        default=time(18, 0),
    )

    timezone: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="Asia/Kolkata",
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )