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
            className={`rcal:w-full rcal:text-left rcal:rounded-md rcal:px-1.5 rcal:py-0.5 rcal:text-[11px] rcal:leading-tight rcal:font-medium rcal:truncate rcal:border-l-2 rcal:transition-all rcal:hover:brightness-95 rcal:active:scale-[0.98] ${c.bg} ${c.bd} ${c.tx} ${c.dt}`}
        >
            {compact ? event.title.slice(0, 14) : event.title}
        </button>
    );
});
