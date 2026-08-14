import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { adminApi } from "@/api/admin.api";
import { formatLongDate, formatTime12 } from "@/utils/time";
import type { ApiError } from "@/types";

export const Route = createFileRoute("/_authed/admin/bookings")({
  head: () => ({
    meta: [
      { title: "Bookings | Meeting Room Admin" },
      { name: "description", content: "Review and manage every meeting room booking." },
      { property: "og:title", content: "Bookings | Meeting Room Admin" },
      { property: "og:description", content: "Organisation-wide booking administration." },
    ],
  }),
  component: AdminBookingsPage,
});

function AdminBookingsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const state = useApi(() => adminApi.bookings({ page, limit: 10, search }), [page, search]);
  const bookings = state.data?.items ?? [];
  const total = state.data?.total ?? 0;

  const cancel = async (id: string) => {
    try {
      await adminApi.deleteBooking(id);
      toast.success("Booking cancelled.");
      state.reload();
    } catch (error) {
      toast.error((error as ApiError).message);
    }
  };

  return (
    <>
      <PageHeader title="Bookings" description="All reservations across Alpha and Beta." />
      <Input
        className="mb-4 max-w-sm"
        placeholder="Search bookings"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        aria-label="Search bookings"
      />
      {state.loading ? (
        <LoadingState />
      ) : state.error ? (
        <ErrorState message={state.error.message} onRetry={state.reload} />
      ) : bookings.length === 0 ? (
        <EmptyState title="No bookings found" />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Meeting</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">{b.bookingId}</TableCell>
                  <TableCell>{b.userName}</TableCell>
                  <TableCell>{b.roomName}</TableCell>
                  <TableCell>{formatLongDate(b.date)}</TableCell>
                  <TableCell>
                    {formatTime12(b.startTime)} – {formatTime12(b.endTime)}
                  </TableCell>
                  <TableCell>{b.title}</TableCell>
                  <TableCell>
                    <StatusBadge value={b.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {b.status === "CONFIRMED" ? (
                      <Button size="sm" variant="outline" onClick={() => cancel(b.id)}>
                        Cancel
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>{total} bookings</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page * 10 >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
