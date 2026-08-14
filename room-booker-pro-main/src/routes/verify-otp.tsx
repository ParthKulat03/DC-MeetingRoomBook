import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authApi } from "@/api/auth.api";
import { useAuth } from "@/contexts/AuthContext";
import type { ApiError } from "@/types";

export const Route = createFileRoute("/verify-otp")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search["email"] === "string" ? search["email"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Enter your code | Meeting Room Booking" },
      { name: "description", content: "Enter the one-time code sent to your company email." },
      { property: "og:title", content: "Enter your code | Meeting Room Booking" },
      { property: "og:description", content: "One-time code verification for meeting room access." },
    ],
  }),
  component: VerifyOtpPage,
});

function VerifyOtpPage() {
  const { email } = Route.useSearch();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(45);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const submit = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authApi.verifyOtp(email, code);
      if (result.stage === "PENDING_APPROVAL") {
        await navigate({ to: "/pending-approval" });
        return;
      }
      if (result.token && result.user) {
        signIn(result.token, result.user);
        toast.success("Signed in.");
        await navigate({ to: "/dashboard" });
      }
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        <ShieldCheck className="mx-auto h-10 w-10 text-primary" aria-hidden />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Enter your code</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a 6-digit code to <span className="font-medium">{email || "your inbox"}</span>.
        </p>

        <div className="mt-6 flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => {
              setOtp(value);
              if (value.length === 6) void submit(value);
            }}
            aria-label="One-time code"
          >
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

        <Button className="mt-6 w-full" disabled={otp.length !== 6 || loading} onClick={() => submit(otp)}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : null}
          Verify
        </Button>

        <Button
          variant="ghost"
          className="mt-2 w-full"
          disabled={seconds > 0}
          onClick={async () => {
            await authApi.resendOtp(email);
            setSeconds(45);
            toast.info("A new code is on its way.");
          }}
        >
          {seconds > 0 ? `Resend code in ${seconds}s` : "Resend code"}
        </Button>
      </div>
    </div>
  );
}
