import type { CalendarEvent, CategoryStyle, EventCategory } from "../types";

export const CAT_STYLES: Record<EventCategory, CategoryStyle> = {
    work: {
        bg: "bg-emerald-500/15",
        bd: "border-emerald-500",
        tx: "text-emerald-700",
        dot: "bg-emerald-500",
        dt: "dark:text-emerald-400",
        hex: "#10b981",
    },
    personal: {
        bg: "bg-indigo-500/15",
        bd: "border-indigo-500",
        tx: "text-indigo-700",
        dot: "bg-indigo-500",
        dt: "dark:text-indigo-400",
        hex: "#6366f1",
    },
    holiday: {
        bg: "bg-rose-500/15",
        bd: "border-rose-500",
        tx: "text-rose-700",
        dot: "bg-rose-500",
        dt: "dark:text-rose-400",
        hex: "#ef4444",
    },
    urgent: {
        bg: "bg-amber-500/15",
        bd: "border-amber-500",
        tx: "text-amber-700",
        dot: "bg-amber-500",
        dt: "dark:text-amber-400",
        hex: "#f59e0b",
    },
};

export function gc(e: CalendarEvent): CategoryStyle {
    return CAT_STYLES[e.category] || CAT_STYLES.work;
}
