from datetime import date
from uuid import UUID

from pydantic import BaseModel


class ReportQuery(BaseModel):
    from_date: date | None = None
    to_date: date | None = None
    room_id: UUID | None = None
    employee_id: UUID | None = None


class ReportRowsResponse(BaseModel):
    rows: list[dict[str, str | int | float | None]]