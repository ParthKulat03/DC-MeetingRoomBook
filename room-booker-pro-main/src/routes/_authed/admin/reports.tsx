import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/common/States";
import { reportsApi, type ReportQuery } from "@/api/reports.api";
import type { ApiError } from "@/types";

export const Route = createFileRoute("/_authed/admin/reports")({
  head: () => ({
    meta: [
      { title: "Reports | Meeting Room Admin" },
      { name: "description", content: "Generate booking, utilization and cancellation reports." },
      { property: "og:title", content: "Reports | Meeting Room Admin" },
      { property: "og:description", content: "Download meeting room reports as Excel." },
    ],
  }),
  component: AdminReportsPage,
});

function AdminReportsPage() {
  const [query, setQuery] = useState<ReportQuery>({});
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (key: string, fn: () => Promise<unknown>) => {
    setBusy(key);
    try {
      await fn();
      toast.success(key.endsWith("-csv") ? "CSV downloaded." : "Report generated.");
    } catch (error) {
      toast.error((error as ApiError).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <PageHeader title="Reports" description="Filter, generate and download Excel reports." />
      <div className="grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="from">From</Label>
          <Input
            id="from"
            type="date"
            value={query.from ?? ""}
            onChange={(e) => setQuery({ ...query, from: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="to">To</Label>
          <Input
            id="to"
            type="date"
            value={query.to ?? ""}
            onChange={(e) => setQuery({ ...query, to: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="roomId">Room ID</Label>
          <Input
            id="roomId"
            value={query.roomId ?? ""}
            onChange={(e) => setQuery({ ...query, roomId: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input
            id="employeeId"
            value={query.employeeId ?? ""}
            onChange={(e) => setQuery({ ...query, employeeId: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {(
          [
            [
              "bookings",
              "Bookings report",
              () => reportsApi.downloadBookings(query),
              () => reportsApi.exportBookingsCsv(query),
            ],
            [
              "utilization",
              "Room utilization report",
              () => reportsApi.downloadRoomUtilization(query),
              () => reportsApi.exportRoomUtilizationCsv(query),
            ],
            [
              "cancellations",
              "Cancellations report",
              () => reportsApi.downloadCancellations(query),
              null,
            ],
          ] as const
        ).map(([key, label, excelFn, csvFn]) => (
          <div key={key} className="rounded-xl border bg-card p-5">
            <p className="font-medium">{label}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button disabled={busy !== null} onClick={() => run(key, excelFn)}>
                {busy === key ? "Generating..." : "Download Excel"}
              </Button>
              {csvFn ? (
                <Button
                  variant="outline"
                  disabled={busy !== null}
                  onClick={() => run(`${key}-csv`, csvFn)}
                >
                  {busy === `${key}-csv` ? "Exporting..." : "Export CSV"}
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

    </>
  );
}
