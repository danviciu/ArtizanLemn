"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

const fieldClassName =
  "w-full rounded-2xl border border-sand-300 bg-white px-4 py-3 text-sm text-wood-900 outline-none transition-colors placeholder:text-wood-700/65 focus:border-wood-700";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);
    setSubmissionError(null);

    const form = event.currentTarget;
    const rawData = new FormData(form);
    const payload = new FormData();

    payload.append("nume", String(rawData.get("nume") ?? ""));
    payload.append("telefon", String(rawData.get("telefon") ?? ""));
    payload.append("email", String(rawData.get("email") ?? ""));
    payload.append("titluProiect", "Mesaj din pagina Contact");
    payload.append("descriereDetaliata", String(rawData.get("mesaj") ?? ""));
    payload.append("dimensiuniAproximative", "");
    payload.append("spatiulFolosire", "");
    payload.append("bugetOrientativ", "");
    payload.append("termenDorit", "");
    payload.append("observatiiSuplimentare", "");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        body: payload,
      });

      const body = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;

      if (!response.ok || !body?.success) {
        setSubmissionError(
          body?.message ||
            "Mesajul nu a putut fi trimis momentan. Te rugam sa incerci din nou.",
        );
        return;
      }

      form.reset();
      setIsSuccess(true);
    } catch {
      setSubmissionError(
        "Mesajul nu a putut fi trimis momentan. Te rugam sa incerci din nou.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="luxury-card space-y-4 p-7">
      <h2 className="text-3xl">Trimite-ne un mesaj</h2>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-wood-900">Nume</span>
        <input className={fieldClassName} name="nume" type="text" required />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-wood-900">Email</span>
        <input className={fieldClassName} name="email" type="email" required />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-wood-900">Telefon</span>
        <input
          className={fieldClassName}
          name="telefon"
          type="tel"
          minLength={8}
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-wood-900">Mesaj</span>
        <textarea
          className={`${fieldClassName} min-h-36 resize-y`}
          name="mesaj"
          minLength={30}
          required
        />
      </label>

      <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
        {isSubmitting ? "Trimitem..." : "Trimite mesajul"}
      </Button>

      {submissionError ? (
        <p className="rounded-xl border border-red-200/80 bg-red-50/85 px-4 py-3 text-sm text-red-700">
          {submissionError}
        </p>
      ) : null}

      {isSuccess ? (
        <p className="rounded-xl border border-moss-400/40 bg-moss-400/15 px-4 py-3 text-sm text-wood-900">
          Mesajul a fost inregistrat. Revenim catre tine in cel mai scurt timp.
        </p>
      ) : null}
    </form>
  );
}
