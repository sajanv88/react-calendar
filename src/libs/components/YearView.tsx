import React, { useCallback, useMemo } from "react";
import { MONTHS } from "../constants";
import type { CalendarHook } from "../types";
import { addDays, isToday, startOfMonth, startOfWeek } from "../utils/date";

export const YearView = React.memo(function YearView({ cal }: { cal: CalendarHook }) {
    const ym = useMemo(
        () => Array.from({ length: 12 }, (_, i) => new Date(cal.cur.getFullYear(), i, 1)),
        [cal.cur]
    );
    const click = useCallback(
        (m: Date) => {
            cal.setCur(m);
            cal.setView("month");
        },
        [cal]
    );
    return (
        <div className="h-full w-full overflow-y-auto p-3 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {ym.map((m) => (
                    <MiniM key={m.getMonth()} month={m} cal={cal} onClick={click} />
                ))}
            </div>
        </div>
    );
});

const MiniM = React.memo(function MiniM({
    month,
    cal,
    onClick,
}: {
    month: Date;
    cal: CalendarHook;
    onClick: (m: Date) => void;
}) {
    const wks = useMemo(() => {
        const f = startOfMonth(month),
            gs = startOfWeek(f),
            r: Date[][] = [];
        let d = gs;
        for (let w = 0; w < 6; w++) {
            const wk: Date[] = [];
            for (let i = 0; i < 7; i++) {
                wk.push(new Date(d));
                d = addDays(d, 1);
            }
            r.push(wk);
        }
        return r;
    }, [month]);
    return (
        <button
            type="button"
            onClick={() => onClick(month)}
            className="text-left rounded-xl p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all group"
        >
            <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {MONTHS[month.getMonth()]}
            </div>
            <div className="grid grid-cols-7 gap-px">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div
                        key={i}
                        className="text-[8px] font-semibold text-zinc-400 dark:text-zinc-600 text-center pb-0.5"
                    >
                        {d}
                    </div>
                ))}
                {wks.flat().map((day, i) => {
                    const inM = day.getMonth() === month.getMonth(),
                        td = isToday(day),
                        hol = cal.isHol(day),
                        has = cal.evtsForDay(day).length > 0;
                    return (
                        <div key={i} className="relative flex items-center justify-center">
                            <span
                                className={`text-[9px] w-5 h-5 flex items-center justify-center rounded-full ${!inM ? "text-zinc-300 dark:text-zinc-700" : "text-zinc-600 dark:text-zinc-400"} ${td ? "bg-blue-500 text-white font-bold" : ""} ${hol && inM && !td ? "bg-rose-100 dark:bg-rose-500/15 text-rose-500" : ""} ${has && inM && !td ? "font-bold" : ""}`}
                            >
                                {day.getDate()}
                            </span>
                            {has && inM && !td && (
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />
                            )}
                        </div>
                    );
                })}
            </div>
        </button>
    );
});
