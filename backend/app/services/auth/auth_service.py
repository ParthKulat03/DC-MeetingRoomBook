from uuid import UUID

from app.core.exceptions import (
    ConflictException,
    ForbiddenException,
    UnauthorizedException,
)
from app.core.security import verify_password
from app.models.auth import OTPPurpose
from app.models.user import (
    ApprovalStatus,
    User,
    UserStatus,
    VerificationStatus,
)
from app.repositories.user_repository import UserRepository
from app.services.auth.otp_service import OTPService
from app.services.auth.token_service import TokenService
from app.schemas.auth import LoginRequest


class AuthService:

    def __init__(
        self,
        user_repository: UserRepository,
        otp_service: OTPService,
        token_service: TokenService,
    ):
        self.user_repository = user_repository
        self.otp_service = otp_service
        self.token_service = token_service

    async def login(
        self,
        data: LoginRequest,
    ) -> dict:

        user = await self.user_repository.get_by_email(
            data.email
        )

        if not user:
            raise UnauthorizedException(
                "Invalid email or password"
            )

        if not verify_password(
            data.password,
            user.password_hash,
        ):
            raise UnauthorizedException(
                "Invalid email or password"
            )

        if user.status == UserStatus.DISABLED:
            raise ForbiddenException(
                "Your account is disabled"
            )

        if (
            user.verification_status
            != VerificationStatus.VERIFIED
        ):
            raise ForbiddenException(
                "Email verification is required"
            )

        if (
            user.approval_status
            != ApprovalStatus.APPROVED
        ):
            raise ForbiddenException(
                "Your account is awaiting approval"
            )

        role_name = (
            user.role.name.value
            if user.role
            else "EMPLOYEE"
        )

        access_token = (
            self.token_service.create_access_token(
                str(user.id),
                role_name,
            )
        )

        return {
            "access_token": access_token,
            "refresh_token": access_token,
            "token_type": "bearer",
        }