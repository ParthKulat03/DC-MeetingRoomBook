import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { InlineSpinner } from "@/components/common/States";

export const Route = createFileRoute("/_authed/admin/")({
  head: () => ({
    meta: [
      { title: "Administration | Meeting Room Booking" },
      { name: "description", content: "Administration area for meeting rooms, users and reports." },
      { property: "og:title", content: "Administration | Meeting Room Booking" },
      { property: "og:description", content: "Manage rooms, users, bookings and reports." },
    ],
  }),
  component: AdminIndex,
});

function AdminIndex() {
  const navigate = useNavigate();
  useEffect(() => {
    void navigate({ to: "/admin/dashboard", replace: true });
  }, [navigate]);
  return <InlineSpinner label="Opening admin dashboard" />;
}
