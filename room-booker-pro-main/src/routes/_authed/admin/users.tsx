import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState, ErrorState, LoadingState, PageHeader, StatusBadge } from "@/components/common/States";
import { useApi } from "@/hooks/useApi";
import { adminApi } from "@/api/admin.api";
import type { ApiError, ImportResult, User } from "@/types";

export const Route = createFileRoute("/_authed/admin/users")({
  head: () => ({
    meta: [
      { title: "Users | Meeting Room Admin" },
      { name: "description", content: "Approve, enable and import employee accounts." },
      { property: "og:title", content: "Users | Meeting Room Admin" },
      { property: "og:description", content: "Employee account administration." },
    ],
  }),
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [progress, setProgress] = useState<number | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const state = useApi(() => adminApi.users({ page, limit: 10, search }), [page, search]);

  const act = async (fn: () => Promise<{ user: User }>, message: string) => {
    try {
      await fn();
      toast.success(message);
      state.reload();
    } catch (error) {
      toast.error((error as ApiError).message);
    }
  };

  const upload = async (file: File) => {
    setProgress(0);
    try {
      const result = await adminApi.importUsers(file, setProgress);
      setImportResult(result);
      toast.success("Employee file processed.");
      state.reload();
    } catch (error) {
      toast.error((error as ApiError).message);
    } finally {
      setProgress(null);
    }
  };

  const users = state.data?.items ?? [];
  const total = state.data?.total ?? 0;

  return (
    <>
      <PageHeader
        title="Users"
        description="Employee accounts, approvals and access."
        action={
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <Upload className="h-4 w-4" aria-hidden />
            Upload Employees
            <input
              type="file"
              accept=".xlsx"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(file);
              }}
            />
          </label>
        }
      />

      {progress !== null ? (
        <div className="mb-4">
          <Progress value={progress} />
          <p className="mt-1 text-xs text-muted-foreground">Uploading… {progress}%</p>
        </div>
      ) : null}

      {importResult ? (
        <div className="mb-6 grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-3 lg:grid-cols-6">
          {(
            [
              ["Total", importResult.total],
              ["Imported", importResult.imported],
              ["Updated", importResult.updated],
              ["Invalid", importResult.invalid],
              ["Duplicate", importResult.duplicate],
              ["Failed", importResult.failed],
            ] as const
          ).map(([label, value]) => (
            <div key={label}>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="text-lg font-semibold">{value}</p>
            </div>
          ))}
          {importResult.errorReportUrl ? (
            <a className="text-sm text-primary underline" href={importResult.errorReportUrl}>
              Download error report
            </a>
          ) : null}
        </div>
      ) : null}

      <Input
        className="mb-4 max-w-sm"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        aria-label="Search employees"
      />

      {state.loading ? (
        <LoadingState />
      ) : state.error ? (
        <ErrorState message={state.error.message} onRetry={state.reload} />
      ) : users.length === 0 ? (
        <EmptyState title="No employees found" />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-mono text-xs">{u.employeeId}</TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>{u.designation}</TableCell>
                  <TableCell>
                    <StatusBadge value={u.verification} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={u.approval} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={u.status} />
                  </TableCell>
                  <TableCell className="space-x-2 whitespace-nowrap text-right">
                    {u.approval === "PENDING" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => act(() => adminApi.approveUser(u.id), "User approved.")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => act(() => adminApi.rejectUser(u.id), "User rejected.")}
                        >
                          Reject
                        </Button>
                      </>
                    ) : null}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        u.status === "ACTIVE"
                          ? act(() => adminApi.disableUser(u.id), "User disabled.")
                          : act(() => adminApi.enableUser(u.id), "User enabled.")
                      }
                    >
                      {u.status === "ACTIVE" ? "Disable" : "Enable"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>{total} employees</span>
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
