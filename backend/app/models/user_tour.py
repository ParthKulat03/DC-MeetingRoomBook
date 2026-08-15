# from __future__ import annotations

# from datetime import datetime, timezone
# from uuid import UUID, uuid4

# from backend.app.models.user import User
# from sqlalchemy import Boolean, DateTime
# from sqlalchemy.dialects.postgresql import UUID as PGUUID
# from sqlalchemy.orm import Mapped, mapped_column, relationship

# from app.core.database import Base


# class UserTour(Base):
#     __tablename__ = "user_tours"

#     id: Mapped[UUID] = mapped_column(
#         PGUUID(as_uuid=True),
#         primary_key=True,
#         default=uuid4,
#     )

#     user_id: Mapped[UUID] = mapped_column(
#         PGUUID(as_uuid=True),
#         unique=True,
#         nullable=False,
#         index=True,
#     )

#     completed: Mapped[bool] = mapped_column(
#         Boolean,
#         default=False,
#         nullable=False,
#     )

#     updated_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         default=lambda: datetime.now(timezone.utc),
#         onupdate=lambda: datetime.now(timezone.utc),
#         nullable=False,
#     )

#     user: Mapped["User"] = relationship(
#         "User",
#         back_populates="tour",
#     )







from __future__ import annotations

from datetime import datetime, timezone
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class UserTour(Base):
    __tablename__ = "user_tours"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    completed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="tour",
    )