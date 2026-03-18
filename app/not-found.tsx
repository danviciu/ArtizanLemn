import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pagina nu a fost gasita",
  description:
    "Pagina cautata nu exista sau a fost mutata. Reveniti la sectiunile principale Artizan Lemn.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPage() {
  return (
    <section className="section-space">
      <div className="mx-auto w-full max-w-[760px] px-6 text-center md:px-10">
        <p className="editorial-kicker">Eroare 404</p>
        <h1 className="mt-3 text-5xl">Pagina nu a fost gasita</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-wood-700 md:text-base">
          Linkul accesat nu este disponibil. Poti reveni la homepage sau poti merge
          direct in catalogul de produse.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-wood-900 bg-wood-900 px-6 py-3 text-sm font-semibold text-sand-50 transition-colors hover:bg-wood-800 hover:border-wood-800"
          >
            Mergi la homepage
          </Link>
          <Link
            href="/produse"
            className="inline-flex items-center justify-center rounded-full border border-sand-400 bg-white px-6 py-3 text-sm font-semibold text-wood-900 transition-colors hover:bg-sand-100"
          >
            Vezi produsele
          </Link>
        </div>
      </div>
    </section>
  );
}
