from pydantic import BaseModel


class UserImportResponse(BaseModel):
    total: int
    imported: int
    updated: int
    invalid: int
    duplicate: int
    failed: int
    errorReportUrl: str | None = None