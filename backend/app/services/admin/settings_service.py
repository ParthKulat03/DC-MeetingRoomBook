from app.core.exceptions import NotFoundException
from app.models.system_settings import SystemSettings
from app.repositories.settings_repository import (
    SettingsRepository,
)
from app.schemas.settings import SystemSettingsRequest


class SettingsService:

    def __init__(
        self,
        repository: SettingsRepository,
    ):
        self.repository = repository

    async def get_settings(
        self,
    ) -> SystemSettings:

        settings = await self.repository.get()

        if not settings:
            raise NotFoundException(
                "System settings not configured"
            )

        return settings

    async def update_settings(
        self,
        data: SystemSettingsRequest,
    ) -> SystemSettings:

        settings = await self.repository.get()

        if not settings:
            settings = SystemSettings()

        settings.minimum_booking_duration = (
            data.minimumBookingDuration
        )

        settings.maximum_booking_duration = (
            data.maximumBookingDuration
        )

        settings.cancellation_cutoff_minutes = (
            data.cancellationCutoffMinutes
        )

        settings.reminder_minutes = (
            data.reminderMinutes
        )

        settings.working_day_start = (
            data.workingDayStart
        )

        settings.working_day_end = (
            data.workingDayEnd
        )

        settings.timezone = data.timezone

        if settings.id is None:
            return await self.repository.create(
                settings
            )

        return await self.repository.update(
            settings
        )