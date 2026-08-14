import { useCallback, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState, ErrorState, LoadingState, PageHeader, StatusBadge } from "@/components/common/States";
import { useApi } from "@/hooks/useApi";
import { bookingsApi } from "@/api/bookings.api";
import { useBookingDialog } from "@/contexts/BookingDialogContext";
import { useSocketEvent } from "@/hooks/useSocket";
import { formatLongDate, formatTime12 } from "@/utils/time";
import type { ApiError, WsEventName } from "@/types";

export const Route = createFileRoute("/_authed/bookings/")({
  head: () => ({
    meta: [
      { title: "My Bookings | Meeting Room Booking" },
      { name: "description", content: "Review and cancel your upcoming meeting room bookings." },
      { property: "og:title", content: "My Bookings | Meeting Room Booking" },
      { property: "og:description", content: "Manage your meeting room reservations." },
    ],
  }),
  component: MyBookingsPage,
});

function MyBookingsPage() {
  const { openBooking } = useBookingDialog();
  const [cancelling, setCancelling] = useState<string | null>(null);
  const state = useApi(() => bookingsApi.my({ limit: 50 }), []);
  const reload = state.reload;

  useSocketEvent(
    useMemo<WsEventName[]>(
      () => ["BOOKING_CREATED", "BOOKING_UPDATED", "BOOKING_CANCELLED"],
      [],
    ),
    useCallback(() => reload(), [reload]),
  );


  const cancel = async (id: string) => {
    setCancelling(id);
    try {
      await bookingsApi.cancel(id);
      toast.success("Booking cancelled.");
      reload();
    } catch (error) {
      const err = error as ApiError;
      toast.error(
        err.status === 403 || err.status === 409
          ? "Cancellation is no longer available. Please contact the administrator for approval."
          : err.message,
      );
    } finally {
      setCancelling(null);
    }
  };

  const bookings = state.data?.items ?? [];

  return (
    <>
      <PageHeader
        title="My Bookings"
        description="Upcoming and recent reservations booked with your account."
        action={<Button onClick={() => openBooking()}>Book a Room</Button>}
      />

      {state.loading ? (
        <LoadingState />
      ) : state.error ? (
        <ErrorState message={state.error.message} onRetry={reload} />
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="Your reservations will appear here."
          action={<Button onClick={() => openBooking()}>Book a Room</Button>}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Meeting</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">{b.bookingId}</TableCell>
                  <TableCell>{b.roomName}</TableCell>
                  <TableCell>{formatLongDate(b.date)}</TableCell>
                  <TableCell>{formatTime12(b.startTime)}</TableCell>
                  <TableCell>{formatTime12(b.endTime)}</TableCell>
                  <TableCell>{b.title}</TableCell>
                  <TableCell>
                    <StatusBadge value={b.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {b.status === "CONFIRMED" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={cancelling === b.id}
                        onClick={() => cancel(b.id)}
                      >
                        {cancelling === b.id ? "Cancelling..." : "Cancel"}
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
