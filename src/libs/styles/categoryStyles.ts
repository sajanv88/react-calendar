import type { CalendarEvent, CategoryStyle, EventCategory } from "../types";

export const CAT_STYLES: Record<EventCategory, CategoryStyle> = {
    work: {
        bg: "rcal:bg-emerald-500/15",
        bd: "rcal:border-emerald-500",
        tx: "rcal:text-emerald-700",
        dot: "rcal:bg-emerald-500",
        dt: "rcal:dark:text-emerald-400",
        hex: "#10b981",
    },
    personal: {
        bg: "rcal:bg-indigo-500/15",
        bd: "rcal:border-indigo-500",
        tx: "rcal:text-indigo-700",
        dot: "rcal:bg-indigo-500",
        dt: "rcal:dark:text-indigo-400",
        hex: "#6366f1",
    },
    holiday: {
        bg: "rcal:bg-rose-500/15",
        bd: "rcal:border-rose-500",
        tx: "rcal:text-rose-700",
        dot: "rcal:bg-rose-500",
        dt: "rcal:dark:text-rose-400",
        hex: "#ef4444",
    },
    urgent: {
        bg: "rcal:bg-amber-500/15",
        bd: "rcal:border-amber-500",
        tx: "rcal:text-amber-700",
        dot: "rcal:bg-amber-500",
        dt: "rcal:dark:text-amber-400",
        hex: "#f59e0b",
    },
};

export function gc(e: CalendarEvent): CategoryStyle {
    return CAT_STYLES[e.category] || CAT_STYLES.work;
}
