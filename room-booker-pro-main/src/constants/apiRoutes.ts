export const API_ROUTES = {
  auth: {
    requestVerification: "/auth/request-verification",
    verifyEmail: "/auth/verify-email",
    verifyOtp: "/auth/verify-otp",
    resendOtp: "/auth/resend-otp",
    login: "/auth/login",
    logout: "/auth/logout",
    me: "/auth/me",
  },
  rooms: {
    list: "/rooms",
    detail: (id: string) => `/rooms/${id}`,
    availability: "/rooms/availability",
  },
  bookings: {
    create: "/bookings",
    my: "/bookings/my",
    detail: (id: string) => `/bookings/${id}`,
    cancel: (id: string) => `/bookings/${id}`,
  },
  tour: {
    get: "/user/tour",
    complete: "/user/tour/complete",
    reset: "/user/tour/reset",
  },
  notifications: {
    list: "/notifications",
    read: (id: string) => `/notifications/${id}/read`,
    readAll: "/notifications/read-all",
  },
  admin: {
    dashboard: "/admin/dashboard",
    users: "/admin/users",
    user: (id: string) => `/admin/users/${id}`,
    approveUser: (id: string) => `/admin/users/${id}/approve`,
    rejectUser: (id: string) => `/admin/users/${id}/reject`,
    enableUser: (id: string) => `/admin/users/${id}/enable`,
    disableUser: (id: string) => `/admin/users/${id}/disable`,
    importUsers: "/admin/users/import",
    rooms: "/admin/rooms",
    room: (id: string) => `/admin/rooms/${id}`,
    roomStatus: (id: string) => `/admin/rooms/${id}/status`,
    bookings: "/admin/bookings",
    booking: (id: string) => `/admin/bookings/${id}`,
    auditLogs: "/admin/audit-logs",
    settings: "/admin/settings",
    reports: {
      bookings: "/admin/reports/bookings",
      roomUtilization: "/admin/reports/room-utilization",
      cancellations: "/admin/reports/cancellations",
    },
  },
} as const;

export const APP_ROUTES = {
  login: "/login",
  verifyEmail: "/verify-email",
  verifyOtp: "/verify-otp",
  pendingApproval: "/pending-approval",
  dashboard: "/dashboard",
  bookings: "/bookings",
  bookingHistory: "/bookings/history",
  admin: "/admin",
  adminDashboard: "/admin/dashboard",
  adminUsers: "/admin/users",
  adminRooms: "/admin/rooms",
  adminBookings: "/admin/bookings",
  adminReports: "/admin/reports",
  adminAuditLogs: "/admin/audit-logs",
  adminSettings: "/admin/settings",
} as const;

export const SLOT_MINUTES = 15;
export const DEFAULT_DAY_START = "09:00";
export const DEFAULT_DAY_END = "18:00";
export const AUTH_TOKEN_KEY = "mrb.token";
export const THEME_KEY = "mrb.theme";
