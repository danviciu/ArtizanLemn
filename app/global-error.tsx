"use client";

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  console.error("Global app error", error);

  return (
    <html lang="ro">
      <body className="bg-sand-50 text-wood-950 antialiased">
        <section className="section-space min-h-screen">
          <div className="mx-auto w-full max-w-[760px] px-6 text-center md:px-10">
            <p className="editorial-kicker">Eroare critica</p>
            <h1 className="mt-3 text-5xl">Aplicatia a intampinat o eroare</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-wood-700 md:text-base">
              Incearca o reincarcare a paginii. Daca problema persista, contacteaza
              echipa pentru verificare.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 inline-flex items-center justify-center rounded-full border border-wood-900 bg-wood-900 px-6 py-3 text-sm font-semibold text-sand-50 transition-colors hover:bg-wood-800 hover:border-wood-800"
            >
              Incearca din nou
            </button>
          </div>
        </section>
      </body>
    </html>
  );
}
