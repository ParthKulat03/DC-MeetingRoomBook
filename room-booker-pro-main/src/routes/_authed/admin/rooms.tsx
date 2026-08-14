import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState, ErrorState, LoadingState, PageHeader, StatusBadge } from "@/components/common/States";
import { useApi } from "@/hooks/useApi";
import { adminApi } from "@/api/admin.api";
import type { ApiError, MeetingRoom } from "@/types";

export const Route = createFileRoute("/_authed/admin/rooms")({
  head: () => ({
    meta: [
      { title: "Rooms | Meeting Room Admin" },
      { name: "description", content: "Create, edit and deactivate corporate meeting rooms." },
      { property: "og:title", content: "Rooms | Meeting Room Admin" },
      { property: "og:description", content: "Meeting room administration." },
    ],
  }),
  component: AdminRoomsPage,
});

function AdminRoomsPage() {
  const state = useApi(() => adminApi.rooms(), []);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MeetingRoom | null>(null);
  const [form, setForm] = useState({ name: "", description: "", capacity: 8 });

  const save = async () => {
    try {
      if (editing) await adminApi.updateRoom(editing.id, form);
      else await adminApi.createRoom(form);
      toast.success("Room saved.");
      setOpen(false);
      setEditing(null);
      state.reload();
    } catch (error) {
      toast.error((error as ApiError).message);
    }
  };

  const rooms = state.data?.rooms ?? [];

  return (
    <>
      <PageHeader
        title="Rooms"
        description="Meeting rooms available to employees."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditing(null);
                  setForm({ name: "", description: "", capacity: 8 });
                }}
              >
                Add room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Edit room" : "Add room"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="room-name">Name</Label>
                  <Input
                    id="room-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="room-desc">Description</Label>
                  <Input
                    id="room-desc"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="room-capacity">Capacity</Label>
                  <Input
                    id="room-capacity"
                    type="number"
                    min={1}
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                  />
                </div>
                <Button className="w-full" onClick={save} disabled={!form.name}>
                  Save room
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {state.loading ? (
        <LoadingState rows={2} />
      ) : state.error ? (
        <ErrorState message={state.error.message} onRetry={state.reload} />
      ) : rooms.length === 0 ? (
        <EmptyState title="No rooms configured" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rooms.map((room) => (
            <div key={room.id} className="rounded-xl border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{room.name}</p>
                  <p className="text-sm text-muted-foreground">{room.description}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{room.capacity} seats</p>
                </div>
                <StatusBadge value={room.status} />
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(room);
                    setForm({
                      name: room.name,
                      description: room.description,
                      capacity: room.capacity,
                    });
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await adminApi.setRoomStatus(
                      room.id,
                      room.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                    );
                    state.reload();
                  }}
                >
                  {room.status === "ACTIVE" ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
