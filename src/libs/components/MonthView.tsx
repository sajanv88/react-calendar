import React, { useState } from "react";
import { DAYS } from "../constants";
import type { CalendarEvent, CalendarHook, Position } from "../types";
import { isSameMonth, isToday } from "../utils/date";
import { Chip } from "./Chip";
import { MorePop } from "./MorePopover";

export const MonthView = React.memo(function MonthView({
    cal,
    onCell,
    onEvt,
}: {
    cal: CalendarHook;
    onCell: (d: Date) => void;
    onEvt: (e: CalendarEvent, ev: React.MouseEvent) => void;
}) {
    const [mp, sMP] = useState<{ events: CalendarEvent[]; date: Date; pos: Position } | null>(null);
    const MX = cal.mob ? 2 : 3;
    return (
        <div className="flex flex-col h-full w-full">
            <div className="grid grid-cols-7 sticky top-0 z-10 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-sm shadow-black/[0.02] dark:shadow-black/10">
                {DAYS.map((d) => (
                    <div
                        key={d}
                        className="py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500"
                    >
                        {cal.mob ? d.charAt(0) : d}
                    </div>
                ))}
            </div>
            <div className="flex-1 min-h-0 grid auto-rows-fr overflow-y-auto">
                {cal.monthGrid.map((wk, wi) => (
                    <div
                        key={wi}
                        className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0"
                    >
                        {wk.map((day) => {
                            const inM = isSameMonth(day, cal.cur),
                                td = isToday(day),
                                hol = cal.isHol(day);
                            const evts = cal.evtsForDay(day),
                                vis = evts.slice(0, MX),
                                mn = evts.length - MX;
                            return (
                                <div
                                    key={day.toISOString()}
                                    onClick={() => onCell(day)}
                                    className={`min-h-[72px] sm:min-h-[100px] p-1 sm:p-1.5 border-r border-zinc-100 dark:border-zinc-800/50 last:border-r-0 cursor-pointer transition-colors group relative
                    ${!inM ? "bg-zinc-50/50 dark:bg-zinc-900/30" : ""} ${hol ? "bg-rose-50/50 dark:bg-rose-500/[0.04]" : ""} ${td && !hol ? "bg-blue-50/40 dark:bg-blue-500/[0.03]" : ""} hover:bg-blue-50/70 dark:hover:bg-blue-500/[0.06]`}
                                >
                                    {td && (
                                        <div className="absolute inset-0 ring-inset ring-2 ring-blue-400/30 dark:ring-blue-500/20 rounded-sm pointer-events-none" />
                                    )}
                                    <div className="flex items-center justify-between mb-0.5">
                                        <span
                                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium transition-all ${td ? "bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/30" : ""} ${!td && inM ? "text-zinc-800 dark:text-zinc-200 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800" : ""} ${!td && !inM ? "text-zinc-300 dark:text-zinc-600" : ""}`}
                                        >
                                            {day.getDate()}
                                        </span>
                                        {hol && (
                                            <span className="text-[9px] font-semibold text-rose-500 dark:text-rose-400 uppercase tracking-wider hidden sm:block">
                                                Holiday
                                            </span>
                                        )}
                                    </div>
                                    {hol && (
                                        <span className="text-[9px] font-semibold text-rose-500 dark:text-rose-400 sm:hidden">
                                            H
                                        </span>
                                    )}
                                    <div className="space-y-0.5 mt-0.5">
                                        {vis.map((evt) => (
                                            <Chip
                                                key={evt.id}
                                                event={evt}
                                                onClick={onEvt}
                                                compact={cal.mob}
                                            />
                                        ))}
                                        {mn > 0 && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    sMP({
                                                        events: evts,
                                                        date: day,
                                                        pos: { x: e.clientX, y: e.clientY },
                                                    });
                                                }}
                                                className="text-[10px] font-semibold text-blue-500 dark:text-blue-400 hover:text-blue-600 pl-1.5 transition-colors"
                                            >
                                                +{mn} more
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            {mp && (
                <MorePop
                    events={mp.events}
                    date={mp.date}
                    pos={mp.pos}
                    onClose={() => sMP(null)}
                    onEvtClick={(evt, e) => {
                        sMP(null);
                        onEvt(evt, e);
                    }}
                />
            )}
        </div>
    );
});
