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
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
                className="relative w-full sm:max-w-lg bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
                style={{ animation: "slideUp .25s cubic-bezier(.16,1,.3,1)" }}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-700/60">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {existing ? "Edit Event" : "New Event"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                        <XBtn />
                    </button>
                </div>
                <div className="px-5 py-4 space-y-4">
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
                        <div className="grid grid-cols-4 gap-2">
                            {(["work", "personal", "holiday", "urgent"] as EventCategory[]).map(
                                (c2) => {
                                    const cc = CAT_STYLES[c2];
                                    return (
                                        <button
                                            type="button"
                                            key={c2}
                                            onClick={() => sC(c2)}
                                            className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all border-2 ${cat === c2 ? `${cc.bg} ${cc.bd} ${cc.tx} ${cc.dt}` : "border-transparent bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`}
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
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <div
                            className={`relative w-10 h-6 rounded-full transition-colors ${ad ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-600"}`}
                            onClick={() => sAd(!ad)}
                        >
                            <div
                                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${ad ? "translate-x-[18px]" : "translate-x-0.5"}`}
                            />
                        </div>
                        <span className="text-sm text-zinc-600 dark:text-zinc-300">
                            All day event
                        </span>
                    </label>
                    {!ad && (
                        <div className="grid grid-cols-2 gap-3">
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
                <div className="flex gap-3 px-5 py-4 border-t border-zinc-200 dark:border-zinc-700/60">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={!t.trim()}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/25"
                    >
                        {existing ? "Update" : "Create Event"}
                    </button>
                </div>
            </div>
        </div>
    );
});
