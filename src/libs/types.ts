/** Category used to color-code and group calendar events. */
export type EventCategory = "work" | "personal" | "holiday" | "urgent";

/** How often an event repeats. `"none"` means it is a one-time event. */
export type Recurrence = "none" | "daily" | "weekly" | "monthly";

/** The calendar display mode. */
export type CalendarView = "month" | "week" | "day" | "year";

/** Appearance theme for the calendar. */
export type ThemeMode = "light" | "dark";

/**
 * A day of the week (lowercase).
 * Used with the `workWeek` prop to define which days are considered working days.
 */
export type WorkDay =
    | "sunday"
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday";

/** A single calendar event. */
export interface CalendarEvent {
    /** Unique identifier for the event. */
    id: string;
    /** Display title shown on the calendar. */
    title: string;
    /** Optional longer description shown in the event detail popover. */
    description?: string;
    /** Optional location text (e.g. "Room 4B", "Zoom link"). */
    location?: string;
    /** Start date/time as an ISO 8601 string (e.g. `"2026-03-15T09:00:00"`). */
    start: string;
    /** End date/time as an ISO 8601 string (e.g. `"2026-03-15T10:30:00"`). */
    end: string;
    /** When `true` the event spans the entire day and is shown in the all-day row. */
    allDay: boolean;
    /** Visual category that determines the event's color scheme. */
    category: EventCategory;
    /** Optional custom hex color that overrides the category color (e.g. `"#10b981"`). */
    color?: string;
    /** Whether the event slot is available for booking by other users. */
    isBookable: boolean;
    /** The user who created this event. */
    createdBy: { id: string; name: string; avatar?: string };
    /** How often the event recurs. Defaults to `"none"`. */
    recurrence?: Recurrence;
}

/**
 * Defines the daily work-hour window highlighted in day/week views.
 * Uses 24-hour format.
 *
 * @example
 * ```ts
 * const workHours: WorkHours = { start: 9, end: 17 }; // 9 AM – 5 PM
 * ```
 */
export interface WorkHours {
    /** Hour the work day starts (0–23). */
    start: number;
    /** Hour the work day ends (0–23). */
    end: number;
}

/** Props accepted by the `<Calendar />` component. */
export interface CalendarProps {
    /** Pre-populated events to display on the calendar. */
    initialEvents?: CalendarEvent[];
    /**
     * ISO date strings for days that should be marked as holidays.
     * @example `['2026-12-25', '2026-01-01']`
     */
    holidays?: string[];
    /**
     * The daily work-hour range highlighted in day and week views.
     * @default `{ start: 9, end: 17 }`
     */
    workHours?: WorkHours;
    /**
     * Days of the week considered as working days.
     * Non-work days are visually dimmed across all calendar views.
     * @default `['monday', 'tuesday', 'wednesday', 'thursday', 'friday']`
     * @example
     * ```tsx
     * // Six-day work week (Sunday off)
     * <Calendar workWeek={['monday','tuesday','wednesday','thursday','friday','saturday']} />
     * ```
     */
    workWeek?: WorkDay[];
    /**
     * Initial color theme.
     * @default `"light"`
     */
    theme?: ThemeMode;
    /** Callback fired after a new event is created via the modal. */
    onEventAdd?: (event: CalendarEvent) => void;
    /**
     * When `true`, a light/dark toggle button is shown in the header.
     * @default `false`
     */
    enableThemeToggle?: boolean;
    /**
     * When `false`, the delete button is hidden from the event popover.
     * @default `true`
     */
    allowDelete?: boolean;
    /**
     * Custom display labels for event categories.
     * Any category not specified falls back to its default name.
     * @example
     * ```tsx
     * <Calendar categoryLabels={{ work: "Office", personal: "Private", urgent: "High Priority" }} />
     * ```
     */
    categoryLabels?: Partial<Record<EventCategory, string>>;
    /**
     * When `false`, hides the "All day event" toggle from the event modal.
     * @default `true`
     */
    allowAllDay?: boolean;
}

/** An { x, y } screen coordinate used for popover positioning. */
export interface Position {
    x: number;
    y: number;
}

/** Resolved Tailwind class names for a given event category. */
export interface CategoryStyle {
    /** Background class. */
    bg: string;
    /** Border class. */
    bd: string;
    /** Text color class. */
    tx: string;
    /** Dot/indicator color class. */
    dot: string;
    /** Dark-mode text class. */
    dt: string;
    /** Raw hex color value for inline styles. */
    hex: string;
}

/** Computed CSS position for a single event in the time-grid layout. */
export interface LayoutResult {
    /** The event being positioned. */
    evt: CalendarEvent;
    /** CSS `top` in pixels. */
    top: number;
    /** CSS `height` in pixels. */
    height: number;
    /** Fractional column offset (0–1) for overlapping events. */
    left: number;
    /** Fractional column width (0–1) for overlapping events. */
    width: number;
}

/** Internal state for the event creation/edit modal. */
export interface ModalState {
    open: boolean;
    date: Date | null;
    hour: number | null;
    evt: CalendarEvent | null;
}

/** Internal state for the event detail popover. */
export interface PopoverState {
    event: CalendarEvent;
    pos: Position;
}

/**
 * Return type of the `useCalendar` hook.
 * Provides all state and helpers needed to render and control the calendar.
 */
export interface CalendarHook {
    /** Currently focused date (determines which month/week/day is displayed). */
    cur: Date;
    /** Set the focused date. */
    setCur: React.Dispatch<React.SetStateAction<Date>>;
    /** Active view mode. */
    view: CalendarView;
    /** Switch the view mode. */
    setView: React.Dispatch<React.SetStateAction<CalendarView>>;
    /** All calendar events. */
    events: CalendarEvent[];
    /** Add a new event. */
    addEvt: (evt: CalendarEvent) => void;
    /** Remove an event by its id. */
    rmEvt: (id: string) => void;
    /** Get all events (all-day + timed) that overlap a given date. */
    evtsForDay: (d: Date) => CalendarEvent[];
    /** Get only timed (non-all-day) events that overlap a given date. */
    timedForDay: (d: Date) => CalendarEvent[];
    /** Get only all-day events that overlap a given date. */
    allDayForDay: (d: Date) => CalendarEvent[];
    /** Check whether a date is a holiday. */
    isHol: (d: Date) => boolean;
    /** Check whether an hour falls within the configured work hours. */
    isWH: (h: number) => boolean;
    /** Check whether a date falls on a configured work day. */
    isWorkDay: (d: Date) => boolean;
    /** Navigate to today. */
    goToday: () => void;
    /** Navigate to the previous period (day/week/month/year depending on view). */
    goPrev: () => void;
    /** Navigate to the next period. */
    goNext: () => void;
    /** Formatted heading string for the current view (e.g. "March 2026"). */
    title: string;
    /** 2D array of dates representing the month grid (rows = weeks, cols = days). */
    monthGrid: Date[][];
    /** Array of 7 dates for the current week. */
    weekDays: Date[];
    /** Array of hours `[0, 1, 2, …, 23]` for rendering time grids. */
    hours: number[];
    /** `true` when the viewport is mobile-sized (< 640px). */
    mob: boolean;
    /** The active work-hours configuration. */
    workHours: WorkHours;
}
