# @sajanv88/react-calendar

A beautiful, fully-featured calendar component for React with month, week, day, and year views.

## Installation

```bash
npm install @sajanv88/react-calendar
# or
pnpm add @sajanv88/react-calendar
```

## Usage

```tsx
import { Calendar } from "@sajanv88/react-calendar";
import "@sajanv88/react-calendar/style.css";

function App() {
  const events = [
    {
      id: "1",
      title: "Team Meeting",
      start: "2026-02-16T10:00:00",
      end: "2026-02-16T11:00:00",
      allDay: false,
      category: "work",
      isBookable: true,
      createdBy: { id: "user1", name: "John Doe" },
    },
  ];

  const handleEventAdd = (event) => {
    console.log("New event added:", event);
    // Handle event addition (e.g., save to database)
  };

  return (
    <div style={{ height: "100vh" }}>
      <Calendar
        initialEvents={events}
        holidays={["2026-12-25", "2026-01-01"]}
        workHours={{ start: 9, end: 17 }}
        theme="light"
        onEventAdd={handleEventAdd}
      />
    </div>
  );
}
```

**Important:** Wrap the Calendar in a container with a defined height (e.g., `100vh`, `600px`) for proper display and scrolling.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialEvents` | `CalendarEvent[]` | Sample events | Initial events to display |
| `holidays` | `string[]` | `[]` | ISO date strings for holidays (e.g., `['2026-12-25']`) |
| `workHours` | `{ start: number; end: number }` | `{ start: 9, end: 17 }` | Work hours range (24hr format) |
| `theme` | `"light" \| "dark"` | `"light"` | Initial theme mode |
| `onEventAdd` | `(event: CalendarEvent) => void` | - | Callback when an event is added |
| `enableThemeToggle` | `boolean` | `true` | Show/hide the theme toggle button |

## Features

- **4 Views** — Month, Week, Day, and Year
- **Event Management** — Add, view, and delete events
- **Categories** — Work, Personal, Holiday, Urgent with color coding
- **Dark Mode** — Built-in light/dark theme toggle
- **Responsive** — Mobile-friendly with automatic view adjustment
- **Holiday Support** — Highlight specific dates as holidays
- **Work Hours** — Visual distinction for working hours
- **Overlap Resolution** — Smart layout for overlapping events

## CalendarEvent Type

```typescript
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start: string; // ISO 8601 format (e.g., "2026-02-16T10:00:00")
  end: string; // ISO 8601 format
  allDay: boolean;
  category: "work" | "personal" | "holiday" | "urgent";
  color?: string; // Optional custom color
  isBookable: boolean;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  recurrence?: "none" | "daily" | "weekly" | "monthly";
}
```

## Advanced Usage

You can use the `useCalendar` hook directly for custom implementations:

```tsx
import { useCalendar } from "@sajanv88/react-calendar";

function MyCalendar() {
  const cal = useCalendar({
    initialEvents: [],
    holidays: ["2026-12-25"],
    workHours: { start: 9, end: 17 },
  });

  // Build your own UI using cal.monthGrid, cal.events, etc.
}
```

## Peer Dependencies

- `react` >= 18
- `react-dom` >= 18


## Contact
- [Email](work@sajankumarv.com)

## License

MIT
