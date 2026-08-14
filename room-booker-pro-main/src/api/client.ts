import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_ROUTES, AUTH_TOKEN_KEY } from "@/constants/apiRoutes";
import type { ApiError } from "@/types";

const baseURL = import.meta.env['VITE_API_BASE_URL'] ?? "http://localhost:5000/api";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  else window.localStorage.removeItem(AUTH_TOKEN_KEY);
};

let unauthorizedHandler: (() => void) | null = null;
export const onUnauthorized = (handler: () => void) => {
  unauthorizedHandler = handler;
};

export const http: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

export const toApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ message?: string; error?: string }>;
    const status = err.response?.status ?? 0;
    const message =
      err.response?.data?.message ??
      err.response?.data?.error ??
      (status === 0
        ? "Unable to reach the server. Please check your connection."
        : defaultMessage(status));
    return { status, message, details: err.response?.data };
  }
  return { status: 0, message: "Something went wrong. Please try again." };
};

const defaultMessage = (status: number) => {
  switch (status) {
    case 400:
      return "Some details are invalid. Please review and try again.";
    case 401:
      return "Your session has expired. Please sign in again.";
    case 403:
      return "You are not authorized to perform this action.";
    case 404:
      return "We couldn't find what you were looking for.";
    case 409:
      return "This meeting room was just booked by another employee. Please select another time.";
    case 422:
      return "Some details could not be processed. Please review and try again.";
    case 500:
      return "The server ran into a problem. Please try again shortly.";
    default:
      return "Something went wrong. Please try again.";
  }
};

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error);
    const url = axios.isAxiosError(error) ? (error.config?.url ?? "") : "";
    if (apiError.status === 401 && !url.startsWith("/auth/")) {
      setToken(null);
      unauthorizedHandler?.();
    }
    return Promise.reject(apiError);
  },
);

export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const response = await http.request<T>(config);
  return response.data;
};

export const apiRoutes = API_ROUTES;
