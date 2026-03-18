import Link from "next/link";
import { Container } from "@/components/ui/container";
import { BrandLogo } from "@/components/ui/brand-logo";
import { companyDetails, mainNavigation, socialLinks } from "@/data/navigation";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-sand-300/70 bg-sand-100/55">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.15fr_0.85fr_0.75fr]">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-4">
            <BrandLogo size="lg" className="h-16 w-16 sm:h-20 sm:w-20" />
            <div className="leading-tight">
              <h2 className="text-4xl">Artizan Lemn</h2>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-wood-700">
                mobilier premium la comanda
              </p>
            </div>
          </Link>
          <p className="max-w-md text-sm text-wood-700">
            Atelier de mobilier premium din lemn masiv, specializat in piese
            executate la comanda pentru interioare si exterioare cu identitate.
          </p>
          <div className="subtle-separator max-w-sm" />
          <p className="text-xs uppercase tracking-[0.2em] text-wood-700">
            ArtizanLemn.ro
          </p>
        </div>

        <div className="space-y-4">
          <p className="editorial-kicker">Link-uri rapide</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-wood-700 transition-colors hover:text-wood-950"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <p className="editorial-kicker">Contact</p>
            <ul className="space-y-1.5 text-sm text-wood-700">
              {companyDetails.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone}`}
                    className="transition-colors hover:text-moss-600"
                  >
                    {phone}
                  </a>
                </li>
              ))}
              <li>{companyDetails.email}</li>
              <li>{companyDetails.city}</li>
              <li>{companyDetails.schedule}</li>
            </ul>
          </div>

          {socialLinks.length ? (
            <div className="space-y-2">
              <p className="editorial-kicker">Social</p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-sand-400/70 px-3 py-1.5 text-xs font-medium text-wood-700 transition-colors hover:border-wood-700 hover:text-wood-950"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </Container>

      <div className="border-t border-sand-300/70 py-5">
        <Container className="flex flex-col items-start justify-between gap-2 text-xs text-wood-700 sm:flex-row sm:items-center">
          <p>(c) {year} Artizan Lemn. Toate drepturile rezervate.</p>
          <p>Mobilier premium din lemn masiv, realizat in atelier.</p>
        </Container>
      </div>
    </footer>
  );
}
