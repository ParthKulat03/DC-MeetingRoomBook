import { request } from "./client";
import { API_ROUTES } from "@/constants/apiRoutes";
import type { Booking, CreateBookingPayload, Paginated } from "@/types";

export interface MyBookingsQuery {
  page?: number;
  limit?: number;
  status?: string;
  from?: string;
  to?: string;
  roomId?: string;
}

export const bookingsApi = {
  create: (payload: CreateBookingPayload) =>
    request<{ booking: Booking }>({
      url: API_ROUTES.bookings.create,
      method: "POST",
      data: payload,
    }),
  my: (params: MyBookingsQuery = {}) =>
    request<Paginated<Booking>>({ url: API_ROUTES.bookings.my, method: "GET", params }),
  detail: (id: string) =>
    request<{ booking: Booking }>({ url: API_ROUTES.bookings.detail(id), method: "GET" }),
  cancel: (id: string) =>
    request<{ booking: Booking }>({ url: API_ROUTES.bookings.cancel(id), method: "DELETE" }),
};
