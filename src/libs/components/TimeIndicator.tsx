import type React from "react";
import { useEffect, useState } from "react";
import { HOUR_H } from "../constants";
import { minsOfDay } from "../utils/date";

export function TimeNow(): React.ReactElement {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(id);
    }, []);
    const top = (minsOfDay(now) / 60) * HOUR_H;
    return (
        <div className="absolute left-0 right-0 z-30 pointer-events-none" style={{ top }}>
            <div className="relative flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1 flex-shrink-0 shadow-sm shadow-red-500/40" />
                <div className="flex-1 h-[2px] bg-red-500 shadow-sm shadow-red-500/30" />
            </div>
        </div>
    );
}
