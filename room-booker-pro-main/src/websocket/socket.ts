import { getToken } from "@/api/client";
import type { WsEvent, WsEventName } from "@/types";

type Listener = (event: WsEvent) => void;
type StatusListener = (status: SocketStatus) => void;
export type SocketStatus = "CONNECTING" | "OPEN" | "CLOSED";

const WS_URL = import.meta.env['VITE_WS_URL'] ?? "ws://localhost:5000/ws";

class BookingSocket {
  private socket: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private statusListeners = new Set<StatusListener>();
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private manuallyClosed = false;
  status: SocketStatus = "CLOSED";

  connect() {
    if (typeof window === "undefined") return;
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING))
      return;

    this.manuallyClosed = false;
    this.setStatus("CONNECTING");

    try {
      const token = getToken();
      const url = token ? `${WS_URL}?token=${encodeURIComponent(token)}` : WS_URL;
      this.socket = new WebSocket(url);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.setStatus("OPEN");
      const token = getToken();
      if (token) this.send({ type: "AUTH", token });
    };

    this.socket.onmessage = (message) => {
      try {
        const payload = JSON.parse(message.data as string) as WsEvent;
        if (!payload?.event) return;
        this.listeners.forEach((listener) => listener(payload));
      } catch {
        /* ignore malformed frames */
      }
    };

    this.socket.onerror = () => this.socket?.close();

    this.socket.onclose = () => {
      this.setStatus("CLOSED");
      this.socket = null;
      if (!this.manuallyClosed) this.scheduleReconnect();
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    const delay = Math.min(30000, 1000 * 2 ** this.reconnectAttempts);
    this.reconnectAttempts += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  private setStatus(status: SocketStatus) {
    this.status = status;
    this.statusListeners.forEach((listener) => listener(status));
  }

  send(data: unknown) {
    if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify(data));
  }

  subscribe(listener: Listener, events?: WsEventName[]) {
    const wrapped: Listener = (event) => {
      if (!events || events.includes(event.event)) listener(event);
    };
    this.listeners.add(wrapped);
    return () => {
      this.listeners.delete(wrapped);
    };
  }

  onStatus(listener: StatusListener) {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  disconnect() {
    this.manuallyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.socket?.close();
    this.socket = null;
    this.setStatus("CLOSED");
  }
}

export const bookingSocket = new BookingSocket();
