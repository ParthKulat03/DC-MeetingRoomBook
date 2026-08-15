# from __future__ import annotations

# from datetime import datetime, timezone
# from enum import Enum
# from uuid import UUID, uuid4

# from sqlalchemy import DateTime, String, Text
# from sqlalchemy.dialects.postgresql import UUID as PGUUID
# from sqlalchemy.orm import Mapped, mapped_column, relationship

# from app.core.database import Base


# class RoleName(str, Enum):
#     EMPLOYEE = "EMPLOYEE"
#     ADMIN = "ADMIN"


# class Role(Base):
#     __tablename__ = "roles"

#     id: Mapped[UUID] = mapped_column(
#         PGUUID(as_uuid=True),
#         primary_key=True,
#         default=uuid4,
#     )

#     name: Mapped[RoleName] = mapped_column(
#         String(50),
#         unique=True,
#         nullable=False,
#     )

#     description: Mapped[str | None] = mapped_column(
#         Text,
#         nullable=True,
#     )

#     created_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         default=lambda: datetime.now(timezone.utc),
#         nullable=False,
#     )

#     users: Mapped[list["User"]] = relationship(
#         "User",
#         back_populates="role",
#     )







from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import DateTime, String, Text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class RoleName(str, Enum):
    EMPLOYEE = "EMPLOYEE"
    ADMIN = "ADMIN"


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    name: Mapped[RoleName] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    users: Mapped[list["User"]] = relationship(
        "User",
        back_populates="role",
    )