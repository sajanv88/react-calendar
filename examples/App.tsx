import { useState } from "react";
import Calendar from "../src/libs/components/Calendar";
import type { CalendarEvent } from "../src/libs/types";
import "../src/styles.css";
const sampleEvents: CalendarEvent[] = [
    {
        id: "1",
        title: "Team Meeting",
        description: "Weekly sync with the team",
        start: "2026-02-16T10:00:00",
        end: "2026-02-16T11:00:00",
        allDay: false,
        category: "work",
        isBookable: true,
        createdBy: { id: "user1", name: "John Doe" },
    },
    {
        id: "2",
        title: "Lunch Break",
        start: "2026-02-16T12:00:00",
        end: "2026-02-16T13:00:00",
        allDay: false,
        category: "personal",
        isBookable: false,
        createdBy: { id: "user1", name: "John Doe" },
    },
    {
        id: "3",
        title: "Project Review",
        description: "Q1 project milestone review",
        location: "Conference Room A",
        start: "2026-02-17T14:00:00",
        end: "2026-02-17T16:00:00",
        allDay: false,
        category: "work",
        isBookable: true,
        createdBy: { id: "user1", name: "John Doe" },
    },
    {
        id: "4",
        title: "Gym Session",
        start: "2026-02-18T18:00:00",
        end: "2026-02-18T19:30:00",
        allDay: false,
        category: "personal",
        isBookable: true,
        createdBy: { id: "user1", name: "John Doe" },
    },
    {
        id: "5",
        title: "Client Call",
        description: "Discuss new requirements",
        start: "2026-02-19T09:00:00",
        end: "2026-02-19T10:30:00",
        allDay: false,
        category: "work",
        isBookable: true,
        createdBy: { id: "user1", name: "John Doe" },
    },
    {
        id: "6",
        title: "All-Day Conference",
        description: "Tech conference downtown",
        start: "2026-02-20T00:00:00",
        end: "2026-02-20T23:59:59",
        allDay: true,
        category: "work",
        isBookable: false,
        createdBy: { id: "user2", name: "Jane Smith" },
    },
];
function App() {
    const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);

    const [theme, setTheme] = useState<"light" | "dark">("light");

    const handleEventAdd = (event: CalendarEvent) => {
        console.log("New event added:", event);
        setEvents((prev) => [...prev, event]);
    };

    return (
        <div className="h-screen bg-zinc-50 dark:bg-zinc-900">
            <div className="container mx-auto p-4 max-w-7xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                            React Calendar Example
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            A simple and reusable calendar component for React with event management
                        </p>
                    </div>

                </div>

                <div className="h-full bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700">
                    <div className="h-[600px]">
                        <Calendar
                            initialEvents={events}
                            holidays={["2026-12-25", "2026-01-01"]}
                            workHours={{ start: 9, end: 17 }}
                            onEventAdd={handleEventAdd}
                            theme={theme}
                        />
                    </div>
                </div>


            </div>
        </div>
    );
}

export default App;
