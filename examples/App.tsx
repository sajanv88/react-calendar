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


    const handleEventAdd = (event: CalendarEvent) => {
        console.log("New event added:", event);
        setEvents((prev) => [...prev, event]);
    };

    return (
        <div className="rcal:h-screen rcal:bg-zinc-50 rcal:dark:bg-zinc-900">
            <div className="rcal:container rcal:mx-auto rcal:p-4 rcal:max-w-7xl">
                <div className="rcal:mb-6 rcal:flex rcal:items-center rcal:justify-between">
                    <div>
                        <h1 className="rcal:text-3xl rcal:font-bold rcal:text-zinc-900 rcal:dark:text-zinc-100 rcal:mb-2">
                            React Calendar Example
                        </h1>
                        <p className="rcal:text-zinc-600 rcal:dark:text-zinc-400">
                            A simple and reusable calendar component for React with event management
                        </p>
                    </div>

                </div>

                <div className="rcal:h-full rcal:bg-white rcal:dark:bg-zinc-800 rcal:rounded-xl rcal:shadow-lg rcal:border rcal:border-zinc-200 rcal:dark:border-zinc-700">
                    <div className="rcal:h-[600px]">
                        <Calendar
                            initialEvents={events}
                            holidays={["2026-12-25", "2026-01-01"]}
                            workHours={{ start: 9, end: 17 }}
                            onEventAdd={handleEventAdd}
                        />
                    </div>
                </div>


            </div>
        </div>
    );
}

export default App;
