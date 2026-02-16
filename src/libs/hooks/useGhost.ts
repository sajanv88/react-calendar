import type React from "react";
import { useCallback, useRef } from "react";

export function useGhost(onTap: (day: Date, hour: number) => void) {
    const ref = useRef<{ x: number; y: number; t: number } | null>(null);
    const dn = useCallback((e: React.PointerEvent) => {
        ref.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    }, []);
    const up = useCallback(
        (day: Date, hour: number, e: React.PointerEvent) => {
            if (!ref.current) return;
            const dx = Math.abs(e.clientX - ref.current.x),
                dy = Math.abs(e.clientY - ref.current.y),
                dt = Date.now() - ref.current.t;
            if (dx < 8 && dy < 8 && dt < 350) onTap(day, hour);
            ref.current = null;
        },
        [onTap]
    );
    return { dn, up };
}
