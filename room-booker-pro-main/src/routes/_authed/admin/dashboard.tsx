import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState, LoadingState, PageHeader } from "@/components/common/States";
import { useApi } from "@/hooks/useApi";
import { adminApi } from "@/api/admin.api";

export const Route = createFileRoute("/_authed/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Meeting Room Booking" },
      { name: "description", content: "Booking volume, room utilization and employee activity." },
      { property: "og:title", content: "Admin Dashboard | Meeting Room Booking" },
      { property: "og:description", content: "Operational metrics for meeting room usage." },
    ],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const state = useApi(() => adminApi.dashboard(), []);

  if (state.loading) return <LoadingState rows={6} />;
  if (state.error || !state.data)
    return <ErrorState message={state.error?.message} onRetry={state.reload} />;

  const d = state.data;
  const cards = [
    ["Total Employees", d.totalEmployees],
    ["Active Employees", d.activeEmployees],
    ["Pending Approvals", d.pendingApprovals],
    ["Total Bookings", d.totalBookings],
    ["Today's Bookings", d.todaysBookings],
    ["Upcoming Bookings", d.upcomingBookings],
    ["Cancelled Bookings", d.cancelledBookings],
    ["Room Utilization", `${d.roomUtilization}%`],
  ] as const;

  return (
    <>
      <PageHeader title="Admin Dashboard" description="Live view of workspace usage." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-1 text-2xl font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Daily bookings">
          <LineChart data={d.dailyBookings}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="bookings" stroke="var(--chart-1)" strokeWidth={2} />
          </LineChart>
        </ChartCard>
        <ChartCard title="Weekly bookings">
          <BarChart data={d.weeklyBookings}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip />
            <Bar dataKey="bookings" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Monthly bookings">
          <BarChart data={d.monthlyBookings}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip />
            <Bar dataKey="bookings" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Alpha vs Beta usage">
          <BarChart data={d.roomUsage}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="room" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip />
            <Bar dataKey="bookings" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Peak booking hours">
          <BarChart data={d.peakHours}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip />
            <Bar dataKey="bookings" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Cancellations">
          <LineChart data={d.cancellations}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="cancelled" stroke="var(--chart-2)" strokeWidth={2} />
          </LineChart>
        </ChartCard>
      </div>
    </>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
