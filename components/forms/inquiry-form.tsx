"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/forms/form-field";
import { FormSection } from "@/components/forms/form-section";
import { SubmitButton } from "@/components/forms/submit-button";
import { SuccessState } from "@/components/forms/success-state";
import { TextArea } from "@/components/forms/text-area";
import { TextInput } from "@/components/forms/text-input";
import { UploadZone } from "@/components/forms/upload-zone";
import {
  InquirySubmissionError,
  submitInquiry,
} from "@/lib/actions/submitInquiry";
import {
  inquiryUploadConstraints,
  inquirySchema,
  type InquirySchemaValues,
  validateInquiryAttachments,
} from "@/lib/validation/inquirySchema";
import type { InquiryAttachment } from "@/types/forms";

const defaultValues: InquirySchemaValues = {
  nume: "",
  telefon: "",
  email: "",
  titluProiect: "",
  descriereDetaliata: "",
  dimensiuniAproximative: "",
  spatiulFolosire: "",
  bugetOrientativ: "",
  termenDorit: "",
  observatiiSuplimentare: "",
};

function createAttachment(file: File): InquiryAttachment {
  return {
    id: typeof crypto !== "undefined" ? crypto.randomUUID() : `${Date.now()}-${file.name}`,
    file,
    name: file.name,
    size: file.size,
    type: file.type,
  };
}

export function InquiryForm() {
  const [attachments, setAttachments] = useState<InquiryAttachment[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InquirySchemaValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues,
    mode: "onBlur",
  });

  function validateAttachments(nextAttachments: InquiryAttachment[]) {
    const errors = validateInquiryAttachments(
      nextAttachments.map((item) => ({
        name: item.name,
        size: item.size,
        type: item.type,
      })),
    );

    if (errors.length) {
      setAttachmentError(errors[0]);
      return false;
    }

    setAttachmentError(null);
    return true;
  }

  function handleFilesAdded(files: FileList | File[]) {
    const incoming = Array.from(files).map(createAttachment);
    const nextAttachments = [...attachments, ...incoming];

    if (!validateAttachments(nextAttachments)) {
      return;
    }

    setAttachments(nextAttachments);
  }

  async function onSubmit(values: InquirySchemaValues) {
    setSubmissionError(null);

    if (!validateAttachments(attachments)) {
      return;
    }

    try {
      await submitInquiry({
        ...values,
        attachments,
      });
    } catch (error) {
      if (error instanceof InquirySubmissionError) {
        setSubmissionError(error.message);

        if (error.fieldErrors) {
          Object.entries(error.fieldErrors).forEach(([key, messages]) => {
            const message = Array.isArray(messages) ? messages[0] : null;
            if (!message) {
              return;
            }

            if (key === "attachments") {
              setAttachmentError(message);
              return;
            }

            if (key in defaultValues) {
              setError(key as keyof InquirySchemaValues, {
                type: "server",
                message,
              });
            }
          });
        }
      } else {
        setSubmissionError(
          "Cererea nu a putut fi trimisa momentan. Te rugam sa incerci din nou.",
        );
      }

      return;
    }

    setIsSuccess(true);
  }

  if (isSuccess) {
    return (
      <SuccessState
        onReset={() => {
          setIsSuccess(false);
          setAttachments([]);
          setAttachmentError(null);
          setSubmissionError(null);
          reset(defaultValues);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="luxury-card space-y-8 p-6 md:p-9">
      {submissionError ? (
        <p className="rounded-2xl border border-red-200/90 bg-red-50/80 px-4 py-3 text-sm text-red-700">
          {submissionError}
        </p>
      ) : null}

      <FormSection
        title="Brief de proiect"
        description="Spune-ne liber ce iti doresti. Nu este nevoie de specificatii perfecte pentru a incepe."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FormField id="nume" label="Nume" required error={errors.nume?.message}>
            <TextInput
              id="nume"
              type="text"
              placeholder="Ex: Andrei Popescu"
              hasError={Boolean(errors.nume)}
              {...register("nume")}
            />
          </FormField>

          <FormField
            id="telefon"
            label="Telefon"
            required
            error={errors.telefon?.message}
          >
            <TextInput
              id="telefon"
              type="tel"
              placeholder="Ex: 07xx xxx xxx"
              hasError={Boolean(errors.telefon)}
              {...register("telefon")}
            />
          </FormField>

          <FormField id="email" label="Email" required error={errors.email?.message}>
            <TextInput
              id="email"
              type="email"
              placeholder="Ex: nume@email.ro"
              hasError={Boolean(errors.email)}
              {...register("email")}
            />
          </FormField>

          <FormField
            id="titluProiect"
            label="Titlu proiect"
            required
            error={errors.titluProiect?.message}
          >
            <TextInput
              id="titluProiect"
              type="text"
              placeholder="Ex: mobilier living + dining"
              hasError={Boolean(errors.titluProiect)}
              {...register("titluProiect")}
            />
          </FormField>
        </div>

        <FormField
          id="descriereDetaliata"
          label="Descriere detaliata"
          required
          hint="Poti descrie liber ideea ta: stil, dimensiuni aproximative, esenta preferata, finisaj dorit, fotografii de inspiratie sau orice detaliu important pentru proiect."
          error={errors.descriereDetaliata?.message}
        >
          <TextArea
            id="descriereDetaliata"
            rows={7}
            className="min-h-48"
            placeholder="Descrie contextul, stilul dorit si cum ai vrea sa se simta piesa in spatiu."
            hasError={Boolean(errors.descriereDetaliata)}
            {...register("descriereDetaliata")}
          />
        </FormField>
      </FormSection>

      <FormSection
        title="Detalii optionale"
        description="Informatiile de mai jos ne ajuta sa calibram mai bine propunerea."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            id="dimensiuniAproximative"
            label="Dimensiuni aproximative"
            error={errors.dimensiuniAproximative?.message}
          >
            <TextArea
              id="dimensiuniAproximative"
              rows={4}
              placeholder="Ex: perete 3.8m, adancime 45cm, inaltime 2.5m"
              hasError={Boolean(errors.dimensiuniAproximative)}
              {...register("dimensiuniAproximative")}
            />
          </FormField>

          <FormField
            id="spatiulFolosire"
            label="Spatiul unde va fi folosit"
            error={errors.spatiulFolosire?.message}
          >
            <TextArea
              id="spatiulFolosire"
              rows={4}
              placeholder="Ex: living open-space, apartament, trafic zilnic intens"
              hasError={Boolean(errors.spatiulFolosire)}
              {...register("spatiulFolosire")}
            />
          </FormField>

          <FormField
            id="bugetOrientativ"
            label="Buget orientativ"
            error={errors.bugetOrientativ?.message}
          >
            <TextInput
              id="bugetOrientativ"
              type="text"
              placeholder="Ex: 12.000 - 18.000 lei"
              hasError={Boolean(errors.bugetOrientativ)}
              {...register("bugetOrientativ")}
            />
          </FormField>

          <FormField
            id="termenDorit"
            label="Termen dorit"
            error={errors.termenDorit?.message}
          >
            <TextInput
              id="termenDorit"
              type="text"
              placeholder="Ex: inceput de septembrie"
              hasError={Boolean(errors.termenDorit)}
              {...register("termenDorit")}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Incarca fisiere de inspiratie"
        description="Fotografiile, schitele sau referintele vizuale accelereaza analiza."
      >
        <UploadZone
          attachments={attachments}
          onFilesAdded={handleFilesAdded}
          onRemoveFile={(id) => {
            const nextAttachments = attachments.filter((item) => item.id !== id);
            setAttachments(nextAttachments);

            if (attachmentError) {
              validateAttachments(nextAttachments);
            }
          }}
        />
        <div className="space-y-1">
          <p className="text-xs text-wood-700/90">
            Maximum {inquiryUploadConstraints.maxFiles} fisiere,{" "}
            {Math.floor(inquiryUploadConstraints.maxFileSizeBytes / (1024 * 1024))} MB
            per fisier.
          </p>
          {attachmentError ? (
            <p className="text-xs text-red-700">{attachmentError}</p>
          ) : null}
        </div>
      </FormSection>

      <FormSection title="Observatii suplimentare">
        <FormField
          id="observatiiSuplimentare"
          label="Observatii suplimentare"
          error={errors.observatiiSuplimentare?.message}
        >
          <TextArea
            id="observatiiSuplimentare"
            rows={4}
            placeholder="Orice alt detaliu care te ajuta sa explici mai clar proiectul."
            hasError={Boolean(errors.observatiiSuplimentare)}
            {...register("observatiiSuplimentare")}
          />
        </FormField>
      </FormSection>

      <div className="flex flex-col gap-4 border-t border-sand-300/70 pt-6">
        <SubmitButton isSubmitting={isSubmitting} />
        <p className="text-xs text-wood-700">
          Datele tale sunt folosite exclusiv pentru analiza cererii si contactarea
          ta privind proiectul transmis.
        </p>
      </div>
    </form>
  );
}
