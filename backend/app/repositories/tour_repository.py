from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_tour import UserTour


class TourRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_user_id(
        self,
        user_id: UUID,
    ) -> UserTour | None:

        result = await self.db.execute(
            select(UserTour).where(
                UserTour.user_id == user_id
            )
        )

        return result.scalar_one_or_none()

    async def create(
        self,
        tour: UserTour,
    ) -> UserTour:

        self.db.add(tour)
        await self.db.flush()
        await self.db.refresh(tour)

        return tour

    async def update(
        self,
        tour: UserTour,
    ) -> UserTour:

        await self.db.flush()
        await self.db.refresh(tour)

        return tour