"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type AdminLoginFormProps = {
  nextPath: string;
  configError: string | null;
};

type LoginResponse = {
  success: boolean;
  message?: string;
  redirectTo?: string;
};

export function AdminLoginForm({ nextPath, configError }: AdminLoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDisabled = Boolean(configError) || isSubmitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          next: nextPath,
        }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok || !data.success) {
        setError(data.message ?? "Autentificarea a esuat.");
        return;
      }

      const redirectTo = data.redirectTo ?? "/admin";
      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError("A aparut o eroare de retea. Incearca din nou.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="luxury-card mx-auto w-full max-w-md space-y-4 p-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wood-700">
          Acces securizat
        </p>
        <h1 className="text-4xl text-wood-950">Autentificare admin</h1>
        <p className="text-sm text-wood-700">
          Introdu credentialele pentru a intra in panoul intern Artizan Lemn.
        </p>
      </div>

      {configError ? (
        <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {configError}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-wood-800">Utilizator</span>
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          required
          disabled={isDisabled}
          className="w-full rounded-xl border border-sand-300 bg-white px-3 py-2 text-sm text-wood-900 outline-none ring-moss-300 transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-wood-800">Parola</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          disabled={isDisabled}
          className="w-full rounded-xl border border-sand-300 bg-white px-3 py-2 text-sm text-wood-900 outline-none ring-moss-300 transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>

      <button
        type="submit"
        disabled={isDisabled}
        className="inline-flex w-full items-center justify-center rounded-full bg-wood-950 px-5 py-2.5 text-sm font-semibold text-sand-50 transition hover:bg-wood-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Se verifica..." : "Intra in admin"}
      </button>
    </form>
  );
}
