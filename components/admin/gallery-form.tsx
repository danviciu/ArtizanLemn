"use client";

import { useState } from "react";
import type { AdminGalleryProject } from "@/types/admin";
import { Button } from "@/components/ui/button";

const inputClassName =
  "h-11 w-full rounded-xl border border-sand-300 bg-white px-3 text-sm text-wood-900 outline-none transition-colors placeholder:text-wood-700/65 focus:border-wood-700";
const textareaClassName =
  "w-full rounded-xl border border-sand-300 bg-white px-3 py-2.5 text-sm text-wood-900 outline-none transition-colors placeholder:text-wood-700/65 focus:border-wood-700";

type GalleryFormProps = {
  initialData?: AdminGalleryProject | null;
  mode?: "create" | "edit";
};

export function GalleryForm({ initialData, mode = "create" }: GalleryFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setIsSuccess(false);
    await new Promise((resolve) => setTimeout(resolve, 850));
    setIsSaving(false);
    setIsSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit} className="luxury-card space-y-6 p-6 md:p-7">
      <div className="space-y-1.5">
        <h2 className="text-4xl">
          {mode === "create" ? "Adauga proiect galerie" : "Editeaza proiect galerie"}
        </h2>
        <p className="text-sm text-wood-700">
          Formular placeholder pregatit pentru CRUD cu Supabase.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Titlu</span>
          <input
            defaultValue={initialData?.title}
            name="title"
            required
            className={inputClassName}
            placeholder="Ex: Foisor premium pentru gradina"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Slug</span>
          <input
            defaultValue={initialData?.slug}
            name="slug"
            required
            className={inputClassName}
            placeholder="ex: foisor-premium-gradina"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Categorie</span>
          <input
            defaultValue={initialData?.category}
            name="category"
            className={inputClassName}
            placeholder="Ex: Piese personalizate"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Status</span>
          <select
            name="status"
            defaultValue={initialData?.status ?? "draft"}
            className={inputClassName}
          >
            <option value="draft">Draft</option>
            <option value="publicat">Publicat</option>
            <option value="arhivat">Arhivat</option>
          </select>
        </label>
      </div>

      <label className="space-y-1.5">
        <span className="text-sm font-medium text-wood-900">Imagine coperta</span>
        <input
          defaultValue={initialData?.coverImage}
          name="coverImage"
          className={inputClassName}
          placeholder="/images/galerie/..."
        />
      </label>

      <label className="space-y-1.5">
        <span className="text-sm font-medium text-wood-900">Galerie imagini</span>
        <input
          defaultValue={initialData?.galleryImages.join(", ")}
          name="galleryImages"
          className={inputClassName}
          placeholder="/images/..., /images/..."
        />
      </label>

      <label className="space-y-1.5">
        <span className="text-sm font-medium text-wood-900">Rezumat</span>
        <textarea
          defaultValue={initialData?.summary}
          name="summary"
          rows={3}
          className={textareaClassName}
        />
      </label>

      <label className="space-y-1.5">
        <span className="text-sm font-medium text-wood-900">Poveste completa</span>
        <textarea
          defaultValue={initialData?.story}
          name="story"
          rows={6}
          className={textareaClassName}
        />
      </label>

      <label className="inline-flex items-center gap-2 text-sm text-wood-900">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={initialData?.featured}
          className="h-4 w-4 rounded border-sand-400 text-wood-900"
        />
        Proiect featured
      </label>

      <div className="rounded-2xl border border-dashed border-sand-400 bg-sand-100/65 p-4">
        <p className="text-xs text-wood-700">
          Uploadul fisierelor va fi gestionat prin Supabase Storage.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Salvam..." : "Salveaza proiectul"}
        </Button>
        <Button type="button" variant="secondary">
          Anuleaza
        </Button>
      </div>

      {isSuccess ? (
        <p className="rounded-xl border border-moss-400/40 bg-moss-400/15 px-4 py-3 text-sm text-wood-900">
          Actualizarea a fost simulata local. Persistenta va fi conectata la backend.
        </p>
      ) : null}
    </form>
  );
}
