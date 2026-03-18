"use client";

import { cn } from "@/lib/utils";

export type FilterTabOption = {
  value: string;
  label: string;
  count?: number;
};

type FilterTabsProps = {
  options: FilterTabOption[];
  activeValue: string;
  onChange: (value: string) => void;
};

export function FilterTabs({ options, activeValue, onChange }: FilterTabsProps) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max gap-2">
        {options.map((option) => {
          const active = option.value === activeValue;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-wood-900 bg-wood-900 text-sand-50"
                  : "border-sand-300 bg-white text-wood-700 hover:bg-sand-100",
              )}
            >
              {option.label}
              {option.count !== undefined ? (
                <span className={cn("ml-1.5 text-xs", active ? "text-sand-100" : "text-wood-700/80")}>
                  {option.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
