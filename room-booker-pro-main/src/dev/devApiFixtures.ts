/**
 * ISOLATED DEV FIXTURES — delete this folder once the real backend is connected.
 * Enabled only when VITE_ENABLE_DEV_MOCKS is not "false".
 * It swaps the axios adapter; no application code depends on this module.
 */
import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from "axios";
import { http } from "@/api/client";
import type {
  AuditLog,
  Booking,
  DashboardStats,
  MeetingRoom,
  Notification,
  SystemSettings,
  User,
} from "@/types";
import { toISODate } from "@/utils/time";

const today = toISODate(new Date());

const users: User[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `u-${i + 1}`,
  employeeId: `EMP-${String(1000 + i)}`,
  name:
    ["Aarav Shah", "Neha Kapoor", "Rahul Menon", "Priya Nair", "Vikram Rao", "Sara Iyer"][i % 6] +
    (i > 5 ? ` ${Math.floor(i / 6) + 1}` : ""),
  email: `employee${i + 1}@company.com`,
  designation: ["Developer", "Designer", "Manager", "Analyst", "QA Engineer", "Architect"][i % 6]!,
  role: i === 0 ? "ADMIN" : "EMPLOYEE",
  verification: i % 5 === 0 ? "UNVERIFIED" : "VERIFIED",
  approval: i % 7 === 0 ? "PENDING" : "APPROVED",
  status: i % 9 === 0 ? "DISABLED" : "ACTIVE",
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

const adminUser: User = {
  id: "u-me",
  employeeId: "EMP-2041",
  name: "Snehal Patil",
  email: "admin@company.com",
  designation: "Workplace Administrator",
  role: "ADMIN",
  verification: "VERIFIED",
  approval: "APPROVED",
  status: "ACTIVE",
  createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
};

const employeeUser: User = {
  id: "u-me",
  employeeId: "EMP-2087",
  name: "Rohan Deshmukh",
  email: "employee@company.com",
  designation: "Product Engineer",
  role: "EMPLOYEE",
  verification: "VERIFIED",
  approval: "APPROVED",
  status: "ACTIVE",
  createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
};

let currentUser: User = employeeUser;

const rooms: MeetingRoom[] = [
  { id: "1", name: "Alpha", description: "Meeting Room Alpha", capacity: 8, status: "ACTIVE" },
  { id: "2", name: "Beta", description: "Meeting Room Beta", capacity: 14, status: "ACTIVE" },
];

let counter = 3;
const bookings: Booking[] = [
  mkBooking("1", today, "10:00", "11:15", "Project Discussion", currentUser),
  mkBooking("1", today, "14:00", "15:00", "Sprint Review", users[2]!),
  mkBooking("2", today, "11:30", "12:30", "Client Sync", users[3]!),
  mkBooking("2", today, "16:00", "17:00", "Design Critique", currentUser),
];

function mkBooking(
  roomId: string,
  date: string,
  startTime: string,
  endTime: string,
  title: string,
  user: User,
): Booking {
  const id = `b-${counter++}`;
  return {
    id,
    bookingId: `MR-${date.replace(/-/g, "")}-${String(counter).padStart(3, "0")}`,
    roomId,
    roomName: rooms.find((r) => r.id === roomId)?.name ?? "Alpha",
    userId: user.id,
    userName: user.name,
    date,
    startTime,
    endTime,
    title,
    purpose: "Internal discussion",
    notes: "",
    attendees: [{ name: user.name, designation: user.designation }],
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const notifications: Notification[] = [
  {
    id: "n-1",
    title: "Booking confirmed",
    message: "Alpha is reserved for you today at 10:00 AM.",
    type: "SUCCESS",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "n-2",
    title: "Room availability updated",
    message: "Beta has a new booking this afternoon.",
    type: "INFO",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

const auditLogs: AuditLog[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `a-${i}`,
  actor: users[i % users.length]!.name,
  action: ["BOOKING_CREATED", "USER_APPROVED", "ROOM_UPDATED", "BOOKING_CANCELLED"][i % 4]!,
  description: "Action performed from the web application.",
  entity: ["Booking", "User", "Room", "Booking"][i % 4]!,
  timestamp: new Date(Date.now() - i * 5400000).toISOString(),
}));

let settings: SystemSettings = {
  minimumBookingDuration: 15,
  maximumBookingDuration: 180,
  cancellationCutoffMinutes: 30,
  reminderMinutes: 15,
  workingDayStart: "09:00",
  workingDayEnd: "18:00",
  timezone: "Asia/Kolkata",
};

let tourCompleted = false;

const dashboard = (): DashboardStats => ({
  totalEmployees: users.length + 1,
  activeEmployees: users.filter((u) => u.status === "ACTIVE").length,
  pendingApprovals: users.filter((u) => u.approval === "PENDING").length,
  totalBookings: bookings.length + 128,
  todaysBookings: bookings.filter((b) => b.date === today).length,
  upcomingBookings: 7,
  cancelledBookings: 9,
  roomUtilization: 68,
  dailyBookings: ["Mon", "Tue", "Wed", "Thu", "Fri"].map((label, i) => ({
    label,
    bookings: 6 + ((i * 5) % 9),
  })),
  weeklyBookings: ["W1", "W2", "W3", "W4"].map((label, i) => ({ label, bookings: 24 + i * 6 })),
  monthlyBookings: ["Apr", "May", "Jun", "Jul", "Aug"].map((label, i) => ({
    label,
    bookings: 80 + i * 11,
  })),
  roomUsage: [
    { room: "Alpha", bookings: 74 },
    { room: "Beta", bookings: 58 },
  ],
  peakHours: ["09", "10", "11", "12", "14", "15", "16", "17"].map((hour, i) => ({
    hour: `${hour}:00`,
    bookings: 3 + ((i * 4) % 11),
  })),
  cancellations: ["Mon", "Tue", "Wed", "Thu", "Fri"].map((label, i) => ({
    label,
    cancelled: (i * 3) % 5,
  })),
});

const paginate = <T,>(items: T[], config: AxiosRequestConfig) => {
  const page = Number(config.params?.page ?? 1);
  const limit = Number(config.params?.limit ?? 10);
  return { items: items.slice((page - 1) * limit, page * limit), total: items.length, page, limit };
};

const ok = <T,>(config: AxiosRequestConfig, data: T, status = 200): AxiosResponse<T> => ({
  data,
  status,
  statusText: "OK",
  headers: {},
  config: config as never,
});

const delay = (ms = 320) => new Promise((r) => setTimeout(r, ms));

const handle = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  await delay();
  const url = (config.url ?? "").split("?")[0] ?? "";
  const method = (config.method ?? "get").toUpperCase();
  const body = config.data ? JSON.parse(typeof config.data === "string" ? config.data : "{}") : {};

  if (url.startsWith("/auth/")) {
    if (url === "/auth/me") return ok(config, { user: currentUser });
    if (url === "/auth/logout") return ok(config, {});
    if (url === "/auth/login" || url === "/auth/request-verification") {
      const email = String(body.email ?? "").toLowerCase();
      if (!email.endsWith("@company.com"))
        return ok(config, {
          stage: "NOT_REGISTERED",
          message: "Your email is not registered. Please contact the administrator.",
        });
      if (email.startsWith("pending"))
        return ok(config, {
          stage: "PENDING_APPROVAL",
          message: "Your email has been verified. Your account is awaiting administrator approval.",
        });
      currentUser = email.startsWith("admin") ? adminUser : { ...employeeUser, email };
      return ok(config, { stage: "OTP_REQUIRED" });
    }
    if (url === "/auth/resend-otp") return ok(config, { stage: "OTP_REQUIRED" });
    if (url === "/auth/verify-email") return ok(config, { stage: "OTP_REQUIRED" });
    if (url === "/auth/verify-otp") {
      if (String(body.otp) !== "123456")
        return Promise.reject(
          Object.assign(new Error("Invalid OTP"), {
            isAxiosError: true,
            config,
            response: ok(config, { message: "The code you entered is incorrect." }, 400),
          }),
        );
      const email = String(body.email ?? currentUser.email).toLowerCase();
      currentUser = email.startsWith("admin") ? adminUser : { ...employeeUser, email };
      return ok(config, { stage: "APPROVED", token: "dev-token", user: currentUser });
    }
  }

  if (url === "/rooms") return ok(config, { rooms });
  if (url === "/rooms/availability") {
    const roomId = String(config.params?.roomId ?? "1");
    const date = String(config.params?.date ?? today);
    return ok(config, {
      roomId,
      date,
      workingDayStart: settings.workingDayStart,
      workingDayEnd: settings.workingDayEnd,
      blocks: bookings
        .filter((b) => b.roomId === roomId && b.date === date && b.status === "CONFIRMED")
        .map((b) => ({
          bookingId: b.bookingId,
          startTime: b.startTime,
          endTime: b.endTime,
          title: b.title,
          isOwn: b.userId === currentUser.id,
        })),
    });
  }

  if (url === "/bookings" && method === "POST") {
    const clash = bookings.some(
      (b) =>
        b.roomId === body.roomId &&
        b.date === body.date &&
        b.status === "CONFIRMED" &&
        body.startTime < b.endTime &&
        body.endTime > b.startTime,
    );
    if (clash)
      return Promise.reject(
        Object.assign(new Error("Conflict"), {
          isAxiosError: true,
          config,
          response: ok(config, {}, 409),
        }),
      );
    const booking = {
      ...mkBooking(body.roomId, body.date, body.startTime, body.endTime, body.title, currentUser),
      purpose: body.purpose,
      notes: body.notes,
      attendees: body.attendees ?? [],
    };
    bookings.push(booking);
    return ok(config, { booking }, 201);
  }
  if (url === "/bookings/my")
    return ok(
      config,
      paginate(
        bookings
          .filter((b) => b.userId === currentUser.id)
          .filter((b) => !config.params?.status || b.status === config.params.status),
        config,
      ),
    );
  if (url.startsWith("/bookings/")) {
    const id = url.split("/")[2]!;
    const booking = bookings.find((b) => b.id === id || b.bookingId === id);
    if (!booking) return ok(config, {}, 404);
    if (method === "DELETE") booking.status = "CANCELLED";
    return ok(config, { booking });
  }

  if (url === "/user/tour") return ok(config, { completed: tourCompleted });
  if (url === "/user/tour/complete") return ok(config, { completed: (tourCompleted = true) });
  if (url === "/user/tour/reset") return ok(config, { completed: (tourCompleted = false) });

  if (url === "/notifications") return ok(config, { notifications });
  if (url === "/notifications/read-all") {
    notifications.forEach((n) => (n.read = true));
    return ok(config, {});
  }
  if (url.startsWith("/notifications/")) {
    const id = url.split("/")[2];
    const n = notifications.find((x) => x.id === id);
    if (n) n.read = true;
    return ok(config, {});
  }

  if (url === "/admin/dashboard") return ok(config, dashboard());
  if (url === "/admin/users" && method === "GET") {
    const search = String(config.params?.search ?? "").toLowerCase();
    return ok(
      config,
      paginate(
        users.filter(
          (u) =>
            (!search ||
              u.name.toLowerCase().includes(search) ||
              u.email.toLowerCase().includes(search)) &&
            (!config.params?.status || u.status === config.params.status) &&
            (!config.params?.approvalStatus || u.approval === config.params.approvalStatus),
        ),
        config,
      ),
    );
  }
  if (url === "/admin/users/import")
    return ok(config, {
      total: 42,
      imported: 34,
      updated: 5,
      invalid: 2,
      duplicate: 1,
      failed: 0,
    });
  if (url.startsWith("/admin/users/")) {
    const parts = url.split("/");
    const user = users.find((u) => u.id === parts[3]);
    if (!user) return ok(config, {}, 404);
    const action = parts[4];
    if (action === "approve") user.approval = "APPROVED";
    if (action === "reject") user.approval = "REJECTED";
    if (action === "enable") user.status = "ACTIVE";
    if (action === "disable") user.status = "DISABLED";
    if (method === "PUT") Object.assign(user, body);
    return ok(config, { user });
  }

  if (url === "/admin/rooms" && method === "GET") return ok(config, { rooms });
  if (url === "/admin/rooms" && method === "POST") {
    const room: MeetingRoom = {
      id: String(rooms.length + 1),
      name: body.name,
      description: body.description ?? "",
      capacity: Number(body.capacity ?? 6),
      status: "ACTIVE",
    };
    rooms.push(room);
    return ok(config, { room }, 201);
  }
  if (url.startsWith("/admin/rooms/")) {
    const parts = url.split("/");
    const idx = rooms.findIndex((r) => r.id === parts[3]);
    if (idx < 0) return ok(config, {}, 404);
    if (method === "DELETE") {
      rooms.splice(idx, 1);
      return ok(config, {});
    }
    Object.assign(rooms[idx]!, body);
    return ok(config, { room: rooms[idx] });
  }

  if (url === "/admin/bookings") return ok(config, paginate(bookings, config));
  if (url.startsWith("/admin/bookings/")) {
    const id = url.split("/")[3];
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx < 0) return ok(config, {}, 404);
    if (method === "DELETE") {
      bookings[idx]!.status = "CANCELLED";
      return ok(config, {});
    }
    Object.assign(bookings[idx]!, body);
    return ok(config, { booking: bookings[idx] });
  }

  if (url === "/admin/audit-logs") return ok(config, paginate(auditLogs, config));
  if (url === "/admin/settings") {
    if (method === "PUT") settings = { ...settings, ...body };
    return ok(config, { settings });
  }
  if (url.startsWith("/admin/reports/")) {
    if (config.responseType === "blob")
      return ok(config, new Blob(["report"], { type: "text/csv" }));
    return ok(config, {
      rows: bookings.map((b) => ({
        bookingId: b.bookingId,
        room: b.roomName,
        employee: b.userName,
        date: b.date,
        start: b.startTime,
        end: b.endTime,
        status: b.status,
      })),
    });
  }

  return ok(config, {}, 404);
};

let installed = false;
export const installDevMocks = () => {
  if (installed) return;
  if (import.meta.env["VITE_ENABLE_DEV_MOCKS"] === "false") return;
  installed = true;
  http.defaults.adapter = handle as AxiosAdapter;
};
