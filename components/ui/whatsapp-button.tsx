"use client";

import { usePathname } from "next/navigation";
import { createWhatsAppLink } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

export function WhatsAppButton() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-[65] md:bottom-6 md:right-6"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <a
        href={createWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Scrie-ne pe WhatsApp (se deschide într-un tab nou)"
        className={cn(
          "group inline-flex items-center gap-2 rounded-full border border-white/40",
          "bg-[linear-gradient(140deg,#1a5d45_0%,#1f7a59_100%)] px-3 py-3 text-sand-50",
          "shadow-[0_20px_34px_-24px_rgba(9,36,27,0.95)] transition-all duration-300",
          "hover:-translate-y-0.5 hover:shadow-[0_24px_42px_-24px_rgba(9,36,27,0.98)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wood-700 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50",
        )}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white md:h-9 md:w-9">
          <WhatsAppIcon className="h-[18px] w-[18px] text-[#1f7a59] md:h-5 md:w-5" />
        </span>
        <span className="hidden pr-1 text-sm font-medium tracking-[0.01em] md:inline">
          Scrie-ne
        </span>
      </a>
    </div>
  );
}
