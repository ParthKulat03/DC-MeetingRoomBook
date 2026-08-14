import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { getToken } from "@/api/client";
import { InlineSpinner } from "@/components/common/States";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meeting Room Booking | Corporate Workspace" },
      {
        name: "description",
        content:
          "Reserve Alpha and Beta meeting rooms in 15-minute slots with live availability and approvals.",
      },
      { property: "og:title", content: "Meeting Room Booking | Corporate Workspace" },
      {
        property: "og:description",
        content: "Reserve corporate meeting rooms with live availability and drag-to-select times.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    void navigate({ to: getToken() ? "/dashboard" : "/login", replace: true });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <InlineSpinner label="Loading your workspace" />
    </div>
  );
}
