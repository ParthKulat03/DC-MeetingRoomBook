# from __future__ import annotations

# from datetime import datetime, timezone
# from enum import Enum
# from uuid import UUID, uuid4

# from sqlalchemy import Boolean, DateTime, String
# from sqlalchemy.dialects.postgresql import UUID as PGUUID
# from sqlalchemy.orm import Mapped, mapped_column, relationship

# from app.core.database import Base


# class UserStatus(str, Enum):
#     ACTIVE = "ACTIVE"
#     DISABLED = "DISABLED"


# class VerificationStatus(str, Enum):
#     UNVERIFIED = "UNVERIFIED"
#     VERIFIED = "VERIFIED"


# class ApprovalStatus(str, Enum):
#     PENDING = "PENDING"
#     APPROVED = "APPROVED"
#     REJECTED = "REJECTED"


# class User(Base):
#     __tablename__ = "users"

#     id: Mapped[UUID] = mapped_column(
#         PGUUID(as_uuid=True),
#         primary_key=True,
#         default=uuid4,
#     )

#     employee_id: Mapped[str] = mapped_column(
#         String(50),
#         unique=True,
#         nullable=False,
#         index=True,
#     )

#     name: Mapped[str] = mapped_column(
#         String(150),
#         nullable=False,
#     )

#     email: Mapped[str] = mapped_column(
#         String(255),
#         unique=True,
#         nullable=False,
#         index=True,
#     )

#     password_hash: Mapped[str] = mapped_column(
#         String(255),
#         nullable=False,
#     )

#     designation: Mapped[str | None] = mapped_column(
#         String(150),
#         nullable=True,
#     )

#     role_id: Mapped[UUID] = mapped_column(
#         PGUUID(as_uuid=True),
#         nullable=False,
#         index=True,
#     )

#     status: Mapped[UserStatus] = mapped_column(
#         String(30),
#         default=UserStatus.ACTIVE,
#         nullable=False,
#     )

#     verification_status: Mapped[VerificationStatus] = mapped_column(
#         String(30),
#         default=VerificationStatus.UNVERIFIED,
#         nullable=False,
#     )

#     approval_status: Mapped[ApprovalStatus] = mapped_column(
#         String(30),
#         default=ApprovalStatus.PENDING,
#         nullable=False,
#     )

#     is_first_login: Mapped[bool] = mapped_column(
#         Boolean,
#         default=True,
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

#     role: Mapped["Role"] = relationship(
#         "Role",
#         back_populates="users",
#         primaryjoin="User.role_id == Role.id",
#         foreign_keys="User.role_id",
#     )

#     bookings: Mapped[list["Booking"]] = relationship(
#         "Booking",
#         back_populates="user",
#     )

#     notifications: Mapped[list["Notification"]] = relationship(
#         "Notification",
#         back_populates="user",
#     )

#     tour: Mapped["UserTour | None"] = relationship(
#         "UserTour",
#         back_populates="user",
#         uselist=False,
#     )






from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.booking import Booking
    from app.models.notification import Notification
    from app.models.role import Role
    from app.models.user_tour import UserTour


class UserStatus(str, Enum):
    ACTIVE = "ACTIVE"
    DISABLED = "DISABLED"


class VerificationStatus(str, Enum):
    UNVERIFIED = "UNVERIFIED"
    VERIFIED = "VERIFIED"


class ApprovalStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    employee_id: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    designation: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    role_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("roles.id"),
        nullable=False,
        index=True,
    )

    status: Mapped[UserStatus] = mapped_column(
        String(30),
        default=UserStatus.ACTIVE,
        nullable=False,
    )

    verification_status: Mapped[VerificationStatus] = mapped_column(
        String(30),
        default=VerificationStatus.UNVERIFIED,
        nullable=False,
    )

    approval_status: Mapped[ApprovalStatus] = mapped_column(
        String(30),
        default=ApprovalStatus.PENDING,
        nullable=False,
    )

    is_first_login: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
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

    role: Mapped["Role"] = relationship(
        "Role",
        back_populates="users",
    )

    bookings: Mapped[list["Booking"]] = relationship(
        "Booking",
        back_populates="user",
    )

    notifications: Mapped[list["Notification"]] = relationship(
        "Notification",
        back_populates="user",
    )

    tour: Mapped["UserTour | None"] = relationship(
        "UserTour",
        back_populates="user",
        uselist=False,
    )