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
            <div className={`rcal:h-full rcal:w-full ${theme === "dark" ? "dark" : ""}`}>
                <div
                    className="rcal:flex rcal:flex-col rcal:h-full rcal:w-full rcal:bg-white rcal:dark:bg-zinc-950 rcal:text-zinc-900 rcal:dark:text-zinc-100"
                    style={{ fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif" }}
                >
                    <style>{`
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
            @keyframes slideUp{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}
            @keyframes fadeIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
            *{scrollbar-width:thin;scrollbar-color:#a1a1aa20 transparent}.dark *{scrollbar-color:#52525b40 transparent}
          `}</style>

                    <header className="rcal:flex-shrink-0 rcal:border-b rcal:border-zinc-200 rcal:dark:border-zinc-800 rcal:bg-white rcal:dark:bg-zinc-950">
                        <div className="rcal:flex rcal:items-center rcal:justify-between rcal:px-3 rcal:sm:px-5 rcal:py-3 rcal:gap-2">
                            <div className="rcal:flex rcal:items-center rcal:gap-2.5 rcal:min-w-0">
                                <div className="rcal:hidden rcal:sm:flex rcal:items-center rcal:justify-center rcal:w-9 rcal:h-9 rcal:rounded-xl rcal:bg-blue-500 rcal:text-white rcal:shadow-lg rcal:shadow-blue-500/25 rcal:flex-shrink-0">
                                    <CalI />
                                </div>
                                <div className="rcal:min-w-0">
                                    <h1 className="rcal:text-sm rcal:sm:text-lg rcal:font-bold rcal:truncate rcal:tracking-tight">
                                        {cal.title}
                                    </h1>
                                </div>
                            </div>
                            <div className="rcal:flex rcal:items-center rcal:gap-1">
                                <button
                                    type="button"
                                    onClick={cal.goPrev}
                                    className="rcal:p-2 rcal:rounded-lg rcal:hover:bg-zinc-100 rcal:dark:hover:bg-zinc-800 rcal:text-zinc-500 rcal:hover:text-zinc-700 rcal:dark:text-zinc-400 rcal:dark:hover:text-zinc-200 rcal:transition-colors rcal:active:scale-95"
                                >
                                    <ChevL />
                                </button>
                                <button
                                    type="button"
                                    onClick={cal.goToday}
                                    className="rcal:px-3 rcal:py-1.5 rcal:rounded-lg rcal:text-xs rcal:font-semibold rcal:text-blue-600 rcal:dark:text-blue-400 rcal:bg-blue-50 rcal:dark:bg-blue-500/10 rcal:hover:bg-blue-100 rcal:dark:hover:bg-blue-500/20 rcal:transition-colors rcal:active:scale-95"
                                >
                                    Today
                                </button>
                                <button
                                    type="button"
                                    onClick={cal.goNext}
                                    className="rcal:p-2 rcal:rounded-lg rcal:hover:bg-zinc-100 rcal:dark:hover:bg-zinc-800 rcal:text-zinc-500 rcal:hover:text-zinc-700 rcal:dark:text-zinc-400 rcal:dark:hover:text-zinc-200 rcal:transition-colors rcal:active:scale-95"
                                >
                                    <ChevR />
                                </button>
                            </div>
                            <div className="rcal:flex rcal:items-center rcal:gap-1.5">
                                <div className="rcal:hidden rcal:sm:flex rcal:items-center rcal:bg-zinc-100 rcal:dark:bg-zinc-800/80 rcal:rounded-lg rcal:p-0.5">
                                    {vOpts.map((v) => (
                                        <button
                                            type="button"
                                            key={v.k}
                                            onClick={() => cal.setView(v.k)}
                                            className={`rcal:px-2.5 rcal:py-1.5 rcal:rounded-md rcal:text-[11px] rcal:font-semibold rcal:transition-all ${cal.view === v.k ? "rcal:bg-white rcal:dark:bg-zinc-700 rcal:text-zinc-900 rcal:dark:text-zinc-100 rcal:shadow-sm" : "rcal:text-zinc-500 rcal:dark:text-zinc-400 rcal:hover:text-zinc-700 rcal:dark:hover:text-zinc-300"}`}
                                        >
                                            {v.l}
                                        </button>
                                    ))}
                                </div>
                                {enableThemeToggle && (
                                    <button
                                        type="button"
                                        onClick={togTheme}
                                        className="rcal:p-2 rcal:rounded-lg rcal:hover:bg-zinc-100 rcal:dark:hover:bg-zinc-800 rcal:text-zinc-400 rcal:hover:text-zinc-600 rcal:dark:hover:text-zinc-300 rcal:transition-colors"
                                        title={theme === "light" ? "Dark mode" : "Light mode"}
                                    >
                                        {theme === "light" ? <MoonI /> : <SunI />}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => onCell(cal.cur)}
                                    className="rcal:flex rcal:items-center rcal:gap-1.5 rcal:px-3 rcal:py-2 rcal:rounded-lg rcal:text-xs rcal:font-semibold rcal:text-white rcal:bg-blue-500 rcal:hover:bg-blue-600 rcal:transition-colors rcal:shadow-lg rcal:shadow-blue-500/25 rcal:active:scale-95"
                                >
                                    <PlusI />
                                    <span className="rcal:hidden rcal:sm:inline">Event</span>
                                </button>
                            </div>
                        </div>
                        <div className="rcal:sm:hidden rcal:flex rcal:items-center rcal:gap-1 rcal:px-3 rcal:pb-2">
                            {vOpts.map((v) => (
                                <button
                                    type="button"
                                    key={v.k}
                                    onClick={() => cal.setView(v.k)}
                                    className={`rcal:flex-1 rcal:py-1.5 rcal:rounded-lg rcal:text-[11px] rcal:font-semibold rcal:transition-all ${cal.view === v.k ? "rcal:bg-zinc-100 rcal:dark:bg-zinc-800 rcal:text-zinc-900 rcal:dark:text-zinc-100" : "rcal:text-zinc-400 rcal:dark:text-zinc-500"}`}
                                >
                                    {v.l}
                                </button>
                            ))}
                        </div>
                    </header>

                    <main className="rcal:flex-1 rcal:min-h-0">
                        {cal.view === "month" && (
                            <MonthView cal={cal} onCell={(d) => onCell(d)} onEvt={onEvt} />
                        )}
                        {cal.view === "week" && (
                            <WeekView cal={cal} onCell={onCell} onEvt={onEvt} />
                        )}
                        {cal.view === "day" && <DayView cal={cal} onCell={onCell} onEvt={onEvt} />}
                        {cal.view === "year" && <YearView cal={cal} />}
                    </main>

                    <footer className="rcal:flex-shrink-0 rcal:border-t rcal:border-zinc-200 rcal:dark:border-zinc-800 rcal:bg-zinc-50/50 rcal:dark:bg-zinc-900/50 rcal:px-4 rcal:py-2">
                        <div className="rcal:flex rcal:items-center rcal:justify-between rcal:text-[10px] rcal:text-zinc-400 rcal:dark:text-zinc-500">
                            <div className="rcal:flex rcal:items-center rcal:gap-3 rcal:flex-wrap">
                                <span className="rcal:flex rcal:items-center rcal:gap-1">
                                    <span className="rcal:w-2 rcal:h-2 rcal:rounded-full rcal:bg-emerald-500" />
                                    Work
                                </span>
                                <span className="rcal:flex rcal:items-center rcal:gap-1">
                                    <span className="rcal:w-2 rcal:h-2 rcal:rounded-full rcal:bg-indigo-500" />
                                    Personal
                                </span>
                                <span className="rcal:flex rcal:items-center rcal:gap-1">
                                    <span className="rcal:w-2 rcal:h-2 rcal:rounded-full rcal:bg-rose-500" />
                                    Holiday
                                </span>
                                <span className="rcal:flex rcal:items-center rcal:gap-1">
                                    <span className="rcal:w-2 rcal:h-2 rcal:rounded-full rcal:bg-amber-500" />
                                    Urgent
                                </span>
                            </div>
                            <div className="rcal:hidden rcal:sm:flex rcal:items-center rcal:gap-2 rcal:font-medium">
                                <span className="rcal:w-3 rcal:h-2 rcal:rounded-sm rcal:bg-blue-100 rcal:dark:bg-blue-500/10 rcal:border rcal:border-blue-200 rcal:dark:border-blue-800" />
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
