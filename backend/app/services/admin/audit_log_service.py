from uuid import UUID

from app.models.audit_log import AuditLog
from app.repositories.audit_log_repository import (
    AuditLogRepository,
)


class AuditLogService:

    def __init__(
        self,
        repository: AuditLogRepository,
    ):
        self.repository = repository

    async def log(
        self,
        actor_id: UUID | None,
        action: str,
        entity_type: str,
        entity_id: UUID | None,
        description: str | None = None,
    ) -> AuditLog:

        audit_log = AuditLog(
            actor_id=actor_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            description=description,
        )

        return await self.repository.create(
            audit_log
        )