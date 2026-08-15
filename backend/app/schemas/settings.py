from datetime import time

from pydantic import BaseModel, Field


class SystemSettingsRequest(BaseModel):
    minimumBookingDuration: int = Field(ge=15)
    maximumBookingDuration: int = Field(gt=0)
    cancellationCutoffMinutes: int = Field(ge=0)
    reminderMinutes: int = Field(ge=0)
    workingDayStart: time
    workingDayEnd: time
    timezone: str


class SystemSettingsResponse(SystemSettingsRequest):
    id: str

    model_config = {
        "from_attributes": True
    }