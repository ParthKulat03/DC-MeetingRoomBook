from uuid import UUID

from app.models.notification import (
    Notification,
    NotificationType,
)
from app.repositories.notification_repository import (
    NotificationRepository,
)


class NotificationService:

    def __init__(
        self,
        notification_repository: NotificationRepository,
    ):
        self.notification_repository = (
            notification_repository
        )

    async def create(
        self,
        user_id: UUID,
        notification_type: NotificationType,
        title: str,
        message: str,
    ) -> Notification:

        notification = Notification(
            user_id=user_id,
            type=notification_type,
            title=title,
            message=message,
        )

        return await self.notification_repository.create(
            notification
        )

    async def get_user_notifications(
        self,
        user_id: UUID,
    ):

        return (
            await self.notification_repository.get_for_user(
                user_id
            )
        )

    async def mark_read(
        self,
        notification_id: UUID,
    ) -> None:

        await self.notification_repository.mark_read(
            notification_id
        )

    async def mark_all_read(
        self,
        user_id: UUID,
    ) -> None:

        await self.notification_repository.mark_all_read(
            user_id
        )