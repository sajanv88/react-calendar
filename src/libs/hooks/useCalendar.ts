import { useCallback, useEffect, useMemo, useState } from "react";
import { DAYS_FULL, MONTHS, MONTHS_SHORT } from "../constants";
import type { CalendarEvent, CalendarHook, CalendarView, WorkHours } from "../types";
import {
    addDays,
    addMonths,
    addYears,
    endOfDay,
    endOfMonth,
    endOfWeek,
    parseISO,
    startOfDay,
    startOfMonth,
    startOfWeek,
    toISO,
} from "../utils/date";

export function useCalendar({
    initialEvents = [],
    holidays = [],
    workHours = { start: 9, end: 17 },
}: {
    initialEvents?: CalendarEvent[];
    holidays?: string[];
    workHours?: WorkHours;
}): CalendarHook {
    const [cur, setCur] = useState<Date>(new Date());
    const [view, setView] = useState<CalendarView>("month");
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
    const [mob, setMob] = useState(false);

    useEffect(() => {
        const c = () => setMob(window.innerWidth < 640);
        c();
        window.addEventListener("resize", c);
        return () => window.removeEventListener("resize", c);
    }, []);
    useEffect(() => {
        if (mob && view === "week") setView("day");
    }, [mob, view]);

    const holSet = useMemo(() => new Set(holidays.map((h) => h.slice(0, 10))), [holidays]);
    const isHol = useCallback((d: Date) => holSet.has(toISO(d)), [holSet]);
    const isWH = useCallback((h: number) => h >= workHours.start && h < workHours.end, [workHours]);

    const goToday = useCallback(() => setCur(new Date()), []);
    const goPrev = useCallback(() => {
        setCur((d) => {
            if (view === "month") return addMonths(d, -1);
            if (view === "week") return addDays(d, -7);
            if (view === "year") return addYears(d, -1);
            return addDays(d, -1);
        });
    }, [view]);
    const goNext = useCallback(() => {
        setCur((d) => {
            if (view === "month") return addMonths(d, 1);
            if (view === "week") return addDays(d, 7);
            if (view === "year") return addYears(d, 1);
            return addDays(d, 1);
        });
    }, [view]);

    const addEvt = useCallback(
        (evt: CalendarEvent) =>
            setEvents((p) => [...p, { ...evt, id: evt.id || `evt-${Date.now()}` }]),
        []
    );
    const rmEvt = useCallback((id: string) => setEvents((p) => p.filter((e) => e.id !== id)), []);

    const evtsForDay = useCallback(
        (d: Date) => {
            const ds = startOfDay(d),
                de = endOfDay(d);
            return events.filter((e) => {
                const es = parseISO(e.start),
                    ee = parseISO(e.end);
                return es <= de && ee >= ds;
            });
        },
        [events]
    );

    const timedForDay = useCallback(
        (d: Date) => {
            const ds = startOfDay(d),
                de = endOfDay(d);
            return events.filter((e) => {
                if (e.allDay) return false;
                const es = parseISO(e.start),
                    ee = parseISO(e.end);
                return es <= de && ee >= ds;
            });
        },
        [events]
    );

    const allDayForDay = useCallback(
        (d: Date) => {
            const ds = startOfDay(d),
                de = endOfDay(d);
            return events.filter((e) => {
                if (!e.allDay) return false;
                const es = parseISO(e.start),
                    ee = parseISO(e.end);
                return es <= de && ee >= ds;
            });
        },
        [events]
    );

    const title = useMemo(() => {
        if (view === "year") return `${cur.getFullYear()}`;
        if (view === "month") return `${MONTHS[cur.getMonth()]} ${cur.getFullYear()}`;
        if (view === "week") {
            const ws = startOfWeek(cur),
                we = endOfWeek(cur);
            if (ws.getMonth() === we.getMonth())
                return `${MONTHS[ws.getMonth()]} ${ws.getDate()} – ${we.getDate()}, ${ws.getFullYear()}`;
            return `${MONTHS_SHORT[ws.getMonth()]} ${ws.getDate()} – ${MONTHS_SHORT[we.getMonth()]} ${we.getDate()}, ${ws.getFullYear()}`;
        }
        return `${DAYS_FULL[cur.getDay()]}, ${MONTHS[cur.getMonth()]} ${cur.getDate()}, ${cur.getFullYear()}`;
    }, [cur, view]);

    const monthGrid = useMemo(() => {
        const first = startOfMonth(cur),
            gs = startOfWeek(first),
            last = endOfMonth(cur);
        const wks: Date[][] = [];
        let d = gs;
        for (let w = 0; w < 6; w++) {
            const wk: Date[] = [];
            for (let i = 0; i < 7; i++) {
                wk.push(new Date(d));
                d = addDays(d, 1);
            }
            wks.push(wk);
            if (d > last && d.getDay() === 0) break;
        }
        return wks;
    }, [cur]);

    const weekDays = useMemo(() => {
        const ws = startOfWeek(cur);
        return Array.from({ length: 7 }, (_, i) => addDays(ws, i));
    }, [cur]);
    const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

    return {
        cur,
        setCur,
        view,
        setView,
        events,
        addEvt,
        rmEvt,
        evtsForDay,
        timedForDay,
        allDayForDay,
        isHol,
        isWH,
        goToday,
        goPrev,
        goNext,
        title,
        monthGrid,
        weekDays,
        hours,
        mob,
        workHours,
    };
}
