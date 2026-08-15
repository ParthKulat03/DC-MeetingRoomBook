from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class UserCreateRequest(BaseModel):
    employee_id: str = Field(min_length=1, max_length=50)
    name: str = Field(min_length=1, max_length=150)
    email: EmailStr
    designation: str | None = Field(default=None, max_length=150)
    role: str = "EMPLOYEE"


class UserUpdateRequest(BaseModel):
    employee_id: str | None = Field(default=None, max_length=50)
    name: str | None = Field(default=None, max_length=150)
    email: EmailStr | None = None
    designation: str | None = Field(default=None, max_length=150)
    role: str | None = None


class UserResponse(BaseModel):
    id: UUID
    employee_id: str
    name: str
    email: EmailStr
    designation: str | None
    role: str
    status: str
    verification_status: str
    approval_status: str

    model_config = {
        "from_attributes": True
    }


class UserListQuery(BaseModel):
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)
    search: str | None = None
    status: str | None = None
    approval_status: str | None = None