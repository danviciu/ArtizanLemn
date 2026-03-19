"use client";

import { OPEN_COOKIE_SETTINGS_EVENT } from "@/lib/cookie-consent";
import { cn } from "@/lib/utils";

type CookiePreferencesButtonProps = {
  className?: string;
};

export function CookiePreferencesButton({
  className,
}: CookiePreferencesButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
      className={cn(
        "underline decoration-wood-600/50 underline-offset-2 transition-colors hover:text-wood-950",
        className,
      )}
    >
      Preferinte cookie
    </button>
  );
}
