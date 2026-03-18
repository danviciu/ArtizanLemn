"use client";

import { useState } from "react";
import type { AdminBlogPost } from "@/types/admin";
import { Button } from "@/components/ui/button";

const inputClassName =
  "h-11 w-full rounded-xl border border-sand-300 bg-white px-3 text-sm text-wood-900 outline-none transition-colors placeholder:text-wood-700/65 focus:border-wood-700";
const textareaClassName =
  "w-full rounded-xl border border-sand-300 bg-white px-3 py-2.5 text-sm text-wood-900 outline-none transition-colors placeholder:text-wood-700/65 focus:border-wood-700";

type BlogFormProps = {
  initialData?: AdminBlogPost | null;
  mode?: "create" | "edit";
};

export function BlogForm({ initialData, mode = "create" }: BlogFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setIsSuccess(false);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    setIsSuccess(true);
  }

  return (
    <form onSubmit={handleSubmit} className="luxury-card space-y-6 p-6 md:p-7">
      <div className="space-y-1.5">
        <h2 className="text-4xl">
          {mode === "create" ? "Adauga articol blog" : "Editeaza articol blog"}
        </h2>
        <p className="text-sm text-wood-700">
          Structura este pregatita pentru salvare reala in Supabase.
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
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Slug</span>
          <input
            defaultValue={initialData?.slug}
            name="slug"
            required
            className={inputClassName}
          />
        </label>
      </div>

      <label className="space-y-1.5">
        <span className="text-sm font-medium text-wood-900">Excerpt</span>
        <textarea
          defaultValue={initialData?.excerpt}
          name="excerpt"
          rows={3}
          className={textareaClassName}
        />
      </label>

      <label className="space-y-1.5">
        <span className="text-sm font-medium text-wood-900">Content</span>
        <textarea
          defaultValue={initialData?.content}
          name="content"
          rows={10}
          className={textareaClassName}
        />
      </label>

      <label className="space-y-1.5">
        <span className="text-sm font-medium text-wood-900">Cover image</span>
        <input
          defaultValue={initialData?.coverImage}
          name="coverImage"
          className={inputClassName}
          placeholder="/images/..."
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">SEO title</span>
          <input
            defaultValue={initialData?.seoTitle}
            name="seoTitle"
            className={inputClassName}
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">SEO description</span>
          <textarea
            defaultValue={initialData?.seoDescription}
            name="seoDescription"
            rows={3}
            className={textareaClassName}
          />
        </label>
      </div>

      <label className="space-y-1.5">
        <span className="text-sm font-medium text-wood-900">Status</span>
        <select
          name="status"
          defaultValue={initialData?.status ?? "draft"}
          className={inputClassName}
        >
          <option value="draft">Draft</option>
          <option value="in_review">In review</option>
          <option value="publicat">Publicat</option>
          <option value="arhivat">Arhivat</option>
        </select>
      </label>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Salvam..." : "Salveaza articolul"}
        </Button>
        <Button type="button" variant="secondary">
          Anuleaza
        </Button>
      </div>

      {isSuccess ? (
        <p className="rounded-xl border border-moss-400/40 bg-moss-400/15 px-4 py-3 text-sm text-wood-900">
          Actiunea a fost simulata local. Persistenta va fi conectata ulterior.
        </p>
      ) : null}
    </form>
  );
}
