from collections.abc import AsyncGenerator

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.exceptions import ForbiddenException, UnauthorizedException
from app.core.security import decode_token
from app.models.user import User
from app.repositories.user_repository import UserRepository


security = HTTPBearer(
    auto_error=False,
)


async def get_database() -> AsyncGenerator[AsyncSession, None]:
    async for session in get_db():
        yield session


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: AsyncSession = Depends(get_database),
) -> User:
    if not credentials:
        raise UnauthorizedException(
            "Authentication credentials are required"
        )

    token = credentials.credentials

    try:
        payload = decode_token(token)
    except Exception:
        raise UnauthorizedException(
            "Invalid or expired access token"
        )

    if payload.get("type") != "access":
        raise UnauthorizedException(
            "Invalid access token"
        )

    user_id = payload.get("sub")

    if not user_id:
        raise UnauthorizedException(
            "Invalid access token"
        )

    repository = UserRepository(db)

    user = await repository.get_by_id(user_id)

    if not user:
        raise UnauthorizedException(
            "User not found"
        )

    if user.status.value == "DISABLED":
        raise ForbiddenException(
            "User account is disabled"
        )

    return user


async def require_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.role:
        raise ForbiddenException(
            "User role is not configured"
        )

    if current_user.role.name.value != "ADMIN":
        raise ForbiddenException(
            "Administrator access is required"
        )

    return current_user


def get_user_repository(
    db: AsyncSession = Depends(get_database),
) -> UserRepository:
    return UserRepository(db)