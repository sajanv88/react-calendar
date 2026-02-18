import React, { useCallback, useEffect, useState } from "react";
import { CAT_STYLES } from "../styles/categoryStyles";
import { Fld, iCls } from "../styles/formStyles";
import type { CalendarEvent, EventCategory } from "../types";
import { parseISO, toISO } from "../utils/date";
import { XBtn } from "./icons";

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (evt: CalendarEvent) => void;
    initDate: Date | null;
    initHour: number | null;
    existing: CalendarEvent | null;
}

export const EventModal = React.memo(function EventModal({
    isOpen,
    onClose,
    onSave,
    initDate,
    initHour,
    existing,
}: EventModalProps) {
    const [t, sT] = useState("");
    const [desc, sD] = useState("");
    const [loc, sL] = useState("");
    const [cat, sC] = useState<EventCategory>("work");
    const [date, sDate] = useState("");
    const [st, sSt] = useState("09:00");
    const [et, sEt] = useState("10:00");
    const [ad, sAd] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        if (existing) {
            const es = parseISO(existing.start),
                ee = parseISO(existing.end);
            sT(existing.title || "");
            sD(existing.description || "");
            sL(existing.location || "");
            sC(existing.category || "work");
            sDate(toISO(es));
            sAd(existing.allDay || false);
            sSt(
                `${String(es.getHours()).padStart(2, "0")}:${String(es.getMinutes()).padStart(2, "0")}`
            );
            sEt(
                `${String(ee.getHours()).padStart(2, "0")}:${String(ee.getMinutes()).padStart(2, "0")}`
            );
        } else {
            const d = initDate || new Date();
            const h = initHour != null ? initHour : 9;
            sT("");
            sD("");
            sL("");
            sC("work");
            sDate(toISO(d));
            sAd(false);
            sSt(`${String(h).padStart(2, "0")}:00`);
            sEt(`${String(Math.min(h + 1, 23)).padStart(2, "0")}:00`);
        }
    }, [isOpen, initDate, initHour, existing]);

    useEffect(() => {
        if (!isOpen) return;
        const fn = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", fn);
        return () => document.removeEventListener("keydown", fn);
    }, [isOpen, onClose]);

    const submit = useCallback(() => {
        if (!t.trim()) return;
        const sI = ad ? `${date}T00:00:00` : `${date}T${st}:00`;
        const eI = ad ? `${date}T23:59:59` : `${date}T${et}:00`;
        onSave({
            id: existing?.id || `evt-${Date.now()}`,
            title: t.trim(),
            description: desc.trim(),
            location: loc.trim(),
            start: sI,
            end: eI,
            allDay: ad,
            category: cat,
            color: CAT_STYLES[cat]?.hex || "#3b82f6",
            isBookable: true,
            createdBy: { id: "u-1", name: "You" },
        });
        onClose();
    }, [t, desc, loc, cat, date, st, et, ad, onSave, onClose, existing]);

    if (!isOpen) return null;
    return (
        <div
            className="rcal:fixed rcal:inset-0 rcal:z-50 rcal:flex rcal:items-end rcal:sm:items-center rcal:justify-center"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="rcal:absolute rcal:inset-0 rcal:bg-black/40 rcal:backdrop-blur-sm" />
            <div
                className="rcal:relative rcal:w-full rcal:sm:max-w-lg rcal:bg-white rcal:dark:bg-zinc-900 rcal:rounded-t-2xl rcal:sm:rounded-2xl rcal:shadow-2xl rcal:max-h-[92vh] rcal:overflow-y-auto"
                style={{ animation: "slideUp .25s cubic-bezier(.16,1,.3,1)" }}
            >
                <div className="rcal:flex rcal:items-center rcal:justify-between rcal:px-5 rcal:py-4 rcal:border-b rcal:border-zinc-200 rcal:dark:border-zinc-700/60">
                    <h2 className="rcal:text-lg rcal:font-semibold rcal:text-zinc-900 rcal:dark:text-zinc-100">
                        {existing ? "Edit Event" : "New Event"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rcal:p-1.5 rcal:rounded-lg rcal:hover:bg-zinc-100 rcal:dark:hover:bg-zinc-800 rcal:text-zinc-400 rcal:hover:text-zinc-600 rcal:dark:hover:text-zinc-300 rcal:transition-colors"
                    >
                        <XBtn />
                    </button>
                </div>
                <div className="rcal:px-5 rcal:py-4 rcal:space-y-4">
                    <Fld label="Title">
                        <input
                            type="text"
                            value={t}
                            onChange={(e) => sT(e.target.value)}
                            placeholder="Event title…"
                            className={iCls}
                        />
                    </Fld>
                    <Fld label="Category">
                        <div className="rcal:grid rcal:grid-cols-4 rcal:gap-2">
                            {(["work", "personal", "holiday", "urgent"] as EventCategory[]).map(
                                (c2) => {
                                    const cc = CAT_STYLES[c2];
                                    return (
                                        <button
                                            type="button"
                                            key={c2}
                                            onClick={() => sC(c2)}
                                            className={`rcal:px-3 rcal:py-2 rcal:rounded-xl rcal:text-xs rcal:font-medium rcal:capitalize rcal:transition-all rcal:border-2 ${cat === c2 ? `${cc.bg} ${cc.bd} ${cc.tx} ${cc.dt}` : "rcal:border-transparent rcal:bg-zinc-100 rcal:dark:bg-zinc-800 rcal:text-zinc-500 rcal:dark:text-zinc-400 rcal:hover:bg-zinc-200 rcal:dark:hover:bg-zinc-700"}`}
                                        >
                                            {c2}
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </Fld>
                    <Fld label="Date">
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => sDate(e.target.value)}
                            className={iCls}
                        />
                    </Fld>
                    <label className="rcal:flex rcal:items-center rcal:gap-3 rcal:cursor-pointer rcal:select-none">
                        <div
                            className={`rcal:relative rcal:w-10 rcal:h-6 rcal:rounded-full rcal:transition-colors ${ad ? "rcal:bg-blue-500" : "rcal:bg-zinc-300 rcal:dark:bg-zinc-600"}`}
                            onClick={() => sAd(!ad)}
                        >
                            <div
                                className={`rcal:absolute rcal:top-0.5 rcal:w-5 rcal:h-5 rcal:bg-white rcal:rounded-full rcal:shadow-md rcal:transition-transform ${ad ? "rcal:translate-x-[18px]" : "rcal:translate-x-0.5"}`}
                            />
                        </div>
                        <span className="rcal:text-sm rcal:text-zinc-600 rcal:dark:text-zinc-300">
                            All day event
                        </span>
                    </label>
                    {!ad && (
                        <div className="rcal:grid rcal:grid-cols-2 rcal:gap-3">
                            <Fld label="Start">
                                <input
                                    type="time"
                                    value={st}
                                    onChange={(e) => sSt(e.target.value)}
                                    className={iCls}
                                />
                            </Fld>
                            <Fld label="End">
                                <input
                                    type="time"
                                    value={et}
                                    onChange={(e) => sEt(e.target.value)}
                                    className={iCls}
                                />
                            </Fld>
                        </div>
                    )}
                    <Fld label="Description">
                        <textarea
                            value={desc}
                            onChange={(e) => sD(e.target.value)}
                            placeholder="Add details…"
                            rows={2}
                            className={`${iCls} resize-none`}
                        />
                    </Fld>
                    <Fld label="Location">
                        <input
                            type="text"
                            value={loc}
                            onChange={(e) => sL(e.target.value)}
                            placeholder="Add location…"
                            className={iCls}
                        />
                    </Fld>
                </div>
                <div className="rcal:flex rcal:gap-3 rcal:px-5 rcal:py-4 rcal:border-t rcal:border-zinc-200 rcal:dark:border-zinc-700/60">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rcal:flex-1 rcal:px-4 rcal:py-2.5 rcal:rounded-xl rcal:text-sm rcal:font-medium rcal:text-zinc-600 rcal:dark:text-zinc-300 rcal:bg-zinc-100 rcal:dark:bg-zinc-800 rcal:hover:bg-zinc-200 rcal:dark:hover:bg-zinc-700 rcal:transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={!t.trim()}
                        className="rcal:flex-1 rcal:px-4 rcal:py-2.5 rcal:rounded-xl rcal:text-sm rcal:font-medium rcal:text-white rcal:bg-blue-500 rcal:hover:bg-blue-600 rcal:disabled:opacity-40 rcal:disabled:cursor-not-allowed rcal:transition-colors rcal:shadow-lg rcal:shadow-blue-500/25"
                    >
                        {existing ? "Update" : "Create Event"}
                    </button>
                </div>
            </div>
        </div>
    );
});
