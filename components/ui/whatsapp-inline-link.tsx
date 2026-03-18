import { createWhatsAppLink } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

type WhatsAppInlineLinkProps = {
  label?: string;
  message?: string;
  className?: string;
};

export function WhatsAppInlineLink({
  label = "Contact rapid pe WhatsApp",
  message,
  className,
}: WhatsAppInlineLinkProps) {
  return (
    <a
      href={createWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (se deschide într-un tab nou)`}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[#1f7a59]/35",
        "bg-[#1f7a59]/10 px-4 py-2.5 text-sm font-medium text-[#164d39]",
        "transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1f7a59]/16",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wood-700 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50",
        className,
      )}
    >
      <WhatsAppIcon className="h-4 w-4" />
      <span>{label}</span>
    </a>
  );
}
