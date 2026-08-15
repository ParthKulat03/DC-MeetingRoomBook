from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.role import Role, RoleName


class RoleRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, role_id: UUID) -> Role | None:
        result = await self.db.execute(
            select(Role).where(Role.id == role_id)
        )
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Role | None:
        result = await self.db.execute(
            select(Role).where(Role.name == RoleName(name))
        )
        return result.scalar_one_or_none()

    async def create(self, role: Role) -> Role:
        self.db.add(role)
        await self.db.flush()
        await self.db.refresh(role)
        return role

    