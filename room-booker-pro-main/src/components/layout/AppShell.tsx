import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CalendarClock,
  CalendarPlus,
  CircleHelp,
  ClipboardList,
  DoorOpen,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  ScrollText,
  Settings,
  Sun,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useBookingDialog } from "@/contexts/BookingDialogContext";
import { useSocketStatus } from "@/hooks/useSocket";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { GuidedTour } from "@/components/tour/GuidedTour";
import { StatusBadge } from "@/components/common/States";
import { cn } from "@/lib/utils";

const userNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/bookings", label: "My Bookings", icon: CalendarClock },
  { to: "/bookings/history", label: "Booking History", icon: ClipboardList },
] as const;

const adminNav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/rooms", label: "Rooms", icon: DoorOpen },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarClock },
  { to: "/admin/reports", label: "Reports", icon: FileBarChart },
  { to: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { isAdmin } = useAuth();
  const { openBooking } = useBookingDialog();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const item = (to: string, label: string, Icon: typeof LayoutDashboard) => (
    <Link
      key={to}
      to={to}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        pathname === to
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {label}
    </Link>
  );

  return (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
      <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Workspace
      </p>
      {item("/dashboard", "Dashboard", LayoutDashboard)}
      <button
        type="button"
        data-tour="book-room"
        onClick={() => {
          openBooking();
          onNavigate?.();
        }}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <CalendarPlus className="h-4 w-4" aria-hidden />
        Book a Room
      </button>
      {userNav.slice(1).map((n) => item(n.to, n.label, n.icon))}
      {item("/help", "Help", CircleHelp)}

      {isAdmin ? (
        <>
          <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Administration
          </p>
          {adminNav.map((n) => item(n.to, n.label, n.icon))}
        </>
      ) : null}
    </nav>
  );
}

function UserArea() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="border-t pt-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start gap-3 px-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {user?.name?.slice(0, 2).toUpperCase() ?? "??"}
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-medium">{user?.name}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {user?.designation}
              </span>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60">
          <DropdownMenuLabel>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
            <p className="text-xs font-normal text-muted-foreground">{user?.employeeId}</p>
            <div className="mt-2">
              <StatusBadge value={user?.status ?? "ACTIVE"} />
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="mr-2 h-4 w-4" aria-hidden />
            ) : (
              <Sun className="mr-2 h-4 w-4" aria-hidden />
            )}
            {theme === "light" ? "Dark mode" : "Light mode"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => void signOut()}>
            <LogOut className="mr-2 h-4 w-4" aria-hidden />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const socketStatus = useSocketStatus();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-sidebar px-3 py-4 lg:flex">
        <Link to="/dashboard" className="mb-4 flex items-center gap-2 px-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            MR
          </span>
          <span className="text-sm font-semibold">Meeting Rooms</span>
        </Link>
        <NavLinks />
        <UserArea />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur lg:px-8">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col px-3 py-4">
              <SheetTitle className="px-3 text-sm">Meeting Rooms</SheetTitle>
              <NavLinks onNavigate={() => setDrawerOpen(false)} />
              <UserArea />
            </SheetContent>
          </Sheet>

          <div className="flex-1" />

          <span
            className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex"
            title={`Live updates ${socketStatus === "OPEN" ? "connected" : "reconnecting"}`}
          >
            {socketStatus === "OPEN" ? (
              <Wifi className="h-4 w-4 text-emerald-500" aria-hidden />
            ) : (
              <WifiOff className="h-4 w-4" aria-hidden />
            )}
            {socketStatus === "OPEN" ? "Live" : "Offline updates"}
          </span>

          <NotificationBell />

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle colour theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" aria-hidden />
            ) : (
              <Sun className="h-5 w-5" aria-hidden />
            )}
          </Button>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>

      <GuidedTour />
      <span className="sr-only">
        <Bell aria-hidden />
      </span>
    </div>
  );
}
