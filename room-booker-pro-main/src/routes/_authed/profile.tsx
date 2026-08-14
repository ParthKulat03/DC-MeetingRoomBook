import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, StatusBadge } from "@/components/common/States";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/_authed/profile")({
  head: () => ({
    meta: [
      { title: "Profile | Meeting Room Booking" },
      { name: "description", content: "Your employee profile and account status." },
      { property: "og:title", content: "Profile | Meeting Room Booking" },
      { property: "og:description", content: "Employee profile details and account status." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const rows: [string, string][] = [
    ["Name", user?.name ?? "—"],
    ["Employee ID", user?.employeeId ?? "—"],
    ["Email", user?.email ?? "—"],
    ["Designation", user?.designation ?? "—"],
  ];

  return (
    <>
      <PageHeader title="Profile" description="Accounts are created by your administrator." />
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-base">Account details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
                <dd className="mt-0.5 text-sm font-medium">{value}</dd>
              </div>
            ))}
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Status</dt>
              <dd className="mt-1">
                <StatusBadge value={user?.status ?? "ACTIVE"} />
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </>
  );
}
