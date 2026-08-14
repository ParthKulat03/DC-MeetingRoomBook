import { useEffect, useState } from "react";
import { bookingSocket, type SocketStatus } from "@/websocket/socket";
import type { WsEvent, WsEventName } from "@/types";

export function useSocketEvent(events: WsEventName[], handler: (event: WsEvent) => void) {
  useEffect(() => {
    const unsubscribe = bookingSocket.subscribe(handler, events);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handler, events.join(",")]);
}

export function useSocketStatus(): SocketStatus {
  const [status, setStatus] = useState<SocketStatus>("CLOSED");
  useEffect(() => bookingSocket.onStatus(setStatus), []);
  return status;
}
