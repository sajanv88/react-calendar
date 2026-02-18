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
            className="rcal:fixed rcal:z-50 rcal:w-72 rcal:bg-white rcal:dark:bg-zinc-900 rcal:rounded-xl rcal:shadow-2xl rcal:border rcal:border-zinc-200 rcal:dark:border-zinc-700/50 rcal:overflow-hidden"
            style={{
                animation: "fadeIn .15s ease-out",
                top: Math.min(pos.y, window.innerHeight - 300),
                left: Math.min(Math.max(pos.x - 136, 8), window.innerWidth - 288),
            }}
        >
            <div className={`rcal:h-1.5 ${c.dot}`} />
            <div className="rcal:p-4 rcal:space-y-3">
                <div className="rcal:flex rcal:items-start rcal:justify-between rcal:gap-2">
                    <h3 className="rcal:text-sm rcal:font-semibold rcal:text-zinc-900 rcal:dark:text-zinc-100 rcal:leading-snug">
                        {event.title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rcal:p-0.5 rcal:text-zinc-400 rcal:hover:text-zinc-600 rcal:dark:hover:text-zinc-300 rcal:flex-shrink-0"
                    >
                        <XBtn />
                    </button>
                </div>
                <div className="rcal:space-y-1.5 rcal:text-xs rcal:text-zinc-500 rcal:dark:text-zinc-400">
                    <div className="rcal:flex rcal:items-center rcal:gap-2">
                        <ClockI />
                        <span>
                            {event.allDay
                                ? `${MONTHS_SHORT[es.getMonth()]} ${es.getDate()} · All day`
                                : `${MONTHS_SHORT[es.getMonth()]} ${es.getDate()} · ${fmtTime(es.getHours(), es.getMinutes())} – ${fmtTime(ee.getHours(), ee.getMinutes())}`}
                        </span>
                    </div>
                    {event.location && (
                        <div className="rcal:flex rcal:items-center rcal:gap-2">
                            <PinI />
                            <span>{event.location}</span>
                        </div>
                    )}
                    {event.createdBy && (
                        <div className="rcal:flex rcal:items-center rcal:gap-2">
                            <UserI />
                            <span>{event.createdBy.name}</span>
                        </div>
                    )}
                </div>
                {event.description && (
                    <p className="rcal:text-xs rcal:text-zinc-500 rcal:dark:text-zinc-400 rcal:leading-relaxed rcal:border-t rcal:border-zinc-100 rcal:dark:border-zinc-800 rcal:pt-2">
                        {event.description}
                    </p>
                )}
                <span
                    className={`rcal:inline-flex rcal:items-center rcal:px-2 rcal:py-0.5 rcal:rounded-md rcal:text-[10px] rcal:font-semibold rcal:uppercase rcal:tracking-wider ${c.bg} ${c.tx} ${c.dt}`}
                >
                    {event.category}
                </span>
                <button
                    type="button"
                    onClick={() => {
                        onDelete(event.id);
                        onClose();
                    }}
                    className="rcal:w-full rcal:flex rcal:items-center rcal:justify-center rcal:gap-1.5 rcal:mt-1 rcal:px-3 rcal:py-1.5 rcal:rounded-lg rcal:text-xs rcal:font-medium rcal:text-rose-600 rcal:dark:text-rose-400 rcal:bg-rose-50 rcal:dark:bg-rose-500/10 rcal:hover:bg-rose-100 rcal:dark:hover:bg-rose-500/20 rcal:transition-colors"
                >
                    <TrashI /> Delete event
                </button>
            </div>
        </div>
    );
});
