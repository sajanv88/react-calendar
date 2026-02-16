import React, { useEffect, useRef } from "react";
import { MONTHS_SHORT } from "../constants";
import { gc } from "../styles/categoryStyles";
import type { CalendarEvent, Position } from "../types";
import { fmtTime, parseISO } from "../utils/date";
import { ClockI, PinI, TrashI, UserI, XBtn } from "./icons";

export const EventPop = React.memo(function EventPop({
    event,
    onClose,
    onDelete,
    pos,
}: {
    event: CalendarEvent;
    onClose: () => void;
    onDelete: (id: string) => void;
    pos: Position;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const c = gc(event);
    useEffect(() => {
        const h = (e: PointerEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener("pointerdown", h);
        return () => document.removeEventListener("pointerdown", h);
    }, [onClose]);
    const es = parseISO(event.start),
        ee = parseISO(event.end);
    return (
        <div
            ref={ref}
            className="fixed z-50 w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700/50 overflow-hidden"
            style={{
                animation: "fadeIn .15s ease-out",
                top: Math.min(pos.y, window.innerHeight - 300),
                left: Math.min(Math.max(pos.x - 136, 8), window.innerWidth - 288),
            }}
        >
            <div className={`h-1.5 ${c.dot}`} />
            <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                        {event.title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 flex-shrink-0"
                    >
                        <XBtn />
                    </button>
                </div>
                <div className="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                        <ClockI />
                        <span>
                            {event.allDay
                                ? `${MONTHS_SHORT[es.getMonth()]} ${es.getDate()} · All day`
                                : `${MONTHS_SHORT[es.getMonth()]} ${es.getDate()} · ${fmtTime(es.getHours(), es.getMinutes())} – ${fmtTime(ee.getHours(), ee.getMinutes())}`}
                        </span>
                    </div>
                    {event.location && (
                        <div className="flex items-center gap-2">
                            <PinI />
                            <span>{event.location}</span>
                        </div>
                    )}
                    {event.createdBy && (
                        <div className="flex items-center gap-2">
                            <UserI />
                            <span>{event.createdBy.name}</span>
                        </div>
                    )}
                </div>
                {event.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-2">
                        {event.description}
                    </p>
                )}
                <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.tx} ${c.dt}`}
                >
                    {event.category}
                </span>
                <button
                    type="button"
                    onClick={() => {
                        onDelete(event.id);
                        onClose();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 mt-1 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
                >
                    <TrashI /> Delete event
                </button>
            </div>
        </div>
    );
});
