import { HOUR_H } from "../constants";
import type { CalendarEvent, LayoutResult } from "../types";
import { minsOfDay, parseISO } from "./date";

export function layoutEvts(events: CalendarEvent[]): LayoutResult[] {
    if (!events.length) return [];
    const sorted = [...events].sort(
        (a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime()
    );
    const groups: CalendarEvent[][] = [];
    let cg = [sorted[0]],
        ce = parseISO(sorted[0].end);
    for (let i = 1; i < sorted.length; i++) {
        const s = parseISO(sorted[i].start);
        if (s < ce) {
            cg.push(sorted[i]);
            const e = parseISO(sorted[i].end);
            if (e > ce) ce = e;
        } else {
            groups.push(cg);
            cg = [sorted[i]];
            ce = parseISO(sorted[i].end);
        }
    }
    groups.push(cg);
    const res: LayoutResult[] = [];
    for (const gr of groups) {
        const cols: CalendarEvent[][] = [];
        for (const evt of gr) {
            const es = parseISO(evt.start);
            let placed = false;
            for (let c = 0; c < cols.length; c++) {
                if (es >= parseISO(cols[c][cols[c].length - 1].end)) {
                    cols[c].push(evt);
                    placed = true;
                    break;
                }
            }
            if (!placed) cols.push([evt]);
        }
        const nc = cols.length;
        for (const [ci, col] of cols.entries()) {
            for (const evt of col) {
                const es = parseISO(evt.start),
                    ee = parseISO(evt.end);
                const tM = minsOfDay(es),
                    bM = minsOfDay(ee);
                res.push({
                    evt,
                    top: (tM / 60) * HOUR_H,
                    height: ((bM - tM) / 60) * HOUR_H,
                    left: ci / nc,
                    width: 1 / nc,
                });
            }
        }
    }
    return res;
}
