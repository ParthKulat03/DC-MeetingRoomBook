from datetime import datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.auth import (
    AuthSession,
    EmailVerification,
    OTPCode,
    OTPPurpose,
)


class AuthRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_email_verification(
        self,
        record: EmailVerification,
    ) -> EmailVerification:
        self.db.add(record)
        await self.db.flush()
        await self.db.refresh(record)
        return record

    async def get_email_verification(
        self,
        token: str,
    ) -> EmailVerification | None:
        result = await self.db.execute(
            select(EmailVerification).where(
                EmailVerification.token == token,
                EmailVerification.verified.is_(False),
            )
        )
        return result.scalar_one_or_none()

    async def create_otp(
        self,
        otp: OTPCode,
    ) -> OTPCode:
        self.db.add(otp)
        await self.db.flush()
        await self.db.refresh(otp)
        return otp

    async def get_valid_otp(
        self,
        user_id: UUID,
        purpose: OTPPurpose,
        now: datetime,
    ) -> OTPCode | None:
        result = await self.db.execute(
            select(OTPCode)
            .where(
                OTPCode.user_id == user_id,
                OTPCode.purpose == purpose,
                OTPCode.used.is_(False),
                OTPCode.expires_at > now,
            )
            .order_by(OTPCode.created_at.desc())
        )
        return result.scalars().first()

    async def create_session(
        self,
        session: AuthSession,
    ) -> AuthSession:
        self.db.add(session)
        await self.db.flush()
        await self.db.refresh(session)
        return session

    async def revoke_session(
        self,
        session_id: UUID,
    ) -> None:
        result = await self.db.execute(
            select(AuthSession).where(
                AuthSession.id == session_id
            )
        )

        session = result.scalar_one_or_none()

        if session:
            session.revoked = True
            await self.db.flush()

    async def get_session(
        self,
        session_id: UUID,
    ) -> AuthSession | None:
        result = await self.db.execute(
            select(AuthSession).where(
                AuthSession.id == session_id
            )
        )
        return result.scalar_one_or_none()