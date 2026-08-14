import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { usersApi } from "@/api/users.api";

const STEPS = [
  { title: "Welcome", body: "This is your meeting room workspace. Here's a 30-second tour." },
  { title: "Dashboard", body: "See today's and upcoming bookings the moment you sign in." },
  { title: "Room availability", body: "Alpha and Beta show live availability for the day." },
  { title: "Book a room", body: "Use Book a Room to open the single booking card." },
  { title: "Drag time slots", body: "Press and drag across 15-minute slots to pick your time." },
  { title: "Meeting details", body: "Add a title, purpose and any notes for attendees." },
  { title: "Attendees", body: "List everyone joining with their designation." },
  { title: "My bookings", body: "Track upcoming reservations and their status." },
  { title: "Cancellation", body: "Cancel from My Bookings before the cut-off window." },
];

export function GuidedTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let active = true;
    usersApi
      .getTour()
      .then((res) => {
        if (active && !res.completed) setOpen(true);
      })
      .catch(() => {
        /* tour is optional */
      });
    return () => {
      active = false;
    };
  }, []);

  const finish = async () => {
    setOpen(false);
    try {
      await usersApi.completeTour();
    } catch {
      /* best effort */
    }
  };

  if (!open) return null;
  const current = STEPS[step]!;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Guided tour"
      className="fixed bottom-4 right-4 z-40 w-[min(22rem,calc(100vw-2rem))] rounded-xl border bg-card p-5 shadow-lg"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-primary">
        Step {step + 1} of {STEPS.length}
      </p>
      <h2 className="mt-1 text-base font-semibold">{current.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{current.body}</p>
      <div className="mt-4 flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={finish}>
          Skip
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
          >
            Back
          </Button>
          {step === STEPS.length - 1 ? (
            <Button size="sm" onClick={finish}>
              Finish
            </Button>
          ) : (
            <Button size="sm" onClick={() => setStep((s) => s + 1)}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
