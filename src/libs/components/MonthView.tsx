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
        <div className="rcal:flex rcal:flex-col rcal:h-full rcal:w-full">
            <div className="rcal:grid rcal:grid-cols-7 rcal:sticky rcal:top-0 rcal:z-10 rcal:bg-white rcal:dark:bg-zinc-950 rcal:border-b rcal:border-zinc-200 rcal:dark:border-zinc-800 rcal:shadow-sm rcal:shadow-black/[0.02] rcal:dark:shadow-black/10">
                {DAYS.map((d) => (
                    <div
                        key={d}
                        className="rcal:py-2.5 rcal:text-center rcal:text-[11px] rcal:font-semibold rcal:uppercase rcal:tracking-wider rcal:text-zinc-400 rcal:dark:text-zinc-500"
                    >
                        {cal.mob ? d.charAt(0) : d}
                    </div>
                ))}
            </div>
            <div className="rcal:flex-1 rcal:min-h-0 rcal:grid rcal:auto-rows-fr rcal:overflow-y-auto">
                {cal.monthGrid.map((wk, wi) => (
                    <div
                        key={wi}
                        className="rcal:grid rcal:grid-cols-7 rcal:border-b rcal:border-zinc-100 rcal:dark:border-zinc-800/50 rcal:last:border-0"
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
                                    className={`rcal:min-h-[72px] rcal:sm:min-h-[100px] rcal:p-1 rcal:sm:p-1.5 rcal:border-r rcal:border-zinc-100 rcal:dark:border-zinc-800/50 rcal:last:border-r-0 rcal:cursor-pointer rcal:transition-colors rcal:group rcal:relative
                    ${!inM ? "rcal:bg-zinc-50/50 rcal:dark:bg-zinc-900/30" : ""} ${hol ? "rcal:bg-rose-50/50 rcal:dark:bg-rose-500/[0.04]" : ""} ${td && !hol ? "rcal:bg-blue-50/40 rcal:dark:bg-blue-500/[0.03]" : ""} rcal:hover:bg-blue-50/70 rcal:dark:hover:bg-blue-500/[0.06]`}
                                >
                                    {td && (
                                        <div className="rcal:absolute rcal:inset-0 rcal:ring-inset rcal:ring-2 rcal:ring-blue-400/30 rcal:dark:ring-blue-500/20 rcal:rounded-sm rcal:pointer-events-none" />
                                    )}
                                    <div className="rcal:flex rcal:items-center rcal:justify-between rcal:mb-0.5">
                                        <span
                                            className={`rcal:inline-flex rcal:items-center rcal:justify-center rcal:w-7 rcal:h-7 rcal:rounded-full rcal:text-xs rcal:font-medium rcal:transition-all ${td ? "rcal:bg-blue-500 rcal:text-white rcal:font-bold rcal:shadow-lg rcal:shadow-blue-500/30" : ""} ${!td && inM ? "rcal:text-zinc-800 rcal:dark:text-zinc-200 rcal:group-hover:bg-zinc-100 rcal:dark:group-hover:bg-zinc-800" : ""} ${!td && !inM ? "rcal:text-zinc-300 rcal:dark:text-zinc-600" : ""}`}
                                        >
                                            {day.getDate()}
                                        </span>
                                        {hol && (
                                            <span className="rcal:text-[9px] rcal:font-semibold rcal:text-rose-500 rcal:dark:text-rose-400 rcal:uppercase rcal:tracking-wider rcal:hidden rcal:sm:block">
                                                Holiday
                                            </span>
                                        )}
                                    </div>
                                    {hol && (
                                        <span className="rcal:text-[9px] rcal:font-semibold rcal:text-rose-500 rcal:dark:text-rose-400 rcal:sm:hidden">
                                            H
                                        </span>
                                    )}
                                    <div className="rcal:space-y-0.5 rcal:mt-0.5">
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
                                                className="rcal:text-[10px] rcal:font-semibold rcal:text-blue-500 rcal:dark:text-blue-400 rcal:hover:text-blue-600 rcal:pl-1.5 rcal:transition-colors"
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
