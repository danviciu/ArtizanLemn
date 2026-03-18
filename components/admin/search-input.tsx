"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = "Cauta...",
  className,
}: SearchInputProps) {
  return (
    <label className={cn("relative block", className)}>
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-wood-700/70"
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-full border border-sand-300 bg-white pl-10 pr-4 text-sm text-wood-900 outline-none transition-colors placeholder:text-wood-700/65 focus:border-wood-700"
      />
    </label>
  );
}
