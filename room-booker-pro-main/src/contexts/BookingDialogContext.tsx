import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { BookingDialog } from "@/components/booking/BookingDialog";

interface BookingDialogState {
  openBooking: (options?: { date?: string; roomId?: string }) => void;
}

const BookingDialogContext = createContext<BookingDialogState>({ openBooking: () => {} });

export function BookingDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<{ date?: string; roomId?: string }>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  const openBooking = useCallback((next: { date?: string; roomId?: string } = {}) => {
    setOptions(next);
    setRefreshKey((k) => k + 1);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openBooking }), [openBooking]);

  return (
    <BookingDialogContext.Provider value={value}>
      {children}
      <BookingDialog
        key={refreshKey}
        open={open}
        onOpenChange={setOpen}
        {...(options.date ? { initialDate: options.date } : {})}
        {...(options.roomId ? { initialRoomId: options.roomId } : {})}
        onViewBookings={() => navigate({ to: "/bookings" })}
      />
    </BookingDialogContext.Provider>
  );
}

export const useBookingDialog = () => useContext(BookingDialogContext);
