import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { disputeResolutionLinks, legalProfile } from "@/data/legal";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Termeni si conditii",
  description:
    "Termeni de utilizare ai site-ului Artizan Lemn, informatii comerciale si mecanisme de solutionare a disputelor.",
  path: "/termeni-si-conditii",
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Termeni si conditii"
        description="Conditiile de utilizare a site-ului si cadrul comercial pentru solicitarile transmise catre Artizan Lemn."
      />

      <section className="section-space pb-16 md:pb-24">
        <Container className="space-y-6">
          <article className="luxury-card space-y-4 p-6 md:p-8">
            <h2 className="text-3xl">1. Date comerciale</h2>
            <p className="text-sm text-wood-700">
              Denumire operator: {legalProfile.operatorName}
              <br />
              Sediu: {legalProfile.registeredOffice}
              <br />
              CUI: {legalProfile.cui}
              <br />
              Nr. Registrul Comertului: {legalProfile.tradeRegisterNumber}
              <br />
              Email: {legalProfile.contactEmail}
              <br />
              Telefon: {legalProfile.contactPhone}
            </p>
          </article>

          <article className="luxury-card space-y-4 p-6 md:p-8">
            <h2 className="text-3xl">2. Obiectul site-ului</h2>
            <p className="text-sm text-wood-700">
              Site-ul prezinta servicii si produse de mobilier la comanda.
              Transmiterea unei cereri prin formulare nu reprezinta acceptarea
              automata a unei comenzi, ci initierea discutiei comerciale.
            </p>
          </article>

          <article className="luxury-card space-y-4 p-6 md:p-8">
            <h2 className="text-3xl">3. Oferte si comenzi</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-wood-700">
              <li>Oferta se comunica individual, in functie de cerinte.</li>
              <li>Termenele si costurile finale sunt stabilite contractual.</li>
              <li>
                Imaginile si descrierile au caracter orientativ si pot exista
                variatii de executie specifice materialelor naturale.
              </li>
            </ul>
          </article>

          <article className="luxury-card space-y-4 p-6 md:p-8">
            <h2 className="text-3xl">4. Proprietate intelectuala</h2>
            <p className="text-sm text-wood-700">
              Continutul site-ului (texte, imagini, elemente grafice, brand) nu
              poate fi copiat, publicat sau reutilizat fara acordul prealabil al
              titularului drepturilor.
            </p>
          </article>

          <article className="luxury-card space-y-4 p-6 md:p-8">
            <h2 className="text-3xl">5. Limitarea raspunderii</h2>
            <p className="text-sm text-wood-700">
              Depunem eforturi pentru acuratetea informatiilor, dar nu garantam
              absenta absoluta a erorilor tehnice sau tipografice. Ne rezervam
              dreptul de a actualiza continutul fara notificare prealabila.
            </p>
          </article>

          <article className="luxury-card space-y-4 p-6 md:p-8">
            <h2 className="text-3xl">6. Litigii si solutionare alternativa</h2>
            <p className="text-sm text-wood-700">
              Litigiile se solutioneaza amiabil, iar in lipsa unui acord pot fi
              adresate instantelor competente din Romania. Pentru solutionare
              alternativa poti folosi platformele oficiale:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-wood-700">
              <li>
                <a
                  href={disputeResolutionLinks.salAnpc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-wood-900 underline underline-offset-2"
                >
                  SAL ANPC
                </a>
              </li>
              <li>
                <a
                  href={disputeResolutionLinks.consumerRedressEu}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-wood-900 underline underline-offset-2"
                >
                  Consumer Redress in the EU
                </a>
              </li>
            </ul>
            <p className="text-sm text-wood-700">
              Nota: platforma ODR a UE a fost inchisa la 20 iulie 2025, conform
              informarii oficiale a Comisiei Europene.
            </p>
            <a
              href={disputeResolutionLinks.odrClosureNotice}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-wood-900 underline underline-offset-2"
            >
              Vezi anuntul oficial
            </a>
          </article>

          <article className="luxury-card space-y-4 p-6 md:p-8">
            <h2 className="text-3xl">7. Actualizari</h2>
            <p className="text-sm text-wood-700">
              Acesti termeni pot fi modificati periodic pentru conformitate
              legala si actualizarea serviciilor oferite.
            </p>
            <p className="text-xs text-wood-700">
              Ultima actualizare: {legalProfile.lastUpdated}
            </p>
          </article>
        </Container>
      </section>
    </>
  );
}
