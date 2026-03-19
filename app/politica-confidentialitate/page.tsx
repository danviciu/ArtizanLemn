import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { legalProfile } from "@/data/legal";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Politica de confidentialitate",
  description:
    "Informatii despre modul in care Artizan Lemn prelucreaza datele cu caracter personal.",
  path: "/politica-confidentialitate",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Politica de confidentialitate"
        description="Aceasta pagina explica ce date colectam, de ce le folosim si ce drepturi ai conform GDPR."
      />

      <section className="section-space pb-16 md:pb-24">
        <Container className="space-y-6">
          <article className="luxury-card space-y-4 p-6 md:p-8">
            <h2 className="text-3xl">1. Operatorul de date</h2>
            <p className="text-sm text-wood-700">
              Operator: {legalProfile.operatorName}
              <br />
              Sediu: {legalProfile.registeredOffice}
              <br />
              Email: {legalProfile.contactEmail}
              <br />
              Telefon: {legalProfile.contactPhone}
              <br />
              CUI: {legalProfile.cui}
              <br />
              Nr. Registrul Comertului: {legalProfile.tradeRegisterNumber}
            </p>
          </article>

          <article className="luxury-card space-y-4 p-6 md:p-8">
            <h2 className="text-3xl">2. Ce date prelucram</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-wood-700">
              <li>Date de identificare si contact trimise prin formulare.</li>
              <li>Informatii despre proiect (detalii comanda, atasamente).</li>
              <li>Date tehnice minime despre utilizarea site-ului (doar cu consimtamant pentru analitice).</li>
            </ul>
          </article>

          <article className="luxury-card space-y-4 p-6 md:p-8">
            <h2 className="text-3xl">3. Temeiuri legale</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-wood-700">
              <li>Executarea demersurilor precontractuale la cererea ta.</li>
              <li>Obligatii legale (contabile, fiscale, arhivare unde este cazul).</li>
              <li>Interes legitim pentru securitatea site-ului si prevenirea abuzurilor.</li>
              <li>Consimtamant pentru cookie-uri analitice.</li>
            </ul>
          </article>

          <article className="luxury-card space-y-4 p-6 md:p-8">
            <h2 className="text-3xl">4. Destinatari si transferuri</h2>
            <p className="text-sm text-wood-700">
              Putem utiliza furnizori tehnici pentru hosting, email sau analiza
              trafic. Cand furnizorii se afla in afara SEE, transferul se face
              in baza mecanismelor legale aplicabile (de exemplu clauze
              contractuale standard).
            </p>
          </article>

          <article className="luxury-card space-y-4 p-6 md:p-8">
            <h2 className="text-3xl">5. Perioada de stocare</h2>
            <p className="text-sm text-wood-700">
              Pastram datele doar cat este necesar pentru scopurile declarate
              sau conform cerintelor legale. Datele de contact din cereri se
              sterg ori se anonimizeaza cand nu mai sunt necesare.
            </p>
          </article>

          <article className="luxury-card space-y-4 p-6 md:p-8">
            <h2 className="text-3xl">6. Drepturile tale</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-wood-700">
              <li>Drept de acces, rectificare, stergere.</li>
              <li>Drept la restrictionare si opozitie.</li>
              <li>Drept la portabilitatea datelor.</li>
              <li>Drept de retragere a consimtamantului.</li>
              <li>Drept de a depune plangere la ANSPDCP.</li>
            </ul>
          </article>

          <article className="luxury-card space-y-4 p-6 md:p-8">
            <h2 className="text-3xl">7. Contact pentru solicitari GDPR</h2>
            <p className="text-sm text-wood-700">
              Pentru orice solicitare privind datele personale, scrie-ne la{" "}
              <a
                href={`mailto:${legalProfile.contactEmail}`}
                className="font-medium text-wood-900 underline underline-offset-2"
              >
                {legalProfile.contactEmail}
              </a>
              .
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
