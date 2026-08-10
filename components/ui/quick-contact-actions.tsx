import { companyDetails } from "@/data/navigation";
import { createWhatsAppLinkToPhone } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type QuickContactActionsProps = {
  className?: string;
  buttonClassName?: string;
  whatsappMessage?: string;
  callLabel?: string;
  whatsappLabel?: string;
  emailLabel?: string;
  trackingLocation?: string;
};

function toTelHref(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

const baseButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-semibold transition-colors";

export function QuickContactActions({
  className,
  buttonClassName,
  whatsappMessage = "Buna! As dori o oferta pentru mobilier la comanda.",
  callLabel = "Suna in program",
  whatsappLabel = "Trimite pe WhatsApp",
  emailLabel = "Scrie pe email",
  trackingLocation = "quick_contact",
}: QuickContactActionsProps) {
  const primaryPhone = companyDetails.phones[0];
  const whatsappHref = createWhatsAppLinkToPhone(primaryPhone, whatsappMessage);

  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:flex-wrap", className)}>
      <a
        href={toTelHref(primaryPhone)}
        data-track-event="contact_click"
        data-track-label={callLabel}
        data-track-location={trackingLocation}
        data-track-type="phone"
        className={cn(
          baseButtonClassName,
          "border-wood-900 bg-wood-900 text-sand-50 hover:bg-wood-800",
          buttonClassName,
        )}
      >
        {callLabel}
      </a>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        data-track-event="contact_click"
        data-track-label={whatsappLabel}
        data-track-location={trackingLocation}
        data-track-type="whatsapp"
        className={cn(
          baseButtonClassName,
          "border-[#1f7a59]/45 bg-[#1f7a59]/10 text-[#164d39] hover:bg-[#1f7a59]/16",
          buttonClassName,
        )}
      >
        {whatsappLabel}
      </a>
      <a
        href={`mailto:${companyDetails.email}`}
        data-track-event="contact_click"
        data-track-label={emailLabel}
        data-track-location={trackingLocation}
        data-track-type="email"
        className={cn(
          baseButtonClassName,
          "border-wood-900/25 bg-white text-wood-900 hover:bg-sand-100",
          buttonClassName,
        )}
      >
        {emailLabel}
      </a>
    </div>
  );
}
