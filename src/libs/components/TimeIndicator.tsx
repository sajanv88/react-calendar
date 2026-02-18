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
        <div
            className="rcal:absolute rcal:left-0 rcal:right-0 rcal:z-30 rcal:pointer-events-none"
            style={{ top }}
        >
            <div className="rcal:relative rcal:flex rcal:items-center">
                <div className="rcal:w-2.5 rcal:h-2.5 rcal:rounded-full rcal:bg-red-500 rcal:-ml-1 rcal:flex-shrink-0 rcal:shadow-sm rcal:shadow-red-500/40" />
                <div className="rcal:flex-1 rcal:h-[2px] rcal:bg-red-500 rcal:shadow-sm rcal:shadow-red-500/30" />
            </div>
        </div>
    );
}
