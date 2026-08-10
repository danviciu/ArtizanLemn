import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InfoPanel } from "@/components/forms/info-panel";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { JsonLd } from "@/components/seo/json-ld";
import { PageIntro } from "@/components/ui/page-intro";
import { QuickContactActions } from "@/components/ui/quick-contact-actions";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import {
  createBreadcrumbJsonLd,
  createFaqJsonLd,
} from "@/lib/seo";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Comanda mobilier la comanda din lemn masiv",
  description:
    "Trimite cererea pentru mobilier la comanda din lemn masiv. Raspundem in 1-2 zile lucratoare si adaptam proiectul pe spatiul tau.",
  path: "/comanda-mobilier",
  image: "/images/hero/hero-main-table.png",
  keywords: [
    "mobilier la comanda",
    "mobilier premium din lemn masiv",
    "proiecte personalizate",
    "comanda mobilier",
    "paturi din lemn masiv",
    "mese din lemn",
    "biblioteci din lemn",
    "dulapuri de baie din lemn",
    "riflaje din lemn",
  ],
});

const topBenefits = [
  "Raspundem in 1-2 zile lucratoare",
  "Poti incarca schite sau imagini de inspiratie",
  "Adaptam proiectul la spatiul si stilul tau",
];

const focusLinks = [
  { label: "Mobilier la comanda", href: "/produse" },
  { label: "Paturi", href: "/categorii/paturi" },
  { label: "Mese", href: "/categorii/mese" },
  { label: "Biblioteci", href: "/categorii/biblioteci" },
  { label: "Dulapuri de baie", href: "/categorii/dulapuri-de-baie" },
  { label: "Riflaje", href: "/categorii/riflaje" },
  { label: "Piese personalizate", href: "/categorii/piese-personalizate" },
];

const faqItems = [
  {
    question: "Cat dureaza raspunsul?",
    answer:
      "Revenim in mod normal in 1-2 zile lucratoare. Pentru proiecte complexe, revenim initial cu intrebarile cheie si urmatorii pasi.",
  },
  {
    question: "Pot trimite doar o idee, fara schita tehnica?",
    answer:
      "Da. O descriere scurta, cateva poze si dimensiuni aproximative sunt suficiente pentru a porni discutia.",
  },
  {
    question: "Lucrati doar in Brasov?",
    answer:
      "Atelierul este in Prejmer, Brasov, dar preluam proiecte si in afara judetului, in functie de tipul lucrarii si logistica.",
  },
  {
    question: "Realizati si piese complet personalizate?",
    answer:
      "Da. Aceasta este directia principala Artizan Lemn: mobilier premium din lemn masiv, adaptat pe dimensiuni reale si cerinte specifice.",
  },
];

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: "Acasa", path: "/" },
  { name: "Comanda mobilier", path: "/comanda-mobilier" },
]);
const faqJsonLd = createFaqJsonLd(faqItems);

export default function ComandaMobilierPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

      <section className="relative isolate overflow-hidden border-b border-sand-300/70 py-20 md:py-24">
        <Image
          src="/images/hero/hero-main-table.png"
          alt="Atelier Artizan Lemn - comanda mobilier"
          fill
          className="object-cover object-center opacity-15"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sand-50/98 via-sand-50/94 to-sand-50/86" />

        <div className="relative mx-auto w-full max-w-[1220px] space-y-7 px-6 md:px-10">
          <PageIntro
            eyebrow="Landing pentru cereri"
            title="Comanda mobilier premium din lemn masiv, realizat pe proiectul tau"
            description="Trimite ideea, schita sau imaginile de inspiratie, iar noi iti propunem o solutie clara pentru mobilier la comanda, adaptata pe dimensiuni reale."
          />

          <p className="max-w-3xl text-sm text-wood-700 md:text-base">
            Procesul este simplu: ne trimiti contextul, discutam materialele si
            dimensiunile, apoi primesti solutia si oferta pentru proiect.
          </p>

          <div className="grid gap-2 text-sm text-wood-800 md:grid-cols-3">
            {topBenefits.map((benefit) => (
              <p
                key={benefit}
                className="rounded-xl border border-sand-300/80 bg-white px-4 py-3"
              >
                {benefit}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {focusLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-sand-300 bg-white px-3 py-1.5 text-xs font-medium text-wood-800 transition-colors hover:border-wood-900/30 hover:bg-sand-100"
                data-track-event="cta_click"
                data-track-label={item.label}
                data-track-location="comanda_top"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <QuickContactActions trackingLocation="comanda_top" />
        </div>
      </section>

      <SectionWrapper
        id="formular-comanda"
        containerClassName="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]"
      >
        <InquiryForm />
        <InfoPanel />
      </SectionWrapper>

      <SectionWrapper tone="muted" containerClassName="space-y-8">
        <div className="space-y-2">
          <p className="editorial-kicker">FAQ</p>
          <h2 className="text-5xl">Intrebari frecvente</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {faqItems.map((item) => (
            <article key={item.question} className="luxury-card p-6">
              <h3 className="text-3xl">{item.question}</h3>
              <p className="mt-3 text-sm text-wood-700">{item.answer}</p>
            </article>
          ))}
        </div>

        <div className="luxury-card border-wood-900/15 p-6 md:p-7">
          <p className="text-sm text-wood-700">
            Ai nevoie de raspuns rapid? Ne poti contacta direct telefonic,
            pe WhatsApp sau pe email.
          </p>
          <QuickContactActions className="mt-4" trackingLocation="comanda_faq" />
        </div>
      </SectionWrapper>
    </>
  );
}
