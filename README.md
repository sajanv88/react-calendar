# React-Calendar

A beautiful, fully-featured calendar component for React with month, week, day, and year views.

![Demo](demo.gif)

## Installation

```bash
npm install @sajankumarv88/react-calendar
# or
pnpm add @sajankumarv88/react-calendar
```

## Usage

```tsx
import { Calendar } from "@sajankumarv88/react-calendar";
import "@sajankumarv88/react-calendar/style.css";

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
        workWeek={["monday", "tuesday", "wednesday", "thursday", "friday"]}
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
| `workWeek` | `WorkDay[]` | `['monday', …, 'friday']` | Days considered as working days. Non-work days are visually dimmed. |
| `theme` | `"light" \| "dark"` | `"light"` | Initial theme mode |
| `onEventAdd` | `(event: CalendarEvent) => void` | - | Callback when an event is added |
| `enableThemeToggle` | `boolean` | `true` | Show/hide the theme toggle button |
| `allowDelete` | `boolean` | `true` | When `false`, hides the delete button from the event popover. |
| `categoryLabels` | `Partial<Record<EventCategory, string>>` | - | Custom display labels for categories (e.g., `{ work: "Office" }`). |
| `allowAllDay` | `boolean` | `true` | When `false`, hides the "All day event" toggle from the event modal. |

## Features

- **4 Views** — Month, Week, Day, and Year
- **Event Management** — Add, view, and delete events
- **Categories** — Work, Personal, Holiday, Urgent with color coding
- **Dark Mode** — Built-in light/dark theme toggle
- **Responsive** — Mobile-friendly with automatic view adjustment
- **Holiday Support** — Highlight specific dates as holidays
- **Work Hours** — Visual distinction for working hours
- **Work Week** — Define custom work days (e.g., Sun–Thu) with non-work days dimmed
- **Custom Category Labels** — Rename categories to match your domain
- **Delete Control** — Optionally hide the delete button to prevent event removal
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

## Work Week

The `workWeek` prop lets you define which days of the week are working days. Non-work days are visually dimmed across all views (month, week, day, year). Accepts an array of lowercase day names.

```tsx
type WorkDay = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
```

**Standard Mon–Fri (default):**
```tsx
<Calendar workWeek={["monday", "tuesday", "wednesday", "thursday", "friday"]} />
```

**Sun–Thu (Middle East):**
```tsx
<Calendar workWeek={["sunday", "monday", "tuesday", "wednesday", "thursday"]} />
```

**Six-day work week:**
```tsx
<Calendar workWeek={["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]} />
```

## Category Labels

Rename the built-in categories to match your domain using the `categoryLabels` prop. Labels appear in both the event modal and the event detail popover.

```tsx
<Calendar
  categoryLabels={{
    work: "Office",
    personal: "Private",
    holiday: "Day Off",
    urgent: "High Priority",
  }}
/>
```

Only the categories you specify are renamed — the rest keep their default names.

## Disable Event Deletion

Set `allowDelete={false}` to hide the delete button from the event detail popover.

```tsx
<Calendar allowDelete={false} />
```

## Advanced Usage

You can use the `useCalendar` hook directly for custom implementations:

```tsx
import { useCalendar } from "@sajankumarv88/react-calendar";

function MyCalendar() {
  const cal = useCalendar({
    initialEvents: [],
    holidays: ["2026-12-25"],
    workHours: { start: 9, end: 17 },
    workWeek: ["monday", "tuesday", "wednesday", "thursday", "friday"],
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
