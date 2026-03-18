import type { InquiryAttachment, InquiryFormData } from "@/types/forms";

export type InquirySubmissionPayload = Omit<InquiryFormData, "attachments"> & {
  attachments: InquiryAttachment[];
};

export type InquirySubmissionResult = {
  success: true;
  inquiryId: string;
  receivedAt: string;
  notificationSent: boolean;
};

type InquirySubmissionFailure = {
  success: false;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export class InquirySubmissionError extends Error {
  fieldErrors?: Record<string, string[]>;

  constructor(message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "InquirySubmissionError";
    this.fieldErrors = fieldErrors;
  }
}

function appendTextField(
  formData: FormData,
  key: keyof Omit<InquirySubmissionPayload, "attachments">,
  value: string | undefined,
) {
  formData.append(key, value ?? "");
}

export async function submitInquiry(
  payload: InquirySubmissionPayload,
): Promise<InquirySubmissionResult> {
  const formData = new FormData();

  appendTextField(formData, "nume", payload.nume);
  appendTextField(formData, "telefon", payload.telefon);
  appendTextField(formData, "email", payload.email);
  appendTextField(formData, "titluProiect", payload.titluProiect);
  appendTextField(formData, "descriereDetaliata", payload.descriereDetaliata);
  appendTextField(
    formData,
    "dimensiuniAproximative",
    payload.dimensiuniAproximative,
  );
  appendTextField(formData, "spatiulFolosire", payload.spatiulFolosire);
  appendTextField(formData, "bugetOrientativ", payload.bugetOrientativ);
  appendTextField(formData, "termenDorit", payload.termenDorit);
  appendTextField(
    formData,
    "observatiiSuplimentare",
    payload.observatiiSuplimentare,
  );

  payload.attachments.forEach((attachment) => {
    formData.append("attachments", attachment.file);
  });

  const response = await fetch("/api/inquiries", {
    method: "POST",
    body: formData,
  });

  let responseBody: InquirySubmissionResult | InquirySubmissionFailure | null = null;

  try {
    responseBody = (await response.json()) as
      | InquirySubmissionResult
      | InquirySubmissionFailure;
  } catch {
    responseBody = null;
  }

  if (!response.ok || !responseBody || !("success" in responseBody)) {
    throw new InquirySubmissionError(
      "Cererea nu a putut fi trimisa momentan. Te rugam sa incerci din nou.",
    );
  }

  if (!responseBody.success) {
    throw new InquirySubmissionError(
      responseBody.message ||
        "Cererea nu a putut fi trimisa momentan. Te rugam sa incerci din nou.",
      responseBody.fieldErrors,
    );
  }

  return responseBody;
}
