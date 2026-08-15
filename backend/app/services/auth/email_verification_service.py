import secrets
from datetime import datetime, timedelta, timezone
from uuid import UUID

from app.models.auth import EmailVerification
from app.repositories.auth_repository import AuthRepository
from app.repositories.user_repository import UserRepository
from app.models.user import VerificationStatus


class EmailVerificationService:

    EXPIRY_HOURS = 24

    def __init__(
        self,
        auth_repository: AuthRepository,
        user_repository: UserRepository,
    ):
        self.auth_repository = auth_repository
        self.user_repository = user_repository

    async def create_verification_token(
        self,
        user_id: UUID,
    ) -> str:

        token = secrets.token_urlsafe(32)

        record = EmailVerification(
            user_id=user_id,
            token=token,
            expires_at=(
                datetime.now(timezone.utc)
                + timedelta(
                    hours=self.EXPIRY_HOURS
                )
            ),
        )

        await self.auth_repository.create_email_verification(
            record
        )

        return token

    async def verify_email(
        self,
        token: str,
    ):

        record = (
            await self.auth_repository.get_email_verification(
                token
            )
        )

        if not record:
            return False

        if record.expires_at < datetime.now(timezone.utc):
            return False

        user = await self.user_repository.get_by_id(
            record.user_id
        )

        if not user:
            return False

        record.verified = True
        user.verification_status = (
            VerificationStatus.VERIFIED
        )

        await self.user_repository.update(user)

        return True