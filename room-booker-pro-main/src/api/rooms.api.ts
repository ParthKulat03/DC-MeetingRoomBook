import { request } from "./client";
import { API_ROUTES } from "@/constants/apiRoutes";
import type { AvailabilityResponse, MeetingRoom } from "@/types";

export const roomsApi = {
  list: () => request<{ rooms: MeetingRoom[] }>({ url: API_ROUTES.rooms.list, method: "GET" }),
  detail: (id: string) =>
    request<{ room: MeetingRoom }>({ url: API_ROUTES.rooms.detail(id), method: "GET" }),
  availability: (roomId: string, date: string) =>
    request<AvailabilityResponse>({
      url: API_ROUTES.rooms.availability,
      method: "GET",
      params: { roomId, date },
    }),
};
