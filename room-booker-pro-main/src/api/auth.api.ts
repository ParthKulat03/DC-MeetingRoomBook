import { request } from "./client";
import { API_ROUTES } from "@/constants/apiRoutes";
import type { AuthStageResponse, User } from "@/types";

export const authApi = {
  requestVerification: (email: string) =>
    request<AuthStageResponse>({
      url: API_ROUTES.auth.requestVerification,
      method: "POST",
      data: { email },
    }),
  verifyEmail: (token: string) =>
    request<AuthStageResponse>({
      url: API_ROUTES.auth.verifyEmail,
      method: "POST",
      data: { token },
    }),
  verifyOtp: (email: string, otp: string) =>
    request<AuthStageResponse>({
      url: API_ROUTES.auth.verifyOtp,
      method: "POST",
      data: { email, otp },
    }),
  resendOtp: (email: string) =>
    request<AuthStageResponse>({
      url: API_ROUTES.auth.resendOtp,
      method: "POST",
      data: { email },
    }),
  login: (email: string) =>
    request<AuthStageResponse>({
      url: API_ROUTES.auth.login,
      method: "POST",
      data: { email },
    }),
  logout: () => request<void>({ url: API_ROUTES.auth.logout, method: "POST" }),
  me: () => request<{ user: User }>({ url: API_ROUTES.auth.me, method: "GET" }),
};
