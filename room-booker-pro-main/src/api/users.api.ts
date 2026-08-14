import { request } from "./client";
import { API_ROUTES } from "@/constants/apiRoutes";

export const usersApi = {
  getTour: () => request<{ completed: boolean }>({ url: API_ROUTES.tour.get, method: "GET" }),
  completeTour: () => request<{ completed: boolean }>({ url: API_ROUTES.tour.complete, method: "POST" }),
  resetTour: () => request<{ completed: boolean }>({ url: API_ROUTES.tour.reset, method: "POST" }),
};
