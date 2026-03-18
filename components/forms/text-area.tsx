import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const baseTextAreaStyles =
  "w-full rounded-2xl border border-sand-300 bg-white px-4 py-3 text-sm text-wood-900 outline-none transition-colors placeholder:text-wood-700/65 focus:border-wood-700 focus-visible:ring-2 focus-visible:ring-wood-700/20";

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          baseTextAreaStyles,
          hasError && "border-amber-700/70 bg-amber-50/35",
          className,
        )}
        {...props}
      />
    );
  },
);

TextArea.displayName = "TextArea";
