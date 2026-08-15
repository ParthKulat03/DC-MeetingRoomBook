from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.system_settings import SystemSettings


class SettingsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get(self) -> SystemSettings | None:

        result = await self.db.execute(
            select(SystemSettings)
            .limit(1)
        )

        return result.scalar_one_or_none()

    async def create(
        self,
        settings: SystemSettings,
    ) -> SystemSettings:

        self.db.add(settings)
        await self.db.flush()
        await self.db.refresh(settings)

        return settings

    async def update(
        self,
        settings: SystemSettings,
    ) -> SystemSettings:

        await self.db.flush()
        await self.db.refresh(settings)

        return settings