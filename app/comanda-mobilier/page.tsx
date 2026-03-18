import type { Metadata } from "next";
import Image from "next/image";
import { InfoPanel } from "@/components/forms/info-panel";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { PageIntro } from "@/components/ui/page-intro";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { WhatsAppInlineLink } from "@/components/ui/whatsapp-inline-link";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Comanda mobilier la comanda | Artizan Lemn",
  description:
    "Trimite-ne descrierea proiectului tau, schite sau imagini de inspiratie. Realizam mobilier premium din lemn masiv, adaptat nevoilor si spatiului tau.",
  path: "/comanda-mobilier",
  image: "/images/hero/hero-main-table.png",
});

const processNotes = [
  {
    title: "De ce ajuta imaginile si schitele",
    text: "Referintele vizuale reduc timpul de clarificare si ne ajuta sa intelegem directia estetica pe care o doresti.",
  },
  {
    title: "Cum lucram dupa primirea cererii",
    text: "Analizam cererea in context, verificam fezabilitatea tehnica si revenim cu intrebari punctuale, acolo unde este nevoie.",
  },
  {
    title: "Ce se intampla dupa analiza",
    text: "Definim urmatorii pasi: discutie detaliata, recomandari de materiale si estimarea etapelor de executie.",
  },
];

const faqItems = [
  {
    question: "Este necesar sa am dimensiunile exacte?",
    answer:
      "Nu. Dimensiunile aproximative sunt suficiente pentru etapa initiala. Masuratorile finale se stabilesc in etapa de detaliere.",
  },
  {
    question: "Pot trimite doar imagini de inspiratie?",
    answer:
      "Da. Poti trimite imagini, link-uri sau schite simple. Le folosim ca punct de pornire in discutia de proiect.",
  },
  {
    question: "Cat dureaza analiza unei cereri?",
    answer:
      "In mod normal revenim in 1-2 zile lucratoare, in functie de complexitatea proiectului.",
  },
  {
    question: "Realizati si piese complet personalizate?",
    answer:
      "Da. Acesta este focusul nostru principal: piese din lemn masiv construite pe nevoile reale ale clientului.",
  },
];

export default function ComandaMobilierPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-sand-300/70 py-20 md:py-24">
        <Image
          src="/images/hero/hero-main-table.png"
          alt="Atelier Artizan Lemn - comanda mobilier"
          fill
          className="object-cover object-center opacity-15"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sand-50/98 via-sand-50/94 to-sand-50/86" />

        <div className="relative mx-auto w-full max-w-[1220px] px-6 md:px-10">
          <PageIntro
            eyebrow="Comanda mobilier"
            title="Comanda mobilier realizat pe masura ideii tale"
            description="Trimite-ne schita, imaginile de inspiratie sau descrierea proiectului tau. Analizam fiecare cerere individual si revenim cu o propunere potrivita."
          />
          <div className="mt-7">
            <WhatsAppInlineLink label="Trimite-ne rapid pe WhatsApp" />
          </div>
        </div>
      </section>

      <SectionWrapper containerClassName="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <InquiryForm />
        <InfoPanel />
      </SectionWrapper>

      <SectionWrapper tone="muted" containerClassName="space-y-8">
        <div className="space-y-2">
          <p className="editorial-kicker">Dupa trimiterea cererii</p>
          <h2 className="text-5xl">Cum continuam proiectul</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {processNotes.map((note) => (
            <article key={note.title} className="luxury-card p-6">
              <h3 className="text-3xl">{note.title}</h3>
              <p className="mt-3 text-sm text-wood-700">{note.text}</p>
            </article>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper containerClassName="space-y-8">
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
      </SectionWrapper>
    </>
  );
}
