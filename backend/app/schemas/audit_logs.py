from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class AuditLogResponse(BaseModel):
    id: UUID
    actor_id: UUID | None
    action: str
    entity_type: str
    entity_id: UUID | None
    description: str | None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }