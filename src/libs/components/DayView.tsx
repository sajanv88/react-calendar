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
        <div className="rcal:flex rcal:flex-col rcal:h-full rcal:w-full">
            <AllDayRow cal={cal} onEvtClick={onEvt} cols={1} />
            <div className="rcal:flex-1 rcal:min-h-0 rcal:overflow-y-auto" ref={gRef}>
                <div
                    className="rcal:grid rcal:relative"
                    style={{ gridTemplateColumns: "56px 1fr", height: 24 * HOUR_H }}
                >
                    <div className="rcal:relative rcal:border-r rcal:border-zinc-200 rcal:dark:border-zinc-800">
                        {cal.hours.map((h) => (
                            <div
                                key={h}
                                className="rcal:absolute rcal:right-0 rcal:pr-2 rcal:flex rcal:items-start rcal:justify-end"
                                style={{ top: h * HOUR_H, height: HOUR_H }}
                            >
                                <span className="rcal:text-[11px] rcal:font-medium rcal:text-zinc-400 rcal:dark:text-zinc-500 rcal:-mt-1.5 rcal:tabular-nums rcal:select-none">
                                    {fmtTime(h)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="rcal:relative">
                        {cal.hours.map((h) => {
                            const iw = cal.isWH(h);
                            return (
                                <div
                                    key={h}
                                    onPointerDown={gh.dn}
                                    onPointerUp={(e) => gh.up(cal.cur, h, e)}
                                    className={`rcal:absolute rcal:left-0 rcal:right-0 rcal:border-b rcal:border-zinc-100 rcal:dark:border-zinc-800/30 rcal:cursor-pointer rcal:transition-colors ${iw ? "rcal:bg-blue-50/30 rcal:dark:bg-blue-500/[0.02]" : ""} ${hol ? "rcal:bg-rose-50/30 rcal:dark:bg-rose-500/[0.02]" : ""} rcal:hover:bg-blue-100/40 rcal:dark:hover:bg-blue-500/[0.06]`}
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
                                    className={`rcal:absolute rcal:rounded-lg rcal:overflow-hidden rcal:border-l-[3px] rcal:z-20 rcal:cursor-pointer rcal:transition-all rcal:hover:brightness-95 rcal:hover:shadow-md rcal:active:scale-[0.98] ${c.bg} ${c.bd}`}
                                    style={{
                                        top,
                                        height: Math.max(height, 24),
                                        left: `calc(${left * 100}% + 4px)`,
                                        width: `calc(${width * 100}% - 8px)`,
                                        borderLeftColor: evt.color || c.hex,
                                    }}
                                >
                                    <div className="rcal:px-3 rcal:py-1.5 rcal:h-full rcal:overflow-hidden">
                                        <div
                                            className={`rcal:text-xs rcal:font-semibold rcal:leading-tight ${c.tx} ${c.dt}`}
                                        >
                                            {evt.title}
                                        </div>
                                        {height > 36 && (
                                            <div className="rcal:text-[10px] rcal:opacity-60 rcal:mt-0.5">
                                                {fmtTime(es.getHours(), es.getMinutes())} –{" "}
                                                {fmtTime(ee.getHours(), ee.getMinutes())}
                                            </div>
                                        )}
                                        {height > 56 && evt.location && (
                                            <div className="rcal:text-[10px] rcal:opacity-50 rcal:mt-0.5 rcal:flex rcal:items-center rcal:gap-1">
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
