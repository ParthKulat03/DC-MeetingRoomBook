import { createFileRoute } from "@tanstack/react-router";
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
import { formatLongDate, formatTime12, toISODate } from "@/utils/time";

export const Route = createFileRoute("/_authed/bookings/history")({
  head: () => ({
    meta: [
      { title: "Booking History | Meeting Room Booking" },
      { name: "description", content: "Past and cancelled meeting room bookings for your account." },
      { property: "og:title", content: "Booking History | Meeting Room Booking" },
      { property: "og:description", content: "Your past meeting room reservations." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const today = toISODate(new Date());
  const state = useApi(() => bookingsApi.my({ limit: 100 }), []);
  const past = (state.data?.items ?? []).filter((b) => b.date < today || b.status !== "CONFIRMED");

  return (
    <>
      <PageHeader title="Booking History" description="Everything you've booked so far." />
      {state.loading ? (
        <LoadingState />
      ) : state.error ? (
        <ErrorState message={state.error.message} onRetry={state.reload} />
      ) : past.length === 0 ? (
        <EmptyState title="No history yet" description="Completed bookings will show up here." />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Meeting</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {past.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">{b.bookingId}</TableCell>
                  <TableCell>{b.roomName}</TableCell>
                  <TableCell>{formatLongDate(b.date)}</TableCell>
                  <TableCell>
                    {formatTime12(b.startTime)} – {formatTime12(b.endTime)}
                  </TableCell>
                  <TableCell>{b.title}</TableCell>
                  <TableCell>
                    <StatusBadge value={b.status} />
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
