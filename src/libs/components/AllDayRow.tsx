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
        <div className="rcal:border-b rcal:border-zinc-200 rcal:dark:border-zinc-800 rcal:bg-zinc-50/50 rcal:dark:bg-zinc-900/30 rcal:flex-shrink-0">
            <div
                className="rcal:grid"
                style={{ gridTemplateColumns: cols === 1 ? "56px 1fr" : "56px repeat(7,1fr)" }}
            >
                <div className="rcal:py-1.5 rcal:text-[9px] rcal:font-semibold rcal:text-zinc-400 rcal:dark:text-zinc-500 rcal:uppercase rcal:text-right rcal:border-r rcal:border-zinc-100 rcal:dark:border-zinc-800 rcal:flex rcal:items-center rcal:justify-end rcal:pr-2">
                    All day
                </div>
                {days.map((day) => {
                    const evts = cal.allDayForDay(day),
                        hol = cal.isHol(day);
                    return (
                        <div
                            key={day.toISOString()}
                            className="rcal:py-1.5 rcal:px-1 rcal:space-y-0.5 rcal:border-r rcal:border-zinc-100 rcal:dark:border-zinc-800/40 rcal:last:border-r-0 rcal:min-h-[32px]"
                        >
                            {hol && (
                                <div className="rcal:inline-flex rcal:items-center rcal:gap-1 rcal:px-1.5 rcal:py-0.5 rcal:rounded rcal:text-[9px] rcal:font-semibold rcal:bg-rose-100 rcal:dark:bg-rose-500/15 rcal:text-rose-600 rcal:dark:text-rose-400">
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
