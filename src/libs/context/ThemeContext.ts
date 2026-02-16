import { createContext } from "react";
import type { ThemeMode } from "../types";

export const ThemeCtx = createContext<{ theme: ThemeMode; toggle: () => void }>({
    theme: "light",
    toggle: () => {},
});
