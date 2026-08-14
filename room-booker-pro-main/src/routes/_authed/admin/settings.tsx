import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorState, LoadingState, PageHeader } from "@/components/common/States";
import { useApi } from "@/hooks/useApi";
import { settingsApi } from "@/api/settings.api";
import type { ApiError, SystemSettings } from "@/types";

export const Route = createFileRoute("/_authed/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings | Meeting Room Admin" },
      { name: "description", content: "Working hours, booking limits and cancellation rules." },
      { property: "og:title", content: "Settings | Meeting Room Admin" },
      { property: "og:description", content: "Configure booking rules for your workspace." },
    ],
  }),
  component: AdminSettingsPage,
});

const FIELDS: [keyof SystemSettings, string, string][] = [
  ["minimumBookingDuration", "Minimum booking duration (min)", "number"],
  ["maximumBookingDuration", "Maximum booking duration (min)", "number"],
  ["cancellationCutoffMinutes", "Cancellation cut-off (min)", "number"],
  ["reminderMinutes", "Reminder before meeting (min)", "number"],
  ["workingDayStart", "Working day start", "time"],
  ["workingDayEnd", "Working day end", "time"],
  ["timezone", "Timezone", "text"],
];

function AdminSettingsPage() {
  const state = useApi(() => settingsApi.get(), []);
  const [form, setForm] = useState<SystemSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (state.data?.settings) setForm(state.data.settings);
  }, [state.data]);

  if (state.loading) return <LoadingState rows={5} />;
  if (state.error || !form)
    return <ErrorState message={state.error?.message} onRetry={state.reload} />;

  const save = async () => {
    setSaving(true);
    try {
      await settingsApi.update(form);
      toast.success("Settings saved.");
    } catch (error) {
      toast.error((error as ApiError).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Settings" description="Booking rules applied across the workspace." />
      <div className="grid max-w-3xl gap-4 rounded-xl border bg-card p-6 sm:grid-cols-2">
        {FIELDS.map(([key, label, type]) => (
          <div key={key} className="space-y-1.5">
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              type={type}
              value={String(form[key])}
              onChange={(e) =>
                setForm({
                  ...form,
                  [key]: type === "number" ? Number(e.target.value) : e.target.value,
                })
              }
            />
          </div>
        ))}
        <div className="sm:col-span-2">
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save settings"}
          </Button>
        </div>
      </div>
    </>
  );
}
