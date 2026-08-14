import { http, request } from "./client";
import { API_ROUTES } from "@/constants/apiRoutes";
import type {
  AuditLog,
  Booking,
  DashboardStats,
  ImportResult,
  MeetingRoom,
  Paginated,
  RoomStatus,
  User,
} from "@/types";

export interface AdminUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  approvalStatus?: string;
}

export interface AdminBookingsQuery {
  page?: number;
  limit?: number;
  search?: string;
  roomId?: string;
  employeeId?: string;
  status?: string;
  from?: string;
  to?: string;
}

export interface AuditLogQuery {
  page?: number;
  limit?: number;
  action?: string;
  actorId?: string;
  from?: string;
  to?: string;
}

export const adminApi = {
  dashboard: (params: { from?: string; to?: string; roomId?: string; employeeId?: string } = {}) =>
    request<DashboardStats>({ url: API_ROUTES.admin.dashboard, method: "GET", params }),

  users: (params: AdminUsersQuery = {}) =>
    request<Paginated<User>>({ url: API_ROUTES.admin.users, method: "GET", params }),
  user: (id: string) => request<{ user: User }>({ url: API_ROUTES.admin.user(id), method: "GET" }),
  createUser: (data: Partial<User>) =>
    request<{ user: User }>({ url: API_ROUTES.admin.users, method: "POST", data }),
  updateUser: (id: string, data: Partial<User>) =>
    request<{ user: User }>({ url: API_ROUTES.admin.user(id), method: "PUT", data }),
  deleteUser: (id: string) => request<void>({ url: API_ROUTES.admin.user(id), method: "DELETE" }),
  approveUser: (id: string) =>
    request<{ user: User }>({ url: API_ROUTES.admin.approveUser(id), method: "PATCH" }),
  rejectUser: (id: string) =>
    request<{ user: User }>({ url: API_ROUTES.admin.rejectUser(id), method: "PATCH" }),
  enableUser: (id: string) =>
    request<{ user: User }>({ url: API_ROUTES.admin.enableUser(id), method: "PATCH" }),
  disableUser: (id: string) =>
    request<{ user: User }>({ url: API_ROUTES.admin.disableUser(id), method: "PATCH" }),
  importUsers: async (file: File, onProgress?: (percent: number) => void) => {
    const form = new FormData();
    form.append("file", file);
    const res = await http.post<ImportResult>(API_ROUTES.admin.importUsers, form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (event.total) onProgress?.(Math.round((event.loaded / event.total) * 100));
      },
    });
    return res.data;
  },

  rooms: () => request<{ rooms: MeetingRoom[] }>({ url: API_ROUTES.admin.rooms, method: "GET" }),
  createRoom: (data: Partial<MeetingRoom>) =>
    request<{ room: MeetingRoom }>({ url: API_ROUTES.admin.rooms, method: "POST", data }),
  updateRoom: (id: string, data: Partial<MeetingRoom>) =>
    request<{ room: MeetingRoom }>({ url: API_ROUTES.admin.room(id), method: "PUT", data }),
  deleteRoom: (id: string) => request<void>({ url: API_ROUTES.admin.room(id), method: "DELETE" }),
  setRoomStatus: (id: string, status: RoomStatus) =>
    request<{ room: MeetingRoom }>({
      url: API_ROUTES.admin.roomStatus(id),
      method: "PATCH",
      data: { status },
    }),

  bookings: (params: AdminBookingsQuery = {}) =>
    request<Paginated<Booking>>({ url: API_ROUTES.admin.bookings, method: "GET", params }),
  booking: (id: string) =>
    request<{ booking: Booking }>({ url: API_ROUTES.admin.booking(id), method: "GET" }),
  updateBooking: (id: string, data: Partial<Booking>) =>
    request<{ booking: Booking }>({ url: API_ROUTES.admin.booking(id), method: "PUT", data }),
  deleteBooking: (id: string) =>
    request<void>({ url: API_ROUTES.admin.booking(id), method: "DELETE" }),

  auditLogs: (params: AuditLogQuery = {}) =>
    request<Paginated<AuditLog>>({ url: API_ROUTES.admin.auditLogs, method: "GET", params }),
};
