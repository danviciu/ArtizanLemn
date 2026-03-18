"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/data/categories";
import {
  parseCommaSeparatedList,
  type AdminProductPayload,
} from "@/lib/validation/adminProductSchema";
import type { AdminProduct } from "@/types/admin";
import { Button } from "@/components/ui/button";

const inputClassName =
  "h-11 w-full rounded-xl border border-sand-300 bg-white px-3 text-sm text-wood-900 outline-none transition-colors placeholder:text-wood-700/65 focus:border-wood-700";
const textareaClassName =
  "w-full rounded-xl border border-sand-300 bg-white px-3 py-2.5 text-sm text-wood-900 outline-none transition-colors placeholder:text-wood-700/65 focus:border-wood-700";

type ProductFormProps = {
  initialData?: AdminProduct | null;
  mode?: "create" | "edit";
};

function resolveCategoryValue(rawValue?: string | null) {
  if (!rawValue) {
    return categories[0]?.slug ?? "paturi";
  }

  const trimmed = rawValue.trim();
  const bySlug = categories.find((item) => item.slug === trimmed);
  if (bySlug) {
    return bySlug.slug;
  }

  const byName = categories.find(
    (item) => item.name.toLowerCase() === trimmed.toLowerCase(),
  );

  return byName?.slug ?? categories[0]?.slug ?? "paturi";
}

type ProductMutationResponse = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  product?: { id: string };
};

export function ProductForm({ initialData, mode = "create" }: ProductFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categoryDefault = resolveCategoryValue(initialData?.category);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setIsSuccess(false);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);

    const payload: AdminProductPayload = {
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      category: String(formData.get("category") ?? ""),
      status: String(formData.get("status") ?? "draft") as AdminProductPayload["status"],
      shortDescription: String(formData.get("shortDescription") ?? ""),
      fullDescription: String(formData.get("fullDescription") ?? ""),
      featuredImage: String(formData.get("featuredImage") ?? ""),
      gallery: parseCommaSeparatedList(String(formData.get("gallery") ?? "")),
      tags: parseCommaSeparatedList(String(formData.get("tags") ?? "")),
      woodTypes: parseCommaSeparatedList(String(formData.get("woodTypes") ?? "")),
      finishes: parseCommaSeparatedList(String(formData.get("finishes") ?? "")),
      suitableFor: parseCommaSeparatedList(String(formData.get("suitableFor") ?? "")),
      isFeatured: formData.get("isFeatured") === "on",
    };

    const endpoint =
      mode === "create" ? "/api/admin/products" : `/api/admin/products/${initialData?.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let result: ProductMutationResponse | null = null;
      try {
        result = (await response.json()) as ProductMutationResponse;
      } catch {
        result = null;
      }

      if (!response.ok || !result?.success) {
        const fieldMessage = result?.fieldErrors
          ? Object.values(result.fieldErrors).flat()[0]
          : null;

        setErrorMessage(
          fieldMessage ||
            result?.message ||
            "Produsul nu a putut fi salvat momentan. Te rugam sa incerci din nou.",
        );
        return;
      }

      setIsSuccess(true);

      if (mode === "create" && result.product?.id) {
        router.replace(`/admin/produse/${result.product.id}/editeaza`);
      } else {
        router.refresh();
      }
    } catch {
      setErrorMessage(
        "Produsul nu a putut fi salvat momentan. Verifica conexiunea si incearca din nou.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="luxury-card space-y-6 p-6 md:p-7">
      <div className="space-y-1.5">
        <h2 className="text-4xl">
          {mode === "create" ? "Adauga produs" : "Editeaza produs"}
        </h2>
        <p className="text-sm text-wood-700">
          Datele sunt salvate in Supabase si pot fi folosite ulterior in fluxul public.
        </p>
      </div>

      {errorMessage ? (
        <p className="rounded-xl border border-red-300/70 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Titlu</span>
          <input
            defaultValue={initialData?.title}
            name="title"
            required
            className={inputClassName}
            placeholder="Ex: Masa Coman"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Slug</span>
          <input
            defaultValue={initialData?.slug}
            name="slug"
            required
            className={inputClassName}
            placeholder="ex: masa-coman"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Categorie</span>
          <select name="category" defaultValue={categoryDefault} className={inputClassName}>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Status</span>
          <select
            name="status"
            defaultValue={initialData?.status ?? "draft"}
            className={inputClassName}
          >
            <option value="activ">Activ</option>
            <option value="draft">Draft</option>
            <option value="arhivat">Arhivat</option>
          </select>
        </label>
      </div>

      <label className="space-y-1.5">
        <span className="text-sm font-medium text-wood-900">Descriere scurta</span>
        <textarea
          name="shortDescription"
          rows={3}
          defaultValue={initialData?.shortDescription}
          className={textareaClassName}
        />
      </label>

      <label className="space-y-1.5">
        <span className="text-sm font-medium text-wood-900">Descriere completa</span>
        <textarea
          name="fullDescription"
          rows={6}
          defaultValue={initialData?.fullDescription}
          className={textareaClassName}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Imagine principala</span>
          <input
            defaultValue={initialData?.featuredImage}
            name="featuredImage"
            className={inputClassName}
            placeholder="/images/produse/..."
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Galerie imagini</span>
          <input
            defaultValue={initialData?.gallery.join(", ")}
            name="gallery"
            className={inputClassName}
            placeholder="/images/..., /images/..."
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Etichete</span>
          <input
            defaultValue={initialData?.tags.join(", ")}
            name="tags"
            className={inputClassName}
            placeholder="lemn masiv, la comanda, executie premium"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Tipuri de lemn</span>
          <input
            defaultValue={initialData?.woodTypes.join(", ")}
            name="woodTypes"
            className={inputClassName}
            placeholder="Stejar, Frasin, Nuc"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Finisaje</span>
          <input
            defaultValue={initialData?.finishes.join(", ")}
            name="finishes"
            className={inputClassName}
            placeholder="Ulei mat, Lac satinat"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Potrivit pentru</span>
          <input
            defaultValue={initialData?.suitableFor.join(", ")}
            name="suitableFor"
            className={inputClassName}
            placeholder="Dining open-space, Proiecte premium"
          />
        </label>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-sand-300 bg-sand-100/55 px-4 py-3">
        <input
          type="checkbox"
          name="isFeatured"
          defaultChecked={Boolean(initialData?.isFeatured)}
          className="h-4 w-4 accent-wood-900"
        />
        <span className="text-sm text-wood-900">Marcheaza ca piesa recomandata</span>
      </label>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Salvam..." : "Salveaza"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/admin/produse")}>
          Inapoi la lista
        </Button>
      </div>

      {isSuccess ? (
        <p className="rounded-xl border border-moss-400/40 bg-moss-400/15 px-4 py-3 text-sm text-wood-900">
          {mode === "create"
            ? "Produsul a fost creat cu succes."
            : "Modificarile au fost salvate cu succes."}
        </p>
      ) : null}
    </form>
  );
}
