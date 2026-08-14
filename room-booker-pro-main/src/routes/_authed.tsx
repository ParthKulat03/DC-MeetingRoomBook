import { useEffect } from "react";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { InlineSpinner } from "@/components/common/States";

export const Route = createFileRoute("/_authed")({
  component: AuthedLayout,
});

function AuthedLayout() {
  const { loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) void navigate({ to: "/login", replace: true });
  }, [loading, isAuthenticated, navigate]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <InlineSpinner label="Checking your session" />
      </div>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
