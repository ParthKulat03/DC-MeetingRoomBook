import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { authApi } from "@/api/auth.api";
import { useAuth } from "@/contexts/AuthContext";
import type { ApiError } from "@/types";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in | Meeting Room Booking" },
      { name: "description", content: "Sign in with your company email to book meeting rooms." },
      { property: "og:title", content: "Sign in | Meeting Room Booking" },
      { property: "og:description", content: "Corporate sign-in for the meeting room workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<{ title: string; message: string } | null>(null);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await authApi.login(email.trim());
      switch (result.stage) {
        case "NOT_REGISTERED":
          setDialog({
            title: "Email not registered",
            message:
              result.message ?? "Your email is not registered. Please contact the administrator.",
          });
          break;
        case "VERIFICATION_REQUIRED":
          await navigate({ to: "/verify-email", search: { email: email.trim(), token: "" } });
          break;
        case "OTP_REQUIRED":
          await navigate({ to: "/verify-otp", search: { email: email.trim() } });
          break;
        case "PENDING_APPROVAL":
          await navigate({ to: "/pending-approval" });
          break;
        case "DISABLED":
          setDialog({
            title: "Account disabled",
            message:
              result.message ?? "Your account has been disabled. Please contact the administrator.",
          });
          break;
        case "APPROVED":
          if (result.token && result.user) {
            signIn(result.token, result.user);
            await navigate({ to: "/dashboard" });
          }
          break;
      }
    } catch (error) {
      toast.error((error as ApiError).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
          MR
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Use your company email address. Accounts are created by your administrator.
        </p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <div className="space-y-1.5">
            <Label htmlFor="email">Company Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="employee@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || !email}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : null}
            Continue
          </Button>
        </form>
      </div>

      <AlertDialog open={Boolean(dialog)} onOpenChange={(open) => !open && setDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialog?.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialog?.message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDialog(null)}>Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
