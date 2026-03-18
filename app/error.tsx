"use client";

import { useEffect } from "react";
import Link from "next/link";

type RootErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootErrorPage({ error, reset }: RootErrorPageProps) {
  useEffect(() => {
    console.error("Root route error", error);
  }, [error]);

  return (
    <section className="section-space">
      <div className="mx-auto w-full max-w-[760px] px-6 text-center md:px-10">
        <p className="editorial-kicker">Eroare</p>
        <h1 className="mt-3 text-5xl">A aparut o problema neasteptata</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-wood-700 md:text-base">
          Pagina nu a putut fi incarcata complet. Poti incerca din nou sau poti
          reveni la homepage.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full border border-wood-900 bg-wood-900 px-6 py-3 text-sm font-semibold text-sand-50 transition-colors hover:bg-wood-800 hover:border-wood-800"
          >
            Incearca din nou
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-sand-400 bg-white px-6 py-3 text-sm font-semibold text-wood-900 transition-colors hover:bg-sand-100"
          >
            Mergi la homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
