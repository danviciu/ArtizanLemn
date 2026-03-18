"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } finally {
      router.replace("/admin-login");
      router.refresh();
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="inline-flex items-center justify-center rounded-full border border-sand-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-wood-700 transition hover:border-wood-700 hover:text-wood-950 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? "Iesire..." : "Logout"}
    </button>
  );
}
