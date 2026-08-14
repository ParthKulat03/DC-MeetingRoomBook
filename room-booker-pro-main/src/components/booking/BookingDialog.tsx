import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, ChevronLeft, ChevronRight, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimeGrid, TimeGridLegend } from "./TimeGrid";
import { ErrorState, LoadingState } from "@/components/common/States";
import { roomsApi } from "@/api/rooms.api";
import { bookingsApi } from "@/api/bookings.api";
import { useApi } from "@/hooks/useApi";
import { useSocketEvent } from "@/hooks/useSocket";
import { DEFAULT_DAY_END, DEFAULT_DAY_START, SLOT_MINUTES } from "@/constants/apiRoutes";
import {
  buildSlots,
  formatDuration,
  formatLongDate,
  formatTime12,
  toISODate,
  toMinutes,
  toTime,
} from "@/utils/time";
import type { ApiError, AvailabilityResponse, Booking, BookingAttendee, WsEventName } from "@/types";

const STEPS = ["Time", "Details", "Attendees", "Confirm"] as const;

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate?: string;
  initialRoomId?: string;
  onBooked?: (booking: Booking) => void;
  onViewBookings?: () => void;
}

export function BookingDialog({
  open,
  onOpenChange,
  initialDate,
  initialRoomId,
  onBooked,
  onViewBookings,
}: BookingDialogProps) {
  const [step, setStep] = useState(0);
  const [date, setDate] = useState(initialDate ?? toISODate(new Date()));
  const [roomId, setRoomId] = useState(initialRoomId ?? "");
  const [range, setRange] = useState<{ start: string; end: string } | null>(null);
  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [attendees, setAttendees] = useState<BookingAttendee[]>([{ name: "", designation: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setConfirmed(null);
    setRange(null);
    setDate(initialDate ?? toISODate(new Date()));
    if (initialRoomId) setRoomId(initialRoomId);
  }, [open, initialDate, initialRoomId]);

  const roomsState = useApi(() => roomsApi.list(), [open]);
  const rooms = roomsState.data?.rooms ?? [];

  useEffect(() => {
    if (!roomId && rooms.length) setRoomId(rooms[0]!.id);
  }, [rooms, roomId]);

  const availability = useApi<AvailabilityResponse | null>(
    () => (roomId ? roomsApi.availability(roomId, date) : Promise.resolve(null)),
    [roomId, date],
  );

  const refreshAvailability = availability.reload;

  useSocketEvent(
    useMemo<WsEventName[]>(
      () => ["BOOKING_CREATED", "BOOKING_UPDATED", "BOOKING_CANCELLED", "AVAILABILITY_UPDATED"],
      [],
    ),
    useCallback(
      (event) => {
        if ((!event.roomId || event.roomId === roomId) && (!event.date || event.date === date))
          refreshAvailability();
      },
      [roomId, date, refreshAvailability],
    ),
  );

  const dayStart = availability.data?.workingDayStart ?? DEFAULT_DAY_START;
  const dayEnd = availability.data?.workingDayEnd ?? DEFAULT_DAY_END;
  const blocks = availability.data?.blocks ?? [];
  const room = rooms.find((r) => r.id === roomId);
  const duration = range ? toMinutes(range.end) - toMinutes(range.start) : 0;
  const slotOptions = useMemo(() => buildSlots(dayStart, dayEnd), [dayStart, dayEnd]);

  const canContinue =
    (step === 0 && Boolean(roomId && range)) ||
    (step === 1 && title.trim().length > 1 && purpose.trim().length > 1) ||
    step === 2;

  const submit = async () => {
    if (!range || !roomId) return;
    setSubmitting(true);
    try {
      const { booking } = await bookingsApi.create({
        roomId,
        date,
        startTime: range.start,
        endTime: range.end,
        title: title.trim(),
        purpose: purpose.trim(),
        notes: notes.trim(),
        attendees: attendees.filter((a) => a.name.trim()),
      });
      setConfirmed(booking);
      onBooked?.(booking);
      toast.success("Booking confirmed.");
    } catch (error) {
      const err = error as ApiError;
      if (err.status === 409) {
        refreshAvailability();
        setRange(null);
        setStep(0);
      }
      toast.error(err.message || "Unable to complete booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] w-[calc(100vw-1rem)] max-w-3xl overflow-y-auto p-0 sm:w-full">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>{confirmed ? "Booking confirmed" : "Book a room"}</DialogTitle>
        </DialogHeader>

        {confirmed ? (
          <div className="px-6 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-7 w-7 text-primary" aria-hidden />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Booking Confirmed</h2>
            <p className="mt-3 text-sm text-muted-foreground">{confirmed.roomName}</p>
            <p className="text-sm text-muted-foreground">{formatLongDate(confirmed.date)}</p>
            <p className="text-sm text-muted-foreground">
              {formatTime12(confirmed.startTime)} – {formatTime12(confirmed.endTime)}
            </p>
            <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">Booking ID</p>
            <p className="font-medium">{confirmed.bookingId}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  onViewBookings?.();
                }}
              >
                View My Bookings
              </Button>
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </div>
          </div>
        ) : (
          <div className="px-6 pb-6">
            <ol className="mb-5 flex flex-wrap items-center gap-2 text-xs">
              {STEPS.map((label, index) => (
                <li key={label} className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium ${
                      index <= step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className={index === step ? "font-medium" : "text-muted-foreground"}>
                    {label}
                  </span>
                  {index < STEPS.length - 1 ? (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" aria-hidden />
                  ) : null}
                </li>
              ))}
            </ol>

            {step === 0 ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="booking-date">Date</Label>
                    <div className="relative">
                      <CalendarDays
                        className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
                        aria-hidden
                      />
                      <Input
                        id="booking-date"
                        type="date"
                        className="pl-9"
                        min={toISODate(new Date())}
                        value={date}
                        onChange={(e) => {
                          setDate(e.target.value);
                          setRange(null);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="booking-room">Meeting room</Label>
                    <Select
                      value={roomId}
                      onValueChange={(v) => {
                        setRoomId(v);
                        setRange(null);
                      }}
                    >
                      <SelectTrigger id="booking-room">
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.name} · {r.capacity} seats
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Press and drag across the 15-minute slots to select your meeting time.
                </p>

                {availability.loading ? (
                  <LoadingState rows={4} />
                ) : availability.error ? (
                  <ErrorState message={availability.error.message} onRetry={refreshAvailability} />
                ) : (
                  <TimeGrid
                    date={date}
                    dayStart={dayStart}
                    dayEnd={dayEnd}
                    blocks={blocks}
                    value={range}
                    onChange={setRange}
                    onInvalidSelection={() =>
                      toast.error("This time overlaps with an existing booking.")
                    }
                  />
                )}

                <TimeGridLegend />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="start-time">Start time</Label>
                    <Select
                      value={range?.start ?? ""}
                      onValueChange={(start) =>
                        setRange({
                          start,
                          end:
                            range && toMinutes(range.end) > toMinutes(start)
                              ? range.end
                              : toTime(toMinutes(start) + SLOT_MINUTES),
                        })
                      }
                    >
                      <SelectTrigger id="start-time">
                        <SelectValue placeholder="Select start" />
                      </SelectTrigger>
                      <SelectContent>
                        {slotOptions.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {formatTime12(slot)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="end-time">End time</Label>
                    <Select
                      value={range?.end ?? ""}
                      onValueChange={(end) => range && setRange({ start: range.start, end })}
                    >
                      <SelectTrigger id="end-time">
                        <SelectValue placeholder="Select end" />
                      </SelectTrigger>
                      <SelectContent>
                        {slotOptions
                          .map((slot) => toTime(toMinutes(slot) + SLOT_MINUTES))
                          .filter((slot) => !range || toMinutes(slot) > toMinutes(range.start))
                          .map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {formatTime12(slot)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {range ? (
                  <p className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
                    {formatTime12(range.start)} – {formatTime12(range.end)} ·{" "}
                    {formatDuration(duration)}
                  </p>
                ) : null}
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Meeting title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Project Discussion"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="purpose">Meeting purpose</Label>
                  <Input
                    id="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Project progress discussion"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Anything the attendees should know"
                  />
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-3">
                {attendees.map((attendee, index) => (
                  <div key={index} className="flex flex-wrap items-end gap-3">
                    <div className="min-w-40 flex-1 space-y-1.5">
                      <Label htmlFor={`attendee-name-${index}`}>Name</Label>
                      <Input
                        id={`attendee-name-${index}`}
                        value={attendee.name}
                        onChange={(e) =>
                          setAttendees((list) =>
                            list.map((a, i) => (i === index ? { ...a, name: e.target.value } : a)),
                          )
                        }
                      />
                    </div>
                    <div className="min-w-40 flex-1 space-y-1.5">
                      <Label htmlFor={`attendee-role-${index}`}>Designation</Label>
                      <Input
                        id={`attendee-role-${index}`}
                        value={attendee.designation}
                        onChange={(e) =>
                          setAttendees((list) =>
                            list.map((a, i) =>
                              i === index ? { ...a, designation: e.target.value } : a,
                            ),
                          )
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove attendee ${index + 1}`}
                      onClick={() => setAttendees((list) => list.filter((_, i) => i !== index))}
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAttendees((list) => [...list, { name: "", designation: "" }])}
                >
                  <Plus className="mr-2 h-4 w-4" aria-hidden />
                  Add attendee
                </Button>
              </div>
            ) : null}

            {step === 3 ? (
              <dl className="grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-2">
                <Summary label="Room" value={room?.name ?? "—"} />
                <Summary label="Date" value={formatLongDate(date)} />
                <Summary
                  label="Time"
                  value={range ? `${formatTime12(range.start)} – ${formatTime12(range.end)}` : "—"}
                />
                <Summary label="Duration" value={formatDuration(duration)} />
                <Summary label="Meeting" value={title || "—"} />
                <Summary label="Purpose" value={purpose || "—"} />
                <Summary
                  label="Attendees"
                  value={String(attendees.filter((a) => a.name.trim()).length)}
                />
                <Summary label="Notes" value={notes || "—"} />
              </dl>
            ) : null}

            <div className="mt-6 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => (step === 0 ? onOpenChange(false) : setStep((s) => s - 1))}
                disabled={submitting}
              >
                <ChevronLeft className="mr-1 h-4 w-4" aria-hidden />
                {step === 0 ? "Cancel" : "Back"}
              </Button>
              {step < 3 ? (
                <Button type="button" disabled={!canContinue} onClick={() => setStep((s) => s + 1)}>
                  Continue
                  <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
                </Button>
              ) : (
                <Button type="button" onClick={submit} disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                      Booking...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  );
}
