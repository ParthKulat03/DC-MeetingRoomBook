import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/common/States";
import { useApi } from "@/hooks/useApi";
import { adminApi } from "@/api/admin.api";

export const Route = createFileRoute("/_authed/admin/audit-logs")({
  head: () => ({
    meta: [
      { title: "Audit Logs | Meeting Room Admin" },
      { name: "description", content: "Track who changed bookings, rooms and user accounts." },
      { property: "og:title", content: "Audit Logs | Meeting Room Admin" },
      { property: "og:description", content: "Administrative activity trail." },
    ],
  }),
  component: AuditLogsPage,
});

function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const state = useApi(() => adminApi.auditLogs({ page, limit: 10 }), [page]);
  const logs = state.data?.items ?? [];
  const total = state.data?.total ?? 0;

  return (
    <>
      <PageHeader title="Audit Logs" description="A record of every administrative action." />
      {state.loading ? (
        <LoadingState />
      ) : state.error ? (
        <ErrorState message={state.error.message} onRetry={state.reload} />
      ) : logs.length === 0 ? (
        <EmptyState title="No activity yet" />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.actor}</TableCell>
                  <TableCell className="font-mono text-xs">{log.action}</TableCell>
                  <TableCell className="text-muted-foreground">{log.description}</TableCell>
                  <TableCell>{log.entity}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>{total} entries</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page * 10 >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
