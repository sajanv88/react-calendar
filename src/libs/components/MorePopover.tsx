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
            className="fixed z-50 w-64 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700/50 overflow-hidden"
            style={{
                animation: "fadeIn .15s ease-out",
                top: Math.min(pos.y, window.innerHeight - 250),
                left: Math.min(pos.x, window.innerWidth - 280),
            }}
        >
            <div className="px-3.5 py-2.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {MONTHS_SHORT[date.getMonth()]} {date.getDate()} · {events.length} events
                </span>
                <button
                    type="button"
                    onClick={onClose}
                    className="p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                    <XBtn />
                </button>
            </div>
            <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
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
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${c.bg} ${c.tx} ${c.dt} hover:opacity-80 transition-opacity truncate`}
                        >
                            {evt.title}
                        </button>
                    );
                })}
            </div>
        </div>
    );
});
