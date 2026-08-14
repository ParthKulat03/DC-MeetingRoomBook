import { request } from "./client";
import { API_ROUTES } from "@/constants/apiRoutes";
import type { Notification } from "@/types";

export const notificationsApi = {
  list: () =>
    request<{ notifications: Notification[] }>({
      url: API_ROUTES.notifications.list,
      method: "GET",
    }),
  markRead: (id: string) =>
    request<void>({ url: API_ROUTES.notifications.read(id), method: "PATCH" }),
  markAllRead: () => request<void>({ url: API_ROUTES.notifications.readAll, method: "PATCH" }),
};
