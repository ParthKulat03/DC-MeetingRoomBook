import { SLOT_MINUTES } from "@/constants/apiRoutes";

export const toMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};

export const toTime = (minutes: number): string =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

export const formatTime12 = (time: string): string => {
  const [h, m] = time.split(":").map(Number);
  const hour = h ?? 0;
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${String(m ?? 0).padStart(2, "0")} ${suffix}`;
};

export const buildSlots = (start: string, end: string): string[] => {
  const slots: string[] = [];
  for (let m = toMinutes(start); m < toMinutes(end); m += SLOT_MINUTES) slots.push(toTime(m));
  return slots;
};

export const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h} hour${h > 1 ? "s" : ""} ${m} minutes`;
  if (h) return `${h} hour${h > 1 ? "s" : ""}`;
  return `${m} minutes`;
};

export const toISODate = (date: Date): string => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};

export const formatLongDate = (iso: string): string => {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
  return date.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
};

export const isPastSlot = (date: string, time: string): boolean => {
  const now = new Date();
  const today = toISODate(now);
  if (date < today) return true;
  if (date > today) return false;
  return toMinutes(time) + SLOT_MINUTES <= now.getHours() * 60 + now.getMinutes();
};

export const addDays = (iso: string, days: number): string => {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
  date.setDate(date.getDate() + days);
  return toISODate(date);
};

export const startOfWeek = (iso: string): string => {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
  const day = (date.getDay() + 6) % 7;
  return addDays(iso, -day);
};
