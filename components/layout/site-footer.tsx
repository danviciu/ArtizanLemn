import Image from "next/image";
import Link from "next/link";
import { CookiePreferencesButton } from "@/components/legal/cookie-preferences-button";
import { Container } from "@/components/ui/container";
import { BrandLogo } from "@/components/ui/brand-logo";
import { disputeResolutionLinks } from "@/data/legal";
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
          <div className="space-y-2 pt-2">
            <p className="editorial-kicker">Legal</p>
            <div className="flex flex-col gap-2">
              <Link
                href="/termeni-si-conditii"
                className="text-sm text-wood-700 transition-colors hover:text-wood-950"
              >
                Termeni si conditii
              </Link>
              <Link
                href="/politica-confidentialitate"
                className="text-sm text-wood-700 transition-colors hover:text-wood-950"
              >
                Politica de confidentialitate
              </Link>
              <Link
                href="/politica-cookies"
                className="text-sm text-wood-700 transition-colors hover:text-wood-950"
              >
                Politica de cookies
              </Link>
            </div>
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

          <div className="space-y-2">
            <p className="editorial-kicker">Litigii consumatori</p>
            <p className="text-xs text-wood-700">
              Poti folosi mecanismele oficiale SAL si SOL pentru solutionarea
              disputelor.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={disputeResolutionLinks.salAnpc}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl border border-sand-400/70 bg-white p-1 transition-colors hover:border-wood-700"
                aria-label="SAL ANPC"
              >
                <Image
                  src={disputeResolutionLinks.salBadgeImage}
                  alt="SAL ANPC"
                  width={215}
                  height={51}
                  className="h-auto w-[180px]"
                />
              </a>
              <a
                href={disputeResolutionLinks.odrClosureNotice}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl border border-sand-400/70 bg-white p-1 transition-colors hover:border-wood-700"
                aria-label="SOL"
              >
                <Image
                  src={disputeResolutionLinks.solBadgeImage}
                  alt="SOL"
                  width={250}
                  height={91}
                  className="h-auto w-[180px]"
                />
              </a>
            </div>
          </div>
        </div>
      </Container>

      <div className="border-t border-sand-300/70 py-5">
        <Container className="flex flex-col items-start justify-between gap-2 text-xs text-wood-700 sm:flex-row sm:items-center sm:gap-4">
          <p>(c) {year} Artizan Lemn. Toate drepturile rezervate.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p>Mobilier premium din lemn masiv, realizat in atelier.</p>
            <CookiePreferencesButton />
          </div>
        </Container>
      </div>
    </footer>
  );
}
