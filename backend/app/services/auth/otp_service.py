import secrets
from datetime import datetime, timedelta, timezone
from uuid import UUID

from app.core.security import hash_password, verify_password
from app.models.auth import OTPCode, OTPPurpose
from app.repositories.auth_repository import AuthRepository


class OTPService:

    OTP_EXPIRY_MINUTES = 10

    def __init__(
        self,
        auth_repository: AuthRepository,
    ):
        self.auth_repository = auth_repository

    async def generate_otp(
        self,
        user_id: UUID,
        purpose: OTPPurpose,
    ) -> str:

        code = f"{secrets.randbelow(1_000_000):06d}"

        otp = OTPCode(
            user_id=user_id,
            code_hash=hash_password(code),
            purpose=purpose,
            expires_at=(
                datetime.now(timezone.utc)
                + timedelta(
                    minutes=self.OTP_EXPIRY_MINUTES
                )
            ),
        )

        await self.auth_repository.create_otp(otp)

        # Email/SMS delivery will be implemented later.
        return code

    async def verify_otp(
        self,
        user_id: UUID,
        purpose: OTPPurpose,
        code: str,
    ) -> bool:

        otp = await self.auth_repository.get_valid_otp(
            user_id=user_id,
            purpose=purpose,
            now=datetime.now(timezone.utc),
        )

        if not otp:
            return False

        if not verify_password(
            code,
            otp.code_hash,
        ):
            return False

        otp.used = True

        return True