from datetime import datetime
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit_log import AuditLog


class AuditLogRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        audit_log: AuditLog,
    ) -> AuditLog:

        self.db.add(audit_log)
        await self.db.flush()
        await self.db.refresh(audit_log)

        return audit_log

    async def list(
        self,
        page: int,
        limit: int,
        action: str | None = None,
        actor_id: UUID | None = None,
        from_date: datetime | None = None,
        to_date: datetime | None = None,
    ) -> tuple[list[AuditLog], int]:

        query = select(AuditLog)
        count_query = (
            select(func.count())
            .select_from(AuditLog)
        )

        conditions = []

        if action:
            conditions.append(
                AuditLog.action == action
            )

        if actor_id:
            conditions.append(
                AuditLog.actor_id == actor_id
            )

        if from_date:
            conditions.append(
                AuditLog.created_at >= from_date
            )

        if to_date:
            conditions.append(
                AuditLog.created_at <= to_date
            )

        if conditions:
            query = query.where(*conditions)
            count_query = count_query.where(*conditions)

        query = (
            query
            .order_by(AuditLog.created_at.desc())
            .offset((page - 1) * limit)
            .limit(limit)
        )

        result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)

        return (
            list(result.scalars().all()),
            count_result.scalar_one(),
        )