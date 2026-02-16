export type EventCategory = "work" | "personal" | "holiday" | "urgent";
export type Recurrence = "none" | "daily" | "weekly" | "monthly";
export type CalendarView = "month" | "week" | "day" | "year";
export type ThemeMode = "light" | "dark";

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    location?: string;
    start: string; // ISO 8601
    end: string; // ISO 8601
    allDay: boolean;
    category: EventCategory;
    color?: string;
    isBookable: boolean;
    createdBy: { id: string; name: string; avatar?: string };
    recurrence?: Recurrence;
}

export interface WorkHours {
    start: number; // 24hr, e.g. 9
    end: number; // 24hr, e.g. 17
}

export interface CalendarProps {
    initialEvents?: CalendarEvent[];
    holidays?: string[]; // ISO date strings e.g. ['2026-12-25']
    workHours?: WorkHours;
    theme?: ThemeMode;
    onEventAdd?: (event: CalendarEvent) => void;
    enableThemeToggle?: boolean;
}

export interface Position {
    x: number;
    y: number;
}

export interface CategoryStyle {
    bg: string;
    bd: string;
    tx: string;
    dot: string;
    dt: string;
    hex: string;
}

export interface LayoutResult {
    evt: CalendarEvent;
    top: number;
    height: number;
    left: number;
    width: number;
}

export interface ModalState {
    open: boolean;
    date: Date | null;
    hour: number | null;
    evt: CalendarEvent | null;
}

export interface PopoverState {
    event: CalendarEvent;
    pos: Position;
}

// Return type of useCalendar
export interface CalendarHook {
    cur: Date;
    setCur: React.Dispatch<React.SetStateAction<Date>>;
    view: CalendarView;
    setView: React.Dispatch<React.SetStateAction<CalendarView>>;
    events: CalendarEvent[];
    addEvt: (evt: CalendarEvent) => void;
    rmEvt: (id: string) => void;
    evtsForDay: (d: Date) => CalendarEvent[];
    timedForDay: (d: Date) => CalendarEvent[];
    allDayForDay: (d: Date) => CalendarEvent[];
    isHol: (d: Date) => boolean;
    isWH: (h: number) => boolean;
    goToday: () => void;
    goPrev: () => void;
    goNext: () => void;
    title: string;
    monthGrid: Date[][];
    weekDays: Date[];
    hours: number[];
    mob: boolean;
    workHours: WorkHours;
}
