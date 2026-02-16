import React, { useEffect, useRef } from "react";
import { DAYS, HOUR_H } from "../constants";
import { useGhost } from "../hooks/useGhost";
import { gc } from "../styles/categoryStyles";
import type { CalendarEvent, CalendarHook } from "../types";
import { fmtH24, fmtTime, isToday, parseISO } from "../utils/date";
import { layoutEvts } from "../utils/layout";
import { AllDayRow } from "./AllDayRow";
import { TimeNow } from "./TimeIndicator";

export const WeekView = React.memo(function WeekView({
    cal,
    onCell,
    onEvt,
}: {
    cal: CalendarHook;
    onCell: (d: Date, h: number) => void;
    onEvt: (e: CalendarEvent, ev: React.MouseEvent) => void;
}) {
    const gRef = useRef<HTMLDivElement>(null);
    const gh = useGhost(onCell);
    useEffect(() => {
        if (gRef.current) gRef.current.scrollTop = cal.workHours.start * HOUR_H - 16;
    }, [cal.workHours.start]);

    return (
        <div className="flex flex-col h-full w-full">
            <AllDayRow cal={cal} onEvtClick={onEvt} cols={7} />
            <div className="sticky top-0 z-20 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-sm shadow-black/[0.03] dark:shadow-black/20 flex-shrink-0">
                <div className="grid" style={{ gridTemplateColumns: "56px repeat(7,1fr)" }}>
                    <div className="py-2 border-r border-zinc-100 dark:border-zinc-800" />
                    {cal.weekDays.map((day) => {
                        const td = isToday(day),
                            hol = cal.isHol(day);
                        return (
                            <div
                                key={day.toISOString()}
                                className={`py-2 text-center border-r border-zinc-100 dark:border-zinc-800/50 last:border-r-0 transition-colors ${td ? "bg-blue-50/50 dark:bg-blue-500/[0.04]" : ""}`}
                            >
                                <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                                    {DAYS[day.getDay()]}
                                </div>
                                <div
                                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mt-0.5 transition-all ${td ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" : "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"} ${hol && !td ? "ring-2 ring-rose-400 dark:ring-rose-500" : ""}`}
                                >
                                    {day.getDate()}
                                </div>
                                {hol && (
                                    <div className="text-[9px] text-rose-500 dark:text-rose-400 font-semibold mt-0.5">
                                        Holiday
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden" ref={gRef}>
                <div
                    className="grid relative"
                    style={{ gridTemplateColumns: "56px repeat(7,1fr)", height: 24 * HOUR_H }}
                >
                    <div className="relative border-r border-zinc-200 dark:border-zinc-800">
                        {cal.hours.map((h) => (
                            <div
                                key={h}
                                className="absolute right-0 pr-2 flex items-start justify-end"
                                style={{ top: h * HOUR_H, height: HOUR_H }}
                            >
                                <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 -mt-1.5 tabular-nums select-none">
                                    {fmtH24(h)}
                                </span>
                            </div>
                        ))}
                    </div>
                    {cal.weekDays.map((day) => {
                        const td = isToday(day),
                            hol = cal.isHol(day);
                        const pos = layoutEvts(cal.timedForDay(day));
                        return (
                            <div
                                key={day.toISOString()}
                                className="relative border-r border-zinc-100 dark:border-zinc-800/40 last:border-r-0"
                            >
                                {cal.hours.map((h) => {
                                    const iw = cal.isWH(h);
                                    return (
                                        <div
                                            key={h}
                                            onPointerDown={gh.dn}
                                            onPointerUp={(e) => gh.up(day, h, e)}
                                            className={`absolute left-0 right-0 border-b border-zinc-100 dark:border-zinc-800/30 cursor-pointer transition-colors ${iw ? "bg-blue-50/30 dark:bg-blue-500/[0.02]" : "bg-transparent"} ${hol ? "bg-rose-50/30 dark:bg-rose-500/[0.02]" : ""} ${td && !iw && !hol ? "bg-blue-50/20 dark:bg-blue-500/[0.01]" : ""} hover:bg-blue-100/50 dark:hover:bg-blue-500/[0.08]`}
                                            style={{ top: h * HOUR_H, height: HOUR_H }}
                                        />
                                    );
                                })}
                                <div
                                    className="absolute left-0 right-0 border-t-2 border-blue-200/60 dark:border-blue-700/30 pointer-events-none z-10"
                                    style={{ top: cal.workHours.start * HOUR_H }}
                                />
                                <div
                                    className="absolute left-0 right-0 border-b-2 border-blue-200/60 dark:border-blue-700/30 pointer-events-none z-10"
                                    style={{ top: cal.workHours.end * HOUR_H }}
                                />
                                {pos.map(({ evt, top, height, left, width }) => {
                                    const c = gc(evt);
                                    return (
                                        <button
                                            type="button"
                                            key={evt.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEvt(evt, e);
                                            }}
                                            className={`absolute rounded-lg overflow-hidden border-l-[3px] z-20 cursor-pointer transition-all hover:brightness-95 hover:shadow-md active:scale-[0.98] ${c.bg} ${c.bd}`}
                                            style={{
                                                top,
                                                height: Math.max(height, 20),
                                                left: `calc(${left * 100}% + 2px)`,
                                                width: `calc(${width * 100}% - 4px)`,
                                                borderLeftColor: evt.color || c.hex,
                                            }}
                                            title={evt.title}
                                        >
                                            <div className="px-2 py-1 h-full overflow-hidden">
                                                <div
                                                    className={`text-[11px] font-semibold leading-tight truncate ${c.tx} ${c.dt}`}
                                                >
                                                    {evt.title}
                                                </div>
                                                {height > 36 && (
                                                    <div className="text-[10px] opacity-60 mt-0.5 text-zinc-600 dark:text-zinc-400">
                                                        {fmtTime(
                                                            parseISO(evt.start).getHours(),
                                                            parseISO(evt.start).getMinutes()
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                                {td && <TimeNow />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});
