import React, { useEffect, useRef } from "react";
import { HOUR_H } from "../constants";
import { useGhost } from "../hooks/useGhost";
import { gc } from "../styles/categoryStyles";
import type { CalendarEvent, CalendarHook } from "../types";
import { fmtTime, isToday, parseISO } from "../utils/date";
import { layoutEvts } from "../utils/layout";
import { AllDayRow } from "./AllDayRow";
import { PinI } from "./icons";
import { TimeNow } from "./TimeIndicator";

export const DayView = React.memo(function DayView({
    cal,
    onCell,
    onEvt,
}: {
    cal: CalendarHook;
    onCell: (d: Date, h: number) => void;
    onEvt: (e: CalendarEvent, ev: React.MouseEvent) => void;
}) {
    const gRef = useRef<HTMLDivElement>(null);
    const gh = useGhost((_day: Date, hour: number) => onCell(cal.cur, hour));
    useEffect(() => {
        if (gRef.current) gRef.current.scrollTop = cal.workHours.start * HOUR_H - 16;
    }, [cal.workHours.start]);
    const hol = cal.isHol(cal.cur),
        td = isToday(cal.cur);
    const pos = layoutEvts(cal.timedForDay(cal.cur));
    return (
        <div className="flex flex-col h-full w-full">
            <AllDayRow cal={cal} onEvtClick={onEvt} cols={1} />
            <div className="flex-1 min-h-0 overflow-y-auto" ref={gRef}>
                <div
                    className="grid relative"
                    style={{ gridTemplateColumns: "56px 1fr", height: 24 * HOUR_H }}
                >
                    <div className="relative border-r border-zinc-200 dark:border-zinc-800">
                        {cal.hours.map((h) => (
                            <div
                                key={h}
                                className="absolute right-0 pr-2 flex items-start justify-end"
                                style={{ top: h * HOUR_H, height: HOUR_H }}
                            >
                                <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 -mt-1.5 tabular-nums select-none">
                                    {fmtTime(h)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="relative">
                        {cal.hours.map((h) => {
                            const iw = cal.isWH(h);
                            return (
                                <div
                                    key={h}
                                    onPointerDown={gh.dn}
                                    onPointerUp={(e) => gh.up(cal.cur, h, e)}
                                    className={`absolute left-0 right-0 border-b border-zinc-100 dark:border-zinc-800/30 cursor-pointer transition-colors ${iw ? "bg-blue-50/30 dark:bg-blue-500/[0.02]" : ""} ${hol ? "bg-rose-50/30 dark:bg-rose-500/[0.02]" : ""} hover:bg-blue-100/40 dark:hover:bg-blue-500/[0.06]`}
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
                            const c = gc(evt),
                                es = parseISO(evt.start),
                                ee = parseISO(evt.end);
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
                                        height: Math.max(height, 24),
                                        left: `calc(${left * 100}% + 4px)`,
                                        width: `calc(${width * 100}% - 8px)`,
                                        borderLeftColor: evt.color || c.hex,
                                    }}
                                >
                                    <div className="px-3 py-1.5 h-full overflow-hidden">
                                        <div
                                            className={`text-xs font-semibold leading-tight ${c.tx} ${c.dt}`}
                                        >
                                            {evt.title}
                                        </div>
                                        {height > 36 && (
                                            <div className="text-[10px] opacity-60 mt-0.5">
                                                {fmtTime(es.getHours(), es.getMinutes())} –{" "}
                                                {fmtTime(ee.getHours(), ee.getMinutes())}
                                            </div>
                                        )}
                                        {height > 56 && evt.location && (
                                            <div className="text-[10px] opacity-50 mt-0.5 flex items-center gap-1">
                                                <PinI />
                                                {evt.location}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                        {td && <TimeNow />}
                    </div>
                </div>
            </div>
        </div>
    );
});
