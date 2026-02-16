import React from "react";
import { gc } from "../styles/categoryStyles";
import type { CalendarEvent } from "../types";

export const Chip = React.memo(function Chip({
    event,
    onClick,
    compact,
}: {
    event: CalendarEvent;
    onClick: (e: CalendarEvent, ev: React.MouseEvent) => void;
    compact?: boolean;
}) {
    const c = gc(event);
    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                onClick(event, e);
            }}
            title={event.title}
            className={`w-full text-left rounded-md px-1.5 py-0.5 text-[11px] leading-tight font-medium truncate border-l-2 transition-all hover:brightness-95 active:scale-[0.98] ${c.bg} ${c.bd} ${c.tx} ${c.dt}`}
        >
            {compact ? event.title.slice(0, 14) : event.title}
        </button>
    );
});
