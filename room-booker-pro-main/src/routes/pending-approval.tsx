import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pending-approval")({
  head: () => ({
    meta: [
      { title: "Awaiting approval | Meeting Room Booking" },
      {
        name: "description",
        content: "Your account is verified and waiting for administrator approval.",
      },
      { property: "og:title", content: "Awaiting approval | Meeting Room Booking" },
      { property: "og:description", content: "Your meeting room account is pending approval." },
    ],
  }),
  component: PendingApprovalPage,
});

function PendingApprovalPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        <Hourglass className="mx-auto h-10 w-10 text-accent" aria-hidden />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Awaiting approval</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your email has been verified. Your account is awaiting administrator approval. You'll be
          notified by email once it is active.
        </p>
        <Button className="mt-6 w-full" onClick={() => navigate({ to: "/login" })}>
          Back to sign in
        </Button>
      </div>
    </div>
  );
}
