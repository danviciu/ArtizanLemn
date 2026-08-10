import { NextResponse } from "next/server";
import { sendInquiryNotification } from "@/lib/email/sendInquiryNotification";
import { getClientIp, isInquiryRequestRateLimited } from "@/lib/inquiries/rate-limit";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import {
  inquirySchema,
  validateInquiryAttachments,
} from "@/lib/validation/inquirySchema";
import {
  marketingAttributionFormFields,
  type MarketingAttributionData,
} from "@/types/marketing";

export const runtime = "nodejs";

const INQUIRY_ATTACHMENTS_BUCKET = "inquiry-attachments";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

type StoredAttachment = {
  name: string;
  path: string;
  publicUrl: string;
  size: number;
  type: string;
};

type InquiryInsertResult = {
  id: string;
  created_at: string;
};

type FlattenedFormErrors = {
  fieldErrors: Record<string, string[] | undefined>;
  formErrors: string[];
};

function getTextField(formData: FormData, field: string) {
  const rawValue = formData.get(field);
  return typeof rawValue === "string" ? rawValue : "";
}

function getOptionalValue(value?: string) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function sanitizeFileName(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".");
  const extension = dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : "";
  const baseName = dotIndex >= 0 ? fileName.slice(0, dotIndex) : fileName;

  const safeBase = baseName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `${safeBase || "fisier"}${extension}`;
}

function normalizeMarketingAttribution(payload: MarketingAttributionData) {
  const normalized: MarketingAttributionData = {};

  marketingAttributionFormFields.forEach((field) => {
    const value = getOptionalValue(payload[field]);
    if (value) {
      normalized[field] = value;
    }
  });

  return normalized;
}

function buildMarketingAttributionNotes(attribution: MarketingAttributionData) {
  const lines = [
    attribution.utmSource ? `utm_source: ${attribution.utmSource}` : null,
    attribution.utmMedium ? `utm_medium: ${attribution.utmMedium}` : null,
    attribution.utmCampaign ? `utm_campaign: ${attribution.utmCampaign}` : null,
    attribution.utmTerm ? `utm_term: ${attribution.utmTerm}` : null,
    attribution.utmContent ? `utm_content: ${attribution.utmContent}` : null,
    attribution.gclid ? `gclid: ${attribution.gclid}` : null,
    attribution.wbraid ? `wbraid: ${attribution.wbraid}` : null,
    attribution.gbraid ? `gbraid: ${attribution.gbraid}` : null,
    attribution.fbclid ? `fbclid: ${attribution.fbclid}` : null,
    attribution.msclkid ? `msclkid: ${attribution.msclkid}` : null,
    attribution.attributionLandingPage
      ? `pagina intrare: ${attribution.attributionLandingPage}`
      : null,
    attribution.attributionReferrer
      ? `referrer: ${attribution.attributionReferrer}`
      : null,
    attribution.attributionCapturedAt
      ? `capturat la: ${attribution.attributionCapturedAt}`
      : null,
    attribution.attributionLastSeenAt
      ? `ultima actualizare: ${attribution.attributionLastSeenAt}`
      : null,
  ].filter((line): line is string => Boolean(line));

  if (!lines.length) {
    return null;
  }

  return `[Atribuire marketing]\n${lines.join("\n")}`;
}

function mergeAdditionalNotes(
  userNotes: string | null,
  attribution: MarketingAttributionData,
) {
  const attributionNotes = buildMarketingAttributionNotes(attribution);

  if (!attributionNotes) {
    return userNotes;
  }

  if (!userNotes) {
    return attributionNotes;
  }

  return `${userNotes}\n\n${attributionNotes}`;
}

function buildStoragePath(inquiryToken: string, originalName: string) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = `${now.getUTCMonth() + 1}`.padStart(2, "0");
  const safeName = sanitizeFileName(originalName);
  const randomToken = crypto.randomUUID().slice(0, 8);
  return `${year}/${month}/${inquiryToken}/${randomToken}-${safeName}`;
}

async function cleanupUploadedFiles(paths: string[]) {
  if (!paths.length) {
    return;
  }

  try {
    const supabase = createSupabaseServiceRoleClient();
    await supabase.storage.from(INQUIRY_ATTACHMENTS_BUCKET).remove(paths);
  } catch (error) {
    console.error("Cleanup pentru atasamentele incarcate a esuat.", error);
  }
}

function mapZodErrors(flattenedErrors: FlattenedFormErrors) {
  const fieldErrors = Object.fromEntries(
    Object.entries(flattenedErrors.fieldErrors).filter(
      (entry): entry is [string, string[]] =>
        Array.isArray(entry[1]) && entry[1].length > 0,
    ),
  );

  return {
    fieldErrors,
    formErrors: flattenedErrors.formErrors,
  };
}

export async function POST(request: Request) {
  const uploadedAttachments: StoredAttachment[] = [];

  try {
    const formData = await request.formData();
    const honeypotValue = getTextField(formData, "website").trim();

    if (honeypotValue.length > 0) {
      return NextResponse.json({
        success: true,
        inquiryId: `hp-${crypto.randomUUID()}`,
        receivedAt: new Date().toISOString(),
        notificationSent: false,
      });
    }

    const clientIp = getClientIp(request);
    if (
      await isInquiryRequestRateLimited(clientIp, {
        windowMs: RATE_LIMIT_WINDOW_MS,
        maxRequests: RATE_LIMIT_MAX_REQUESTS,
      })
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Ai trimis prea multe cereri intr-un interval scurt. Te rugam sa incerci din nou in cateva minute.",
        },
        { status: 429 },
      );
    }

    const payload = {
      nume: getTextField(formData, "nume"),
      telefon: getTextField(formData, "telefon"),
      email: getTextField(formData, "email"),
      website: getTextField(formData, "website"),
      titluProiect: getTextField(formData, "titluProiect"),
      descriereDetaliata: getTextField(formData, "descriereDetaliata"),
      dimensiuniAproximative: getTextField(formData, "dimensiuniAproximative"),
      spatiulFolosire: getTextField(formData, "spatiulFolosire"),
      bugetOrientativ: getTextField(formData, "bugetOrientativ"),
      termenDorit: getTextField(formData, "termenDorit"),
      observatiiSuplimentare: getTextField(formData, "observatiiSuplimentare"),
      ...Object.fromEntries(
        marketingAttributionFormFields.map((field) => [field, getTextField(formData, field)]),
      ),
    };

    const parsedPayload = inquirySchema.safeParse(payload);
    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Datele formularului nu sunt valide.",
          ...mapZodErrors(parsedPayload.error.flatten()),
        },
        { status: 400 },
      );
    }

    const files = formData
      .getAll("attachments")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    const attachmentValidationErrors = validateInquiryAttachments(
      files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    );

    if (attachmentValidationErrors.length) {
      return NextResponse.json(
        {
          success: false,
          message: attachmentValidationErrors[0],
        },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServiceRoleClient();
    const inquiryToken = crypto.randomUUID();
    const normalizedAttribution = normalizeMarketingAttribution(parsedPayload.data);
    const additionalNotes = mergeAdditionalNotes(
      getOptionalValue(parsedPayload.data.observatiiSuplimentare),
      normalizedAttribution,
    );

    for (const file of files) {
      const storagePath = buildStoragePath(inquiryToken, file.name);
      const { error: uploadError } = await supabase.storage
        .from(INQUIRY_ATTACHMENTS_BUCKET)
        .upload(storagePath, file, {
          contentType: file.type || undefined,
          upsert: false,
        });

      if (uploadError) {
        await cleanupUploadedFiles(uploadedAttachments.map((item) => item.path));
        return NextResponse.json(
          {
            success: false,
            message:
              "Nu am putut incarca toate fisierele. Verifica formatele si incearca din nou.",
          },
          { status: 500 },
        );
      }

      const { data: publicData } = supabase.storage
        .from(INQUIRY_ATTACHMENTS_BUCKET)
        .getPublicUrl(storagePath);

      uploadedAttachments.push({
        name: file.name,
        path: storagePath,
        publicUrl: publicData.publicUrl,
        size: file.size,
        type: file.type || "application/octet-stream",
      });
    }

    const { data: insertedInquiry, error: insertError } = await supabase
      .from("inquiries")
      .insert({
        name: parsedPayload.data.nume,
        phone: parsedPayload.data.telefon,
        email: parsedPayload.data.email,
        project_title: parsedPayload.data.titluProiect,
        description: parsedPayload.data.descriereDetaliata,
        dimensions: getOptionalValue(parsedPayload.data.dimensiuniAproximative),
        room_type: getOptionalValue(parsedPayload.data.spatiulFolosire),
        budget: getOptionalValue(parsedPayload.data.bugetOrientativ),
        deadline_note: getOptionalValue(parsedPayload.data.termenDorit),
        additional_notes: additionalNotes,
        attachments: uploadedAttachments,
        status: "nou",
      })
      .select("id, created_at")
      .single<InquiryInsertResult>();

    if (insertError || !insertedInquiry) {
      await cleanupUploadedFiles(uploadedAttachments.map((item) => item.path));
      return NextResponse.json(
        {
          success: false,
          message:
            "Cererea nu a putut fi salvata momentan. Te rugam sa incerci din nou.",
        },
        { status: 500 },
      );
    }

    let notificationSent = true;

    try {
      await sendInquiryNotification({
        inquiryId: insertedInquiry.id,
        submissionDateIso: insertedInquiry.created_at,
        name: parsedPayload.data.nume,
        phone: parsedPayload.data.telefon,
        email: parsedPayload.data.email,
        projectTitle: parsedPayload.data.titluProiect,
        description: parsedPayload.data.descriereDetaliata,
        dimensions: getOptionalValue(parsedPayload.data.dimensiuniAproximative),
        roomType: getOptionalValue(parsedPayload.data.spatiulFolosire),
        budget: getOptionalValue(parsedPayload.data.bugetOrientativ),
        deadlineNote: getOptionalValue(parsedPayload.data.termenDorit),
        additionalNotes,
        marketingAttribution: normalizedAttribution,
        attachments: uploadedAttachments,
      });
    } catch (error) {
      notificationSent = false;
      console.error(
        `Cererea ${insertedInquiry.id} a fost salvata, dar notificarea email a esuat.`,
        error,
      );
    }

    return NextResponse.json({
      success: true,
      inquiryId: insertedInquiry.id,
      receivedAt: insertedInquiry.created_at,
      notificationSent,
    });
  } catch (error) {
    if (uploadedAttachments.length) {
      await cleanupUploadedFiles(uploadedAttachments.map((item) => item.path));
    }

    const message =
      error instanceof Error &&
      error.message.includes("Lipseste variabila de mediu obligatorie")
        ? error.message
        : "A aparut o eroare la trimiterea cererii. Te rugam sa incerci din nou.";

    console.error("POST /api/inquiries error", error);

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
