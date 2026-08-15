from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification


class NotificationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self,
        notification: Notification,
    ) -> Notification:

        self.db.add(notification)
        await self.db.flush()
        await self.db.refresh(notification)

        return notification

    async def get_for_user(
        self,
        user_id: UUID,
    ) -> list[Notification]:

        result = await self.db.execute(
            select(Notification)
            .where(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
        )

        return list(result.scalars().all())

    async def get_by_id(
        self,
        notification_id: UUID,
    ) -> Notification | None:

        result = await self.db.execute(
            select(Notification).where(
                Notification.id == notification_id
            )
        )

        return result.scalar_one_or_none()

    async def mark_read(
        self,
        notification_id: UUID,
    ) -> None:

        notification = await self.get_by_id(
            notification_id
        )

        if notification:
            notification.is_read = True
            await self.db.flush()

    async def mark_all_read(
        self,
        user_id: UUID,
    ) -> None:

        notifications = await self.get_for_user(user_id)

        for notification in notifications:
            notification.is_read = True

        await self.db.flush()