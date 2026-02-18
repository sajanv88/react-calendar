import type React from "react";
import { useCallback, useState } from "react";
import { DEFAULT_HOLIDAYS, DEFAULT_WORK_HOURS, SAMPLE_EVENTS } from "../constants";
import { ThemeCtx } from "../context/ThemeContext";
import { useCalendar } from "../hooks/useCalendar";
import type {
    CalendarEvent,
    CalendarProps,
    CalendarView,
    ModalState,
    PopoverState,
    ThemeMode,
} from "../types";
import { fmtTime } from "../utils/date";
import { DayView } from "./DayView";
import { EventModal } from "./EventModal";
import { EventPop } from "./EventPopover";
import { CalI, ChevL, ChevR, MoonI, PlusI, SunI } from "./icons";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { YearView } from "./YearView";

export default function Calendar({
    initialEvents = SAMPLE_EVENTS,
    holidays = DEFAULT_HOLIDAYS,
    workHours = DEFAULT_WORK_HOURS,
    theme: initialTheme = "light",
    onEventAdd,
    enableThemeToggle,
}: CalendarProps) {
    const [theme, setTheme] = useState<ThemeMode>(initialTheme);
    const cal = useCalendar({ initialEvents, holidays, workHours });

    const [modal, setModal] = useState<ModalState>({
        open: false,
        date: null,
        hour: null,
        evt: null,
    });
    const [pop, setPop] = useState<PopoverState | null>(null);

    const onCell = useCallback((date: Date, hour?: number) => {
        setPop(null);
        setModal({ open: true, date, hour: hour != null ? hour : 9, evt: null });
    }, []);
    const onEvt = useCallback((evt: CalendarEvent, e: React.MouseEvent) => {
        e.stopPropagation();
        setPop({ event: evt, pos: { x: e.clientX, y: e.clientY } });
    }, []);
    const onSave = useCallback(
        (evt: CalendarEvent) => {
            cal.addEvt(evt);
            onEventAdd?.(evt);
        },
        [cal.addEvt, onEventAdd]
    );
    const onDel = useCallback(
        (id: string) => {
            cal.rmEvt(id);
            setPop(null);
        },
        [cal.rmEvt]
    );
    const togTheme = useCallback(() => setTheme((t) => (t === "light" ? "dark" : "light")), []);

    const vOpts = cal.mob
        ? [
              { k: "day" as CalendarView, l: "Day" },
              { k: "month" as CalendarView, l: "Month" },
              { k: "year" as CalendarView, l: "Year" },
          ]
        : [
              { k: "day" as CalendarView, l: "Day" },
              { k: "week" as CalendarView, l: "Week" },
              { k: "month" as CalendarView, l: "Month" },
              { k: "year" as CalendarView, l: "Year" },
          ];

    return (
        <ThemeCtx.Provider value={{ theme, toggle: togTheme }}>
            <div className={`h-full w-full ${theme === "dark" ? "dark" : ""}`}>
                <div
                    className="flex flex-col h-full w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                    style={{ fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif" }}
                >
                    <style>{`
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
            @keyframes slideUp{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}
            @keyframes fadeIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
            *{scrollbar-width:thin;scrollbar-color:#a1a1aa20 transparent}.dark *{scrollbar-color:#52525b40 transparent}
          `}</style>

                    <header className="flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <div className="flex items-center justify-between px-3 sm:px-5 py-3 gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/25 flex-shrink-0">
                                    <CalI />
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-sm sm:text-lg font-bold truncate tracking-tight">
                                        {cal.title}
                                    </h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={cal.goPrev}
                                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors active:scale-95"
                                >
                                    <ChevL />
                                </button>
                                <button
                                    type="button"
                                    onClick={cal.goToday}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors active:scale-95"
                                >
                                    Today
                                </button>
                                <button
                                    type="button"
                                    onClick={cal.goNext}
                                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors active:scale-95"
                                >
                                    <ChevR />
                                </button>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="hidden sm:flex items-center bg-zinc-100 dark:bg-zinc-800/80 rounded-lg p-0.5">
                                    {vOpts.map((v) => (
                                        <button
                                            type="button"
                                            key={v.k}
                                            onClick={() => cal.setView(v.k)}
                                            className={`px-2.5 py-1.5 rounded-md text-[11px] font-semibold transition-all ${cal.view === v.k ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                                        >
                                            {v.l}
                                        </button>
                                    ))}
                                </div>
                                {enableThemeToggle && (
                                    <button
                                        type="button"
                                        onClick={togTheme}
                                        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                        title={theme === "light" ? "Dark mode" : "Light mode"}
                                    >
                                        {theme === "light" ? <MoonI /> : <SunI />}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => onCell(cal.cur)}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/25 active:scale-95"
                                >
                                    <PlusI />
                                    <span className="hidden sm:inline">Event</span>
                                </button>
                            </div>
                        </div>
                        <div className="sm:hidden flex items-center gap-1 px-3 pb-2">
                            {vOpts.map((v) => (
                                <button
                                    type="button"
                                    key={v.k}
                                    onClick={() => cal.setView(v.k)}
                                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${cal.view === v.k ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500"}`}
                                >
                                    {v.l}
                                </button>
                            ))}
                        </div>
                    </header>

                    <main className="flex-1 min-h-0">
                        {cal.view === "month" && (
                            <MonthView cal={cal} onCell={(d) => onCell(d)} onEvt={onEvt} />
                        )}
                        {cal.view === "week" && (
                            <WeekView cal={cal} onCell={onCell} onEvt={onEvt} />
                        )}
                        {cal.view === "day" && <DayView cal={cal} onCell={onCell} onEvt={onEvt} />}
                        {cal.view === "year" && <YearView cal={cal} />}
                    </main>

                    <footer className="flex-shrink-0 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-4 py-2">
                        <div className="flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500">
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    Work
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                    Personal
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                                    Holiday
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                    Urgent
                                </span>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 font-medium">
                                <span className="w-3 h-2 rounded-sm bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800" />
                                Work: {fmtTime(workHours.start)} – {fmtTime(workHours.end)}
                            </div>
                        </div>
                    </footer>

                    <EventModal
                        isOpen={modal.open}
                        onClose={() => setModal({ open: false, date: null, hour: null, evt: null })}
                        onSave={onSave}
                        initDate={modal.date}
                        initHour={modal.hour}
                        existing={modal.evt}
                    />
                    {pop && (
                        <EventPop
                            event={pop.event}
                            pos={pop.pos}
                            onClose={() => setPop(null)}
                            onDelete={onDel}
                        />
                    )}
                </div>
            </div>
        </ThemeCtx.Provider>
    );
}
