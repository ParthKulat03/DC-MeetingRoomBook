# from __future__ import annotations

# from datetime import datetime, timezone
# from uuid import UUID, uuid4

# from sqlalchemy import DateTime, String, Text
# from sqlalchemy.dialects.postgresql import UUID as PGUUID
# from sqlalchemy.orm import Mapped, mapped_column

# from app.core.database import Base


# class AuditLog(Base):
#     __tablename__ = "audit_logs"

#     id: Mapped[UUID] = mapped_column(
#         PGUUID(as_uuid=True),
#         primary_key=True,
#         default=uuid4,
#     )

#     actor_id: Mapped[UUID | None] = mapped_column(
#         PGUUID(as_uuid=True),
#         nullable=True,
#         index=True,
#     )

#     action: Mapped[str] = mapped_column(
#         String(100),
#         nullable=False,
#         index=True,
#     )

#     entity_type: Mapped[str] = mapped_column(
#         String(100),
#         nullable=False,
#     )

#     entity_id: Mapped[UUID | None] = mapped_column(
#         PGUUID(as_uuid=True),
#         nullable=True,
#     )

#     description: Mapped[str | None] = mapped_column(
#         Text,
#         nullable=True,
#     )

#     created_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True),
#         default=lambda: datetime.now(timezone.utc),
#         nullable=False,
#         index=True,
#     )





from __future__ import annotations

from datetime import datetime, timezone
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    actor_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    action: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    entity_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    entity_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True),
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )