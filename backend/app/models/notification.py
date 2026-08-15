# from __future__ import annotations

# from datetime import datetime, timezone
# from enum import Enum
# from uuid import UUID, uuid4

# from backend.app.models.user import User
# from sqlalchemy import Boolean, DateTime, String, Text
# from sqlalchemy.dialects.postgresql import UUID as PGUUID
# from sqlalchemy.orm import Mapped, mapped_column, relationship

# from app.core.database import Base


# class NotificationType(str, Enum):
#     BOOKING_CREATED = "BOOKING_CREATED"
#     BOOKING_UPDATED = "BOOKING_UPDATED"
#     BOOKING_CANCELLED = "BOOKING_CANCELLED"
#     SYSTEM = "SYSTEM"


# class Notification(Base):
#     __tablename__ = "notifications"

#     id: Mapped[UUID] = mapped_column(
#         PGUUID(as_uuid=True),
#         primary_key=True,
#         default=uuid4,
#     )

#     user_id: Mapped[UUID] = mapped_column(
#         PGUUID(as_uuid=True),
#         nullable=False,
#         index=True,
#     )

#     type: Mapped[NotificationType] = mapped_column(
#         String(50),
#         nullable=False,
#     )

#     title: Mapped[str] = mapped_column(
#         String(200),
#         nullable=False,
#     )

#     message: Mapped[str] = mapped_column(
#         Text,
#         nullable=False,
#     )

#     is_read: Mapped[bool] = mapped_column(
#         Boolean,
#         default=False,
#         nullable=False,
#     )

#     created_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         default=lambda: datetime.now(timezone.utc),
#         nullable=False,
#     )

#     user: Mapped["User"] = relationship(
#         "User",
#         back_populates="notifications",
#     )





from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class NotificationType(str, Enum):
    BOOKING_CREATED = "BOOKING_CREATED"
    BOOKING_UPDATED = "BOOKING_UPDATED"
    BOOKING_CANCELLED = "BOOKING_CANCELLED"
    SYSTEM = "SYSTEM"


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    type: Mapped[NotificationType] = mapped_column(
        String(50),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    is_read: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="notifications",
    )