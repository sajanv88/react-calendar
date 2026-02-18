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
        <div className="rcal:flex rcal:flex-col rcal:h-full rcal:w-full">
            <AllDayRow cal={cal} onEvtClick={onEvt} cols={7} />
            <div className="rcal:sticky rcal:top-0 rcal:z-20 rcal:bg-white rcal:dark:bg-zinc-950 rcal:border-b rcal:border-zinc-200 rcal:dark:border-zinc-800 rcal:shadow-sm rcal:shadow-black/[0.03] rcal:dark:shadow-black/20 rcal:flex-shrink-0">
                <div className="rcal:grid" style={{ gridTemplateColumns: "56px repeat(7,1fr)" }}>
                    <div className="rcal:py-2 rcal:border-r rcal:border-zinc-100 rcal:dark:border-zinc-800" />
                    {cal.weekDays.map((day) => {
                        const td = isToday(day),
                            hol = cal.isHol(day);
                        return (
                            <div
                                key={day.toISOString()}
                                className={`rcal:py-2 rcal:text-center rcal:border-r rcal:border-zinc-100 rcal:dark:border-zinc-800/50 rcal:last:border-r-0 rcal:transition-colors ${td ? "rcal:bg-blue-50/50 rcal:dark:bg-blue-500/[0.04]" : ""}`}
                            >
                                <div className="rcal:text-[10px] rcal:font-semibold rcal:uppercase rcal:tracking-wider rcal:text-zinc-400 rcal:dark:text-zinc-500">
                                    {DAYS[day.getDay()]}
                                </div>
                                <div
                                    className={`rcal:inline-flex rcal:items-center rcal:justify-center rcal:w-8 rcal:h-8 rcal:rounded-full rcal:text-sm rcal:font-bold rcal:mt-0.5 rcal:transition-all ${td ? "rcal:bg-blue-500 rcal:text-white rcal:shadow-lg rcal:shadow-blue-500/30" : "rcal:text-zinc-800 rcal:dark:text-zinc-200 rcal:hover:bg-zinc-100 rcal:dark:hover:bg-zinc-800"} ${hol && !td ? "rcal:ring-2 rcal:ring-rose-400 rcal:dark:ring-rose-500" : ""}`}
                                >
                                    {day.getDate()}
                                </div>
                                {hol && (
                                    <div className="rcal:text-[9px] rcal:text-rose-500 rcal:dark:text-rose-400 rcal:font-semibold rcal:mt-0.5">
                                        Holiday
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="rcal:flex-1 rcal:min-h-0 rcal:overflow-y-auto rcal:overflow-x-hidden" ref={gRef}>
                <div
                    className="rcal:grid rcal:relative"
                    style={{ gridTemplateColumns: "56px repeat(7,1fr)", height: 24 * HOUR_H }}
                >
                    <div className="rcal:relative rcal:border-r rcal:border-zinc-200 rcal:dark:border-zinc-800">
                        {cal.hours.map((h) => (
                            <div
                                key={h}
                                className="rcal:absolute rcal:right-0 rcal:pr-2 rcal:flex rcal:items-start rcal:justify-end"
                                style={{ top: h * HOUR_H, height: HOUR_H }}
                            >
                                <span className="rcal:text-[10px] rcal:font-medium rcal:text-zinc-400 rcal:dark:text-zinc-500 rcal:-mt-1.5 rcal:tabular-nums rcal:select-none">
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
                                className="rcal:relative rcal:border-r rcal:border-zinc-100 rcal:dark:border-zinc-800/40 rcal:last:border-r-0"
                            >
                                {cal.hours.map((h) => {
                                    const iw = cal.isWH(h);
                                    return (
                                        <div
                                            key={h}
                                            onPointerDown={gh.dn}
                                            onPointerUp={(e) => gh.up(day, h, e)}
                                            className={`rcal:absolute rcal:left-0 rcal:right-0 rcal:border-b rcal:border-zinc-100 rcal:dark:border-zinc-800/30 rcal:cursor-pointer rcal:transition-colors ${iw ? "rcal:bg-blue-50/30 rcal:dark:bg-blue-500/[0.02]" : "rcal:bg-transparent"} ${hol ? "rcal:bg-rose-50/30 rcal:dark:bg-rose-500/[0.02]" : ""} ${td && !iw && !hol ? "rcal:bg-blue-50/20 rcal:dark:bg-blue-500/[0.01]" : ""} rcal:hover:bg-blue-100/50 rcal:dark:hover:bg-blue-500/[0.08]`}
                                            style={{ top: h * HOUR_H, height: HOUR_H }}
                                        />
                                    );
                                })}
                                <div
                                    className="rcal:absolute rcal:left-0 rcal:right-0 rcal:border-t-2 rcal:border-blue-200/60 rcal:dark:border-blue-700/30 rcal:pointer-events-none rcal:z-10"
                                    style={{ top: cal.workHours.start * HOUR_H }}
                                />
                                <div
                                    className="rcal:absolute rcal:left-0 rcal:right-0 rcal:border-b-2 rcal:border-blue-200/60 rcal:dark:border-blue-700/30 rcal:pointer-events-none rcal:z-10"
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
                                            className={`rcal:absolute rcal:rounded-lg rcal:overflow-hidden rcal:border-l-[3px] rcal:z-20 rcal:cursor-pointer rcal:transition-all rcal:hover:brightness-95 rcal:hover:shadow-md rcal:active:scale-[0.98] ${c.bg} ${c.bd}`}
                                            style={{
                                                top,
                                                height: Math.max(height, 20),
                                                left: `calc(${left * 100}% + 2px)`,
                                                width: `calc(${width * 100}% - 4px)`,
                                                borderLeftColor: evt.color || c.hex,
                                            }}
                                            title={evt.title}
                                        >
                                            <div className="rcal:px-2 rcal:py-1 rcal:h-full rcal:overflow-hidden">
                                                <div
                                                    className={`rcal:text-[11px] rcal:font-semibold rcal:leading-tight rcal:truncate ${c.tx} ${c.dt}`}
                                                >
                                                    {evt.title}
                                                </div>
                                                {height > 36 && (
                                                    <div className="rcal:text-[10px] rcal:opacity-60 rcal:mt-0.5 rcal:text-zinc-600 rcal:dark:text-zinc-400">
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
