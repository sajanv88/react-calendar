import type React from "react";
import type { ReactNode } from "react";

export const iCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-zinc-400";

export const Fld: React.FC<{ label: string; children: ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-widest">
            {label}
        </label>
        {children}
    </div>
);
