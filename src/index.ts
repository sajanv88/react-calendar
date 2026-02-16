// Styles
import "./styles.css";

// Main component
export { default as Calendar } from "./libs/components/Calendar";
// Context
export { ThemeCtx } from "./libs/context/ThemeContext";

// Hooks (for advanced usage)
export { useCalendar } from "./libs/hooks/useCalendar";
// Types
export type {
    CalendarEvent,
    CalendarHook,
    CalendarProps,
    CalendarView,
    EventCategory,
    Recurrence,
    ThemeMode,
    WorkHours,
} from "./libs/types";
