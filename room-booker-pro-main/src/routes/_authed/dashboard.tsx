import { createFileRoute } from "@tanstack/react-router";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState, LoadingState, PageHeader, StatusBadge } from "@/components/common/States";
import { useApi } from "@/hooks/useApi";
import { roomsApi } from "@/api/rooms.api";
import { bookingsApi } from "@/api/bookings.api";
import { useAuth } from "@/contexts/AuthContext";
import { useBookingDialog } from "@/contexts/BookingDialogContext";
import { formatLongDate, formatTime12, toISODate } from "@/utils/time";

export const Route = createFileRoute("/_authed/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | Meeting Room Booking" },
      { name: "description", content: "Today's meetings, upcoming bookings and room availability." },
      { property: "og:title", content: "Dashboard | Meeting Room Booking" },
      { property: "og:description", content: "Your meetings and live room availability at a glance." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const { openBooking } = useBookingDialog();
  const today = toISODate(new Date());
  const rooms = useApi(() => roomsApi.list(), []);
  const bookings = useApi(() => bookingsApi.my({ limit: 50 }), []);

  const items = bookings.data?.items.filter((b) => b.status === "CONFIRMED") ?? [];
  const todays = items.filter((b) => b.date === today);
  const upcoming = items.filter((b) => b.date > today);

  return (
    <>
      <PageHeader
        title={`Welcome, ${user?.name?.split(" ")[0] ?? "there"}`}
        description={formatLongDate(today)}
        action={
          <Button onClick={() => openBooking()} data-tour="book-room">
            <CalendarPlus className="mr-2 h-4 w-4" aria-hidden />
            Book a Room
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Today's bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.loading ? (
              <LoadingState rows={2} />
            ) : bookings.error ? (
              <ErrorState message={bookings.error.message} onRetry={bookings.reload} />
            ) : todays.length === 0 ? (
              <EmptyState
                title="Nothing booked today"
                description="Reserve Alpha or Beta in a few clicks."
                action={<Button onClick={() => openBooking()}>Book a Room</Button>}
              />
            ) : (
              <ul className="space-y-3">
                {todays.map((b) => (
                  <li
                    key={b.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
                  >
                    <div>
                      <p className="font-medium">{b.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {b.roomName} · {formatTime12(b.startTime)} – {formatTime12(b.endTime)}
                      </p>
                    </div>
                    <StatusBadge value={b.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Room availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rooms.loading ? (
              <LoadingState rows={2} />
            ) : rooms.error ? (
              <ErrorState message={rooms.error.message} onRetry={rooms.reload} />
            ) : (
              (rooms.data?.rooms ?? []).map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => openBooking({ roomId: room.id, date: today })}
                  className="flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors hover:bg-muted"
                >
                  <span>
                    <span className="block font-medium">{room.name}</span>
                    <span className="block text-sm text-muted-foreground">
                      {room.capacity} seats · {room.description}
                    </span>
                  </span>
                  <StatusBadge value={room.status} />
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Upcoming bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <EmptyState title="No upcoming bookings" />
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((b) => (
                  <li key={b.id} className="rounded-xl border p-4">
                    <p className="font-medium">{b.title}</p>
                    <p className="text-sm text-muted-foreground">{formatLongDate(b.date)}</p>
                    <p className="text-sm text-muted-foreground">
                      {b.roomName} · {formatTime12(b.startTime)} – {formatTime12(b.endTime)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
