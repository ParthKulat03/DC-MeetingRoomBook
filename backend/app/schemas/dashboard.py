from pydantic import BaseModel


class ChartItem(BaseModel):
    label: str
    bookings: int


class RoomUsageItem(BaseModel):
    room: str
    bookings: int


class PeakHourItem(BaseModel):
    hour: str
    bookings: int


class CancellationItem(BaseModel):
    label: str
    cancelled: int


class DashboardResponse(BaseModel):
    totalEmployees: int
    activeEmployees: int
    pendingApprovals: int
    totalBookings: int
    todaysBookings: int
    upcomingBookings: int
    cancelledBookings: int
    roomUtilization: float
    dailyBookings: list[ChartItem]
    weeklyBookings: list[ChartItem]
    monthlyBookings: list[ChartItem]
    roomUsage: list[RoomUsageItem]
    peakHours: list[PeakHourItem]
    cancellations: list[CancellationItem]