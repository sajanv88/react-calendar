export function startOfDay(d: Date): Date {
    const r = new Date(d);
    r.setHours(0, 0, 0, 0);
    return r;
}
export function endOfDay(d: Date): Date {
    const r = new Date(d);
    r.setHours(23, 59, 59, 999);
    return r;
}
export function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}
export function isSameMonth(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
export function isToday(d: Date): boolean {
    return isSameDay(d, new Date());
}
export function addDays(d: Date, n: number): Date {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
}
export function addMonths(d: Date, n: number): Date {
    const r = new Date(d);
    r.setMonth(r.getMonth() + n);
    return r;
}
export function addYears(d: Date, n: number): Date {
    const r = new Date(d);
    r.setFullYear(r.getFullYear() + n);
    return r;
}
export function startOfWeek(d: Date): Date {
    const r = new Date(d);
    r.setDate(r.getDate() - r.getDay());
    r.setHours(0, 0, 0, 0);
    return r;
}
export function endOfWeek(d: Date): Date {
    return addDays(startOfWeek(d), 6);
}
export function startOfMonth(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}
export function endOfMonth(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
export function fmtTime(h: number, m: number = 0): string {
    const hh = h % 12 || 12;
    const ap = h < 12 ? "AM" : "PM";
    return m > 0 ? `${hh}:${String(m).padStart(2, "0")} ${ap}` : `${hh} ${ap}`;
}
export function fmtH24(h: number): string {
    return `${String(h).padStart(2, "0")}:00`;
}
export function parseISO(s: string): Date {
    return new Date(s);
}
export function toISO(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function minsOfDay(d: Date): number {
    return d.getHours() * 60 + d.getMinutes();
}
