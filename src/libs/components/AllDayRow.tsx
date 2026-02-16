import React from "react";
import type { CalendarEvent, CalendarHook } from "../types";
import { Chip } from "./Chip";
import { CalI } from "./icons";

export const AllDayRow = React.memo(function AllDayRow({
    cal,
    onEvtClick,
    cols,
}: {
    cal: CalendarHook;
    onEvtClick: (e: CalendarEvent, ev: React.MouseEvent) => void;
    cols: number;
}) {
    const days = cols === 1 ? [cal.cur] : cal.weekDays;
    const hasAny = days.some((d) => cal.allDayForDay(d).length > 0 || cal.isHol(d));
    if (!hasAny) return null;
    return (
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex-shrink-0">
            <div
                className="grid"
                style={{ gridTemplateColumns: cols === 1 ? "56px 1fr" : "56px repeat(7,1fr)" }}
            >
                <div className="py-1.5 text-[9px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase text-right border-r border-zinc-100 dark:border-zinc-800 flex items-center justify-end pr-2">
                    All day
                </div>
                {days.map((day) => {
                    const evts = cal.allDayForDay(day),
                        hol = cal.isHol(day);
                    return (
                        <div
                            key={day.toISOString()}
                            className="py-1.5 px-1 space-y-0.5 border-r border-zinc-100 dark:border-zinc-800/40 last:border-r-0 min-h-[32px]"
                        >
                            {hol && (
                                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400">
                                    <CalI /> Holiday
                                </div>
                            )}
                            {evts.map((evt) => (
                                <Chip key={evt.id} event={evt} onClick={onEvtClick} compact />
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
