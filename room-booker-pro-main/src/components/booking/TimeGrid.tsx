import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SLOT_MINUTES } from "@/constants/apiRoutes";
import { buildSlots, formatTime12, isPastSlot, toMinutes, toTime } from "@/utils/time";
import type { AvailabilityBlock } from "@/types";
import { cn } from "@/lib/utils";

export type SlotState = "AVAILABLE" | "BOOKED" | "OWN" | "PAST";

export interface TimeGridProps {
  date: string;
  dayStart: string;
  dayEnd: string;
  blocks: AvailabilityBlock[];
  value: { start: string; end: string } | null;
  onChange: (range: { start: string; end: string } | null) => void;
  onInvalidSelection?: (() => void) | undefined;
  disabled?: boolean | undefined;
}

const slotStateOf = (date: string, slot: string, blocks: AvailabilityBlock[]): SlotState => {
  if (isPastSlot(date, slot)) return "PAST";
  const block = blocks.find((b) => slot >= b.startTime && slot < b.endTime);
  if (block) return block.isOwn ? "OWN" : "BOOKED";
  return "AVAILABLE";
};

const TimeSlot = memo(function TimeSlot({
  slot,
  state,
  selected,
  onPointerDown,
  onPointerEnter,
  onKeyDown,
  index,
}: {
  slot: string;
  state: SlotState;
  selected: boolean;
  onPointerDown: (index: number) => void;
  onPointerEnter: (index: number) => void;
  onKeyDown: (event: React.KeyboardEvent, index: number) => void;
  index: number;
}) {
  const selectable = state === "AVAILABLE";
  const isHour = slot.endsWith(":00");
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      aria-label={`${formatTime12(slot)} ${state.toLowerCase()}`}
      disabled={!selectable}
      onPointerDown={(e) => {
        e.preventDefault();
        onPointerDown(index);
      }}
      onPointerEnter={() => onPointerEnter(index)}
      onKeyDown={(e) => onKeyDown(e, index)}
      className={cn(
        "no-select flex h-9 w-full items-center gap-3 border-b border-border/70 px-3 text-left text-xs transition-colors",
        isHour && "border-t border-t-border",
        state === "AVAILABLE" && "bg-card hover:bg-primary/10",
        state === "BOOKED" && "cursor-not-allowed bg-slot-booked text-muted-foreground",
        state === "OWN" && "cursor-not-allowed bg-slot-own text-foreground",
        state === "PAST" && "cursor-not-allowed bg-muted/40 text-muted-foreground/60",
        selected && "bg-primary text-primary-foreground hover:bg-primary",
      )}
    >
      <span className={cn("w-16 shrink-0 tabular-nums", !isHour && "opacity-0")}>
        {formatTime12(slot)}
      </span>
      <span className="truncate">
        {state === "BOOKED" ? "Booked" : state === "OWN" ? "Your booking" : ""}
      </span>
    </button>
  );
});

export function TimeGrid({
  date,
  dayStart,
  dayEnd,
  blocks,
  value,
  onChange,
  onInvalidSelection,
  disabled,
}: TimeGridProps) {
  const slots = useMemo(() => buildSlots(dayStart, dayEnd), [dayStart, dayEnd]);
  const states = useMemo(
    () => slots.map((slot) => slotStateOf(date, slot, blocks)),
    [slots, date, blocks],
  );
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedRange = useMemo(() => {
    if (dragStart !== null && dragEnd !== null)
      return { from: Math.min(dragStart, dragEnd), to: Math.max(dragStart, dragEnd) };
    if (!value) return null;
    const from = slots.indexOf(value.start);
    const to = slots.indexOf(toTime(toMinutes(value.end) - SLOT_MINUTES));
    if (from < 0 || to < 0) return null;
    return { from, to };
  }, [dragStart, dragEnd, value, slots]);

  const commit = useCallback(
    (from: number, to: number) => {
      const lo = Math.min(from, to);
      const hi = Math.max(from, to);
      for (let i = lo; i <= hi; i += 1) {
        if (states[i] !== "AVAILABLE") {
          onInvalidSelection?.();
          onChange(null);
          return;
        }
      }
      onChange({ start: slots[lo]!, end: toTime(toMinutes(slots[hi]!) + SLOT_MINUTES) });
    },
    [states, slots, onChange, onInvalidSelection],
  );

  const handlePointerDown = useCallback(
    (index: number) => {
      if (disabled || states[index] !== "AVAILABLE") return;
      setDragStart(index);
      setDragEnd(index);
    },
    [disabled, states],
  );

  const handlePointerEnter = useCallback(
    (index: number) => {
      if (dragStart === null) return;
      setDragEnd(index);
    },
    [dragStart],
  );

  useEffect(() => {
    if (dragStart === null) return;
    const finish = () => {
      if (dragStart !== null && dragEnd !== null) commit(dragStart, dragEnd);
      setDragStart(null);
      setDragEnd(null);
    };
    const move = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      const idx = el?.closest("[data-slot-index]")?.getAttribute("data-slot-index");
      if (idx) setDragEnd(Number(idx));
    };
    window.addEventListener("pointerup", finish);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", finish);
    return () => {
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", finish);
    };
  }, [dragStart, dragEnd, commit]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (value && slots.indexOf(value.start) <= index) commit(slots.indexOf(value.start), index);
        else commit(index, index);
      }
    },
    [commit, slots, value],
  );

  const nowIndicator = useMemo(() => {
    const now = new Date();
    const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    if (iso !== date) return null;
    const minutes = now.getHours() * 60 + now.getMinutes();
    const startM = toMinutes(dayStart);
    const endM = toMinutes(dayEnd);
    if (minutes < startM || minutes > endM) return null;
    return ((minutes - startM) / SLOT_MINUTES) * 36;
  }, [date, dayStart, dayEnd]);

  return (
    <div
      ref={containerRef}
      role="listbox"
      aria-label="Time slots"
      aria-multiselectable
      className="relative max-h-[320px] overflow-y-auto rounded-xl border bg-card"
    >
      {nowIndicator !== null ? (
        <div
          className="pointer-events-none absolute left-0 right-0 z-10 flex items-center"
          style={{ top: nowIndicator }}
          aria-hidden
        >
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="h-px flex-1 bg-accent" />
        </div>
      ) : null}
      {slots.map((slot, index) => (
        <div key={slot} data-slot-index={index}>
          <TimeSlot
            slot={slot}
            index={index}
            state={states[index]!}
            selected={Boolean(
              selectedRange && index >= selectedRange.from && index <= selectedRange.to,
            )}
            onPointerDown={handlePointerDown}
            onPointerEnter={handlePointerEnter}
            onKeyDown={handleKeyDown}
          />
        </div>
      ))}
    </div>
  );
}

export function TimeGridLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <i className="h-3 w-3 rounded border bg-card" /> Available
      </span>
      <span className="flex items-center gap-1.5">
        <i className="h-3 w-3 rounded bg-slot-booked" /> Booked
      </span>
      <span className="flex items-center gap-1.5">
        <i className="h-3 w-3 rounded bg-slot-own" /> Your booking
      </span>
      <span className="flex items-center gap-1.5">
        <i className="h-3 w-3 rounded bg-primary" /> Selected
      </span>
    </div>
  );
}
