# from __future__ import annotations

# from datetime import datetime, timezone
# from enum import Enum
# from uuid import UUID, uuid4

# from sqlalchemy import Boolean, DateTime, String
# from sqlalchemy.dialects.postgresql import UUID as PGUUID
# from sqlalchemy.orm import Mapped, mapped_column

# from app.core.database import Base


# class OTPPurpose(str, Enum):
#     EMAIL_VERIFICATION = "EMAIL_VERIFICATION"
#     LOGIN = "LOGIN"
#     PASSWORD_RESET = "PASSWORD_RESET"


# class EmailVerification(Base):
#     __tablename__ = "email_verifications"

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

#     token: Mapped[str] = mapped_column(
#         String(255),
#         unique=True,
#         nullable=False,
#         index=True,
#     )

#     expires_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         nullable=False,
#     )

#     verified: Mapped[bool] = mapped_column(
#         Boolean,
#         default=False,
#         nullable=False,
#     )

#     created_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         default=lambda: datetime.now(timezone.utc),
#         nullable=False,
#     )


# class OTPCode(Base):
#     __tablename__ = "otp_codes"

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

#     code_hash: Mapped[str] = mapped_column(
#         String(255),
#         nullable=False,
#     )

#     purpose: Mapped[OTPPurpose] = mapped_column(
#         String(50),
#         nullable=False,
#     )

#     expires_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         nullable=False,
#     )

#     used: Mapped[bool] = mapped_column(
#         Boolean,
#         default=False,
#         nullable=False,
#     )

#     created_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         default=lambda: datetime.now(timezone.utc),
#         nullable=False,
#     )


# class AuthSession(Base):
#     __tablename__ = "auth_sessions"

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

#     refresh_token_hash: Mapped[str] = mapped_column(
#         String(255),
#         nullable=False,
#     )

#     expires_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         nullable=False,
#     )

#     revoked: Mapped[bool] = mapped_column(
#         Boolean,
#         default=False,
#         nullable=False,
#     )

#     created_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         default=lambda: datetime.now(timezone.utc),
#         nullable=False,
#     )






from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class OTPPurpose(str, Enum):
    EMAIL_VERIFICATION = "EMAIL_VERIFICATION"
    LOGIN = "LOGIN"
    PASSWORD_RESET = "PASSWORD_RESET"


class EmailVerification(Base):
    __tablename__ = "email_verifications"

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

    token: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class OTPCode(Base):
    __tablename__ = "otp_codes"

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

    code_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    purpose: Mapped[OTPPurpose] = mapped_column(
        String(50),
        nullable=False,
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    used: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class AuthSession(Base):
    __tablename__ = "auth_sessions"

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

    refresh_token_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    revoked: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )