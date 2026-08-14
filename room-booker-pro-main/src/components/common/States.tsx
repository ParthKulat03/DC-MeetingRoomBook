import { AlertCircle, Inbox, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string | undefined;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function LoadingState({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading</span>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function InlineSpinner({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      {label}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string | undefined;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/60 px-6 py-14 text-center">
      <Inbox className="mb-3 h-8 w-8 text-muted-foreground" aria-hidden />
      <p className="font-medium">{title}</p>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string | undefined; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
      <AlertCircle className="mb-3 h-8 w-8 text-destructive" aria-hidden />
      <p className="font-medium">Something went wrong</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {message ?? "We couldn't load this content."}
      </p>
      {onRetry ? (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          <RefreshCcw className="mr-2 h-4 w-4" aria-hidden />
          Try again
        </Button>
      ) : null}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  CONFIRMED: "bg-primary/10 text-primary",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-destructive/10 text-destructive",
  ACTIVE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  INACTIVE: "bg-muted text-muted-foreground",
  DISABLED: "bg-destructive/10 text-destructive",
  PENDING: "bg-accent/15 text-accent",
  APPROVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  REJECTED: "bg-destructive/10 text-destructive",
  VERIFIED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  UNVERIFIED: "bg-accent/15 text-accent",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[value] ?? "bg-muted text-muted-foreground"}`}
    >
      {value.charAt(0) + value.slice(1).toLowerCase()}
    </span>
  );
}
