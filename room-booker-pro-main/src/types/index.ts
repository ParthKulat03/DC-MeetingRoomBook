export type ID = string;

export type AccountStatus = "ACTIVE" | "DISABLED";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type VerificationStatus = "UNVERIFIED" | "VERIFIED";
export type UserRole = "EMPLOYEE" | "ADMIN";

export interface User {
  id: ID;
  employeeId: string;
  name: string;
  email: string;
  designation: string;
  role: UserRole;
  verification: VerificationStatus;
  approval: ApprovalStatus;
  status: AccountStatus;
  createdAt: string;
}

export type RoomStatus = "ACTIVE" | "INACTIVE";

export interface MeetingRoom {
  id: ID;
  name: string;
  description: string;
  capacity: number;
  status: RoomStatus;
}

export type BookingStatus = "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface BookingAttendee {
  name: string;
  designation: string;
}

export interface Booking {
  id: ID;
  bookingId: string;
  roomId: ID;
  roomName: string;
  userId: ID;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  purpose: string;
  notes?: string;
  attendees: BookingAttendee[];
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  roomId: ID;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  purpose: string;
  notes?: string;
  attendees: BookingAttendee[];
}

export interface AvailabilityBlock {
  bookingId: string;
  startTime: string;
  endTime: string;
  title?: string;
  isOwn: boolean;
}

export interface AvailabilityResponse {
  roomId: ID;
  date: string;
  workingDayStart: string;
  workingDayEnd: string;
  blocks: AvailabilityBlock[];
}

export interface Notification {
  id: ID;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: ID;
  actor: string;
  action: string;
  description: string;
  entity: string;
  timestamp: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingApprovals: number;
  totalBookings: number;
  todaysBookings: number;
  upcomingBookings: number;
  cancelledBookings: number;
  roomUtilization: number;
  dailyBookings: { label: string; bookings: number }[];
  weeklyBookings: { label: string; bookings: number }[];
  monthlyBookings: { label: string; bookings: number }[];
  roomUsage: { room: string; bookings: number }[];
  peakHours: { hour: string; bookings: number }[];
  cancellations: { label: string; cancelled: number }[];
}

export interface SystemSettings {
  minimumBookingDuration: number;
  maximumBookingDuration: number;
  cancellationCutoffMinutes: number;
  reminderMinutes: number;
  workingDayStart: string;
  workingDayEnd: string;
  timezone: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ImportResult {
  total: number;
  imported: number;
  updated: number;
  invalid: number;
  duplicate: number;
  failed: number;
  errorReportUrl?: string;
}

export type AuthStage =
  | "NOT_REGISTERED"
  | "VERIFICATION_REQUIRED"
  | "OTP_REQUIRED"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "DISABLED";

export interface AuthStageResponse {
  stage: AuthStage;
  message?: string;
  token?: string;
  user?: User;
}

export type WsEventName =
  | "BOOKING_CREATED"
  | "BOOKING_UPDATED"
  | "BOOKING_CANCELLED"
  | "AVAILABILITY_UPDATED"
  | "ROOM_UPDATED"
  | "ADMIN_BOOKING_UPDATED";

export interface WsEvent {
  event: WsEventName;
  roomId?: ID;
  date?: string;
  bookingId?: ID;
}

export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
}
