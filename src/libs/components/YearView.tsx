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
        <div className="rcal:h-full rcal:w-full rcal:overflow-y-auto rcal:p-3 rcal:sm:p-6">
            <div className="rcal:grid rcal:grid-cols-2 rcal:sm:grid-cols-3 rcal:lg:grid-cols-4 rcal:gap-4 rcal:sm:gap-6">
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
            className="rcal:text-left rcal:rounded-xl rcal:p-3 rcal:sm:p-4 rcal:bg-zinc-50 rcal:dark:bg-zinc-900/50 rcal:border rcal:border-zinc-200/80 rcal:dark:border-zinc-800/50 rcal:hover:border-blue-300 rcal:dark:hover:border-blue-600 rcal:hover:shadow-lg rcal:transition-all rcal:group"
        >
            <div className="rcal:text-sm rcal:font-bold rcal:text-zinc-800 rcal:dark:text-zinc-200 rcal:mb-2 rcal:group-hover:text-blue-600 rcal:dark:group-hover:text-blue-400 rcal:transition-colors">
                {MONTHS[month.getMonth()]}
            </div>
            <div className="rcal:grid rcal:grid-cols-7 rcal:gap-px">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div
                        key={i}
                        className="rcal:text-[8px] rcal:font-semibold rcal:text-zinc-400 rcal:dark:text-zinc-600 rcal:text-center rcal:pb-0.5"
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
                        <div
                            key={i}
                            className="rcal:relative rcal:flex rcal:items-center rcal:justify-center"
                        >
                            <span
                                className={`rcal:text-[9px] rcal:w-5 rcal:h-5 rcal:flex rcal:items-center rcal:justify-center rcal:rounded-full ${!inM ? "rcal:text-zinc-300 rcal:dark:text-zinc-700" : "rcal:text-zinc-600 rcal:dark:text-zinc-400"} ${td ? "rcal:bg-blue-500 rcal:text-white rcal:font-bold" : ""} ${hol && inM && !td ? "rcal:bg-rose-100 rcal:dark:bg-rose-500/15 rcal:text-rose-500" : ""} ${has && inM && !td ? "rcal:font-bold" : ""}`}
                            >
                                {day.getDate()}
                            </span>
                            {has && inM && !td && (
                                <span className="rcal:absolute rcal:bottom-0 rcal:left-1/2 rcal:-translate-x-1/2 rcal:w-1 rcal:h-1 rcal:rounded-full rcal:bg-blue-400" />
                            )}
                        </div>
                    );
                })}
            </div>
        </button>
    );
});
