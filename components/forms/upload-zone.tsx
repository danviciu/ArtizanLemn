"use client";

import { useMemo, useRef, useState } from "react";
import { FileImage, FileText, Upload, X } from "lucide-react";
import type { InquiryAttachment } from "@/types/forms";
import { cn } from "@/lib/utils";

type UploadZoneProps = {
  attachments: InquiryAttachment[];
  onFilesAdded: (files: FileList | File[]) => void;
  onRemoveFile: (id: string) => void;
};

function formatSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadZone({
  attachments,
  onFilesAdded,
  onRemoveFile,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const helperText = useMemo(
    () =>
      attachments.length
        ? `${attachments.length} fisier(e) adaugat(e).`
        : "Poti adauga imagini, schite, PDF-uri sau documente suport.",
    [attachments.length],
  );

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (event.dataTransfer.files?.length) {
            onFilesAdded(event.dataTransfer.files);
          }
        }}
        className={cn(
          "cursor-pointer rounded-2xl border border-dashed border-sand-400 bg-sand-100/55 p-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wood-700/30",
          isDragging && "border-wood-700 bg-sand-100",
        )}
        aria-label="Zona de incarcare fisiere inspiratie"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          onChange={(event) => {
            if (event.target.files?.length) {
              onFilesAdded(event.target.files);
              event.target.value = "";
            }
          }}
        />

        <div className="flex items-start gap-4">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sand-300 bg-white text-wood-900">
            <Upload size={18} />
          </span>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-wood-900">
              Adauga inspiratie / schite / imagini
            </p>
            <p className="text-xs text-wood-700">
              Trage fisiere aici sau apasa pentru selectie.
            </p>
            <p className="text-xs text-wood-700/90">
              Formate acceptate: JPG, JPEG, PNG, WEBP, PDF.
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-wood-700">{helperText}</p>

      {attachments.length ? (
        <ul className="space-y-2">
          {attachments.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between rounded-xl border border-sand-300 bg-white px-3 py-2"
            >
              <div className="flex items-center gap-2 text-sm text-wood-800">
                {file.type.startsWith("image/") ? (
                  <FileImage size={16} className="text-wood-700" />
                ) : (
                  <FileText size={16} className="text-wood-700" />
                )}
                <span>{file.name}</span>
                <span className="text-xs text-wood-700/80">{formatSize(file.size)}</span>
              </div>

              <button
                type="button"
                onClick={() => onRemoveFile(file.id)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-wood-700 transition-colors hover:bg-sand-100 hover:text-wood-900"
                aria-label={`Elimina fisierul ${file.name}`}
              >
                <X size={15} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
