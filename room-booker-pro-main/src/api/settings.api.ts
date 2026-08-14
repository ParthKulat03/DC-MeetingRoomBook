import { request } from "./client";
import { API_ROUTES } from "@/constants/apiRoutes";
import type { SystemSettings } from "@/types";

export const settingsApi = {
  get: () => request<{ settings: SystemSettings }>({ url: API_ROUTES.admin.settings, method: "GET" }),
  update: (settings: SystemSettings) =>
    request<{ settings: SystemSettings }>({
      url: API_ROUTES.admin.settings,
      method: "PUT",
      data: settings,
    }),
};
