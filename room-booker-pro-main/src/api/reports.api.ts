import { request } from "./client";
import { API_ROUTES } from "@/constants/apiRoutes";
import { downloadCsv, type CsvRow } from "@/utils/csv";

export interface ReportQuery {
  from?: string;
  to?: string;
  roomId?: string;
  employeeId?: string;
}

const download = async (url: string, params: ReportQuery, filename: string) => {
  const blob = await request<Blob>({ url, method: "GET", params, responseType: "blob" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
};

const exportCsv = async (url: string, params: ReportQuery, filename: string) => {
  const { rows } = await request<{ rows: CsvRow[] }>({ url, method: "GET", params });
  if (!rows?.length) throw new Error("No rows matched these filters.");
  downloadCsv(rows, filename);
};

const stamp = () => new Date().toISOString().slice(0, 10);

export const reportsApi = {
  bookings: (params: ReportQuery) =>
    request<{ rows: Record<string, string | number>[] }>({
      url: API_ROUTES.admin.reports.bookings,
      method: "GET",
      params,
    }),
  roomUtilization: (params: ReportQuery) =>
    request<{ rows: Record<string, string | number>[] }>({
      url: API_ROUTES.admin.reports.roomUtilization,
      method: "GET",
      params,
    }),
  cancellations: (params: ReportQuery) =>
    request<{ rows: Record<string, string | number>[] }>({
      url: API_ROUTES.admin.reports.cancellations,
      method: "GET",
      params,
    }),
  downloadBookings: (params: ReportQuery) =>
    download(API_ROUTES.admin.reports.bookings, params, "bookings-report.xlsx"),
  downloadRoomUtilization: (params: ReportQuery) =>
    download(API_ROUTES.admin.reports.roomUtilization, params, "room-utilization-report.xlsx"),
  downloadCancellations: (params: ReportQuery) =>
    download(API_ROUTES.admin.reports.cancellations, params, "cancellations-report.xlsx"),
  exportBookingsCsv: (params: ReportQuery) =>
    exportCsv(API_ROUTES.admin.reports.bookings, params, `bookings-report-${stamp()}.csv`),
  exportRoomUtilizationCsv: (params: ReportQuery) =>
    exportCsv(
      API_ROUTES.admin.reports.roomUtilization,
      params,
      `room-utilization-report-${stamp()}.csv`,
    ),
};
