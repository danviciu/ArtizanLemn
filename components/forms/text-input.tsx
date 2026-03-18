import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const baseInputStyles =
  "w-full rounded-2xl border border-sand-300 bg-white px-4 py-3 text-sm text-wood-900 outline-none transition-colors placeholder:text-wood-700/65 focus:border-wood-700 focus-visible:ring-2 focus-visible:ring-wood-700/20";

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          baseInputStyles,
          hasError && "border-amber-700/70 bg-amber-50/35",
          className,
        )}
        {...props}
      />
    );
  },
);

TextInput.displayName = "TextInput";
