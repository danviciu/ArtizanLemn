import Link from "next/link";
import { PrimaryButtonLink } from "@/components/ui/primary-button";
import { SecondaryButtonLink } from "@/components/ui/secondary-button";
import { SectionWrapper } from "@/components/ui/section-wrapper";

const focusLinks = [
  { label: "Paturi din lemn masiv", href: "/categorii/paturi" },
  { label: "Mese din lemn", href: "/categorii/mese" },
  { label: "Biblioteci din lemn", href: "/categorii/biblioteci" },
  { label: "Dulapuri de baie din lemn", href: "/categorii/dulapuri-de-baie" },
  { label: "Riflaje din lemn", href: "/categorii/riflaje" },
  { label: "Piese personalizate", href: "/categorii/piese-personalizate" },
];

export function SearchFocusSection() {
  return (
    <SectionWrapper className="border-b border-sand-300/70" containerClassName="space-y-6">
      <div className="space-y-3">
        <p className="editorial-kicker">Mobilier la comanda</p>
        <h2 className="text-5xl">
          Mobilier premium din lemn masiv pentru proiecte personalizate
        </h2>
        <p className="max-w-4xl text-sm text-wood-700 md:text-base">
          Lucram direct cu tine pentru a transforma ideea in mobilier la comanda,
          potrivit spatiului, stilului si modului tau real de folosire.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {focusLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-sand-300 bg-white px-3 py-1.5 text-xs font-medium text-wood-800 transition-colors hover:border-wood-900/30 hover:bg-sand-100"
            data-track-event="cta_click"
            data-track-label={item.label}
            data-track-location="home_search_focus"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <PrimaryButtonLink
          href="/comanda-mobilier"
          data-track-event="cta_click"
          data-track-label="Solicita oferta"
          data-track-location="home_search_focus"
        >
          Solicita oferta
        </PrimaryButtonLink>
        <SecondaryButtonLink
          href="/galerie"
          data-track-event="cta_click"
          data-track-label="Vezi lucrarile"
          data-track-location="home_search_focus"
        >
          Vezi lucrarile
        </SecondaryButtonLink>
      </div>
    </SectionWrapper>
  );
}
