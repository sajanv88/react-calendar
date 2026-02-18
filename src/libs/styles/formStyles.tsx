import type React from "react";
import type { ReactNode } from "react";

export const iCls =
    "rcal:w-full rcal:px-3.5 rcal:py-2.5 rcal:rounded-xl rcal:border rcal:border-zinc-200 rcal:dark:border-zinc-700 rcal:bg-zinc-50 rcal:dark:bg-zinc-800 rcal:text-zinc-900 rcal:dark:text-zinc-100 rcal:text-sm rcal:focus:outline-none rcal:focus:ring-2 rcal:focus:ring-blue-500/40 rcal:focus:border-blue-500 rcal:transition-all rcal:placeholder:text-zinc-400";

export const Fld: React.FC<{ label: string; children: ReactNode }> = ({ label, children }) => (
    <div>
        <label className="rcal:block rcal:text-[10px] rcal:font-semibold rcal:text-zinc-400 rcal:dark:text-zinc-500 rcal:mb-1.5 rcal:uppercase rcal:tracking-widest">
            {label}
        </label>
        {children}
    </div>
);
