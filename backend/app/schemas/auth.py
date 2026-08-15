from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class RequestVerificationRequest(BaseModel):
    employee_id: str = Field(min_length=1, max_length=50)
    email: EmailStr


class VerifyEmailRequest(BaseModel):
    token: str = Field(min_length=1)


class VerifyOTPRequest(BaseModel):
    user_id: UUID
    otp: str = Field(min_length=4, max_length=10)


class ResendOTPRequest(BaseModel):
    user_id: UUID


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserMeResponse(BaseModel):
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