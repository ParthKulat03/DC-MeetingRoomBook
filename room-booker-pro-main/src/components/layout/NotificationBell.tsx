import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { notificationsApi } from "@/api/notifications.api";
import { useApi } from "@/hooks/useApi";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";

export function NotificationBell() {
  const { data, loading, error, reload } = useApi(() => notificationsApi.list(), []);
  const notifications = data?.notifications ?? [];
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" aria-hidden />
          {unread > 0 ? (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
              {unread}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-medium">Notifications</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await notificationsApi.markAllRead();
              reload();
            }}
          >
            Mark all read
          </Button>
        </div>
        <div className="max-h-80 overflow-y-auto p-3">
          {loading ? (
            <LoadingState rows={2} />
          ) : error ? (
            <ErrorState message={error.message} onRetry={reload} />
          ) : notifications.length === 0 ? (
            <EmptyState title="You're all caught up" />
          ) : (
            <ul className="space-y-2">
              {notifications.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={async () => {
                      await notificationsApi.markRead(n.id);
                      reload();
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted ${
                      n.read ? "opacity-60" : ""
                    }`}
                  >
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.message}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
