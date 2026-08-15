from uuid import UUID

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import (
    ApprovalStatus,
    User,
    UserStatus,
)


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: UUID) -> User | None:
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(
            select(User).where(User.email == email.lower())
        )
        return result.scalar_one_or_none()

    async def get_by_employee_id(
        self,
        employee_id: str,
    ) -> User | None:
        result = await self.db.execute(
            select(User).where(
                User.employee_id == employee_id
            )
        )
        return result.scalar_one_or_none()

    async def create(self, user: User) -> User:
        self.db.add(user)
        await self.db.flush()
        await self.db.refresh(user)
        return user

    async def update(self, user: User) -> User:
        await self.db.flush()
        await self.db.refresh(user)
        return user

    async def delete(self, user: User) -> None:
        await self.db.delete(user)
        await self.db.flush()

    async def list_users(
        self,
        page: int,
        limit: int,
        search: str | None = None,
        status: str | None = None,
        approval_status: str | None = None,
    ) -> tuple[list[User], int]:

        query = select(User)
        count_query = select(func.count()).select_from(User)

        if search:
            pattern = f"%{search}%"

            condition = or_(
                User.name.ilike(pattern),
                User.email.ilike(pattern),
                User.employee_id.ilike(pattern),
            )

            query = query.where(condition)
            count_query = count_query.where(condition)

        if status:
            query = query.where(User.status == UserStatus(status))
            count_query = count_query.where(
                User.status == UserStatus(status)
            )

        if approval_status:
            query = query.where(
                User.approval_status
                == ApprovalStatus(approval_status)
            )
            count_query = count_query.where(
                User.approval_status
                == ApprovalStatus(approval_status)
            )

        offset = (page - 1) * limit

        query = (
            query
            .order_by(User.created_at.desc())
            .offset(offset)
            .limit(limit)
        )

        users_result = await self.db.execute(query)
        count_result = await self.db.execute(count_query)

        return (
            list(users_result.scalars().all()),
            count_result.scalar_one(),
        )