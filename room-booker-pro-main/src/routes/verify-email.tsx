import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authApi } from "@/api/auth.api";
import type { ApiError } from "@/types";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search["email"] === "string" ? search["email"] : "",
    token: typeof search["token"] === "string" ? search["token"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Verify your email | Meeting Room Booking" },
      { name: "description", content: "Confirm your company email to activate meeting room access." },
      { property: "og:title", content: "Verify your email | Meeting Room Booking" },
      { property: "og:description", content: "Confirm your company email to continue." },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { email, token } = Route.useSearch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    setLoading(true);
    try {
      const result = await authApi.verifyEmail(token);
      if (result.stage === "PENDING_APPROVAL") await navigate({ to: "/pending-approval" });
      else await navigate({ to: "/verify-otp", search: { email } });
    } catch (error) {
      toast.error((error as ApiError).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        <MailCheck className="mx-auto h-10 w-10 text-primary" aria-hidden />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Verify Your Email</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a verification link to <span className="font-medium">{email || "your inbox"}</span>
          . Open it on this device, or continue with a one-time code.
        </p>
        <div className="mt-6 space-y-3">
          {token ? (
            <Button className="w-full" onClick={verify} disabled={loading}>
              Confirm verification link
            </Button>
          ) : null}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate({ to: "/verify-otp", search: { email } })}
          >
            Use a one-time code instead
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => navigate({ to: "/login" })}>
            Back to sign in
          </Button>
        </div>
      </div>
    </div>
  );
}
