import React, { useEffect, useRef } from "react";
import { MONTHS_SHORT } from "../constants";
import { gc } from "../styles/categoryStyles";
import type { CalendarEvent, Position } from "../types";
import { XBtn } from "./icons";

export const MorePop = React.memo(function MorePop({
    events,
    date,
    onClose,
    onEvtClick,
    pos,
}: {
    events: CalendarEvent[];
    date: Date;
    onClose: () => void;
    onEvtClick: (e: CalendarEvent, ev: React.MouseEvent) => void;
    pos: Position;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const h = (e: PointerEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener("pointerdown", h);
        return () => document.removeEventListener("pointerdown", h);
    }, [onClose]);
    return (
        <div
            ref={ref}
            className="rcal:fixed rcal:z-50 rcal:w-64 rcal:bg-white rcal:dark:bg-zinc-900 rcal:rounded-xl rcal:shadow-2xl rcal:border rcal:border-zinc-200 rcal:dark:border-zinc-700/50 rcal:overflow-hidden"
            style={{
                animation: "fadeIn .15s ease-out",
                top: Math.min(pos.y, window.innerHeight - 250),
                left: Math.min(pos.x, window.innerWidth - 280),
            }}
        >
            <div className="rcal:px-3.5 rcal:py-2.5 rcal:border-b rcal:border-zinc-100 rcal:dark:border-zinc-800 rcal:flex rcal:items-center rcal:justify-between">
                <span className="rcal:text-xs rcal:font-semibold rcal:text-zinc-700 rcal:dark:text-zinc-300">
                    {MONTHS_SHORT[date.getMonth()]} {date.getDate()} · {events.length} events
                </span>
                <button
                    type="button"
                    onClick={onClose}
                    className="rcal:p-0.5 rcal:text-zinc-400 rcal:hover:text-zinc-600 rcal:dark:hover:text-zinc-300"
                >
                    <XBtn />
                </button>
            </div>
            <div className="rcal:p-2 rcal:space-y-1 rcal:max-h-48 rcal:overflow-y-auto">
                {events.map((evt) => {
                    const c = gc(evt);
                    return (
                        <button
                            type="button"
                            key={evt.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                onEvtClick(evt, e);
                            }}
                            className={`rcal:w-full rcal:text-left rcal:px-2.5 rcal:py-1.5 rcal:rounded-lg rcal:text-xs rcal:font-medium ${c.bg} ${c.tx} ${c.dt} rcal:hover:opacity-80 rcal:transition-opacity rcal:truncate`}
                        >
                            {evt.title}
                        </button>
                    );
                })}
            </div>
        </div>
    );
});
