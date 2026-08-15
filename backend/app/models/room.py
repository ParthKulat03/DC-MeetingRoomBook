# from __future__ import annotations

# from datetime import datetime, timezone
# from enum import Enum
# from uuid import UUID, uuid4

# from sqlalchemy import DateTime, Integer, String, Text
# from sqlalchemy.dialects.postgresql import UUID as PGUUID
# from sqlalchemy.orm import Mapped, mapped_column, relationship

# from app.core.database import Base


# class RoomStatus(str, Enum):
#     ACTIVE = "ACTIVE"
#     INACTIVE = "INACTIVE"


# class MeetingRoom(Base):
#     __tablename__ = "meeting_rooms"

#     id: Mapped[UUID] = mapped_column(
#         PGUUID(as_uuid=True),
#         primary_key=True,
#         default=uuid4,
#     )

#     name: Mapped[str] = mapped_column(
#         String(150),
#         unique=True,
#         nullable=False,
#     )

#     description: Mapped[str | None] = mapped_column(
#         Text,
#         nullable=True,
#     )

#     capacity: Mapped[int] = mapped_column(
#         Integer,
#         nullable=False,
#     )

#     status: Mapped[RoomStatus] = mapped_column(
#         String(30),
#         default=RoomStatus.ACTIVE,
#         nullable=False,
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

#     bookings: Mapped[list["Booking"]] = relationship(
#         "Booking",
#         back_populates="room",
#     )






from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.booking import Booking


class RoomStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"


class MeetingRoom(Base):
    __tablename__ = "meeting_rooms"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    capacity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    status: Mapped[RoomStatus] = mapped_column(
        String(30),
        default=RoomStatus.ACTIVE,
        nullable=False,
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

    bookings: Mapped[list["Booking"]] = relationship(
        "Booking",
        back_populates="room",
    )