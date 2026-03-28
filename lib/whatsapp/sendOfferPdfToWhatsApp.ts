import "server-only";
import {
  getOptionalWhatsAppAccessToken,
  getOptionalWhatsAppPhoneNumberId,
} from "@/lib/env";
import { normalizeWhatsAppNumber } from "@/lib/site-config";

const WHATSAPP_API_VERSION = "v22.0";

type SendOfferPdfToWhatsAppPayload = {
  destinationPhone: string;
  fileName: string;
  signedPdfUrl: string;
  caption: string;
};

type SendOfferPdfToWhatsAppResult =
  | {
      sent: true;
      messageId: string;
    }
  | {
      sent: false;
      reason: "missing_config" | "invalid_phone" | "api_error";
      errorMessage?: string;
    };

function getWhatsAppConfig() {
  const accessToken = getOptionalWhatsAppAccessToken() ?? "";
  const phoneNumberId = getOptionalWhatsAppPhoneNumberId() ?? "";

  if (!accessToken || !phoneNumberId) {
    return null;
  }

  return {
    accessToken,
    phoneNumberId,
  };
}

export async function sendOfferPdfToWhatsApp(
  payload: SendOfferPdfToWhatsAppPayload,
): Promise<SendOfferPdfToWhatsAppResult> {
  const config = getWhatsAppConfig();
  if (!config) {
    return {
      sent: false,
      reason: "missing_config",
    };
  }

  const normalizedPhone = normalizeWhatsAppNumber(payload.destinationPhone);
  if (!normalizedPhone) {
    return {
      sent: false,
      reason: "invalid_phone",
      errorMessage: "Numarul de telefon al clientului este invalid pentru WhatsApp.",
    };
  }

  const response = await fetch(
    `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${config.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.accessToken}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: normalizedPhone,
        type: "document",
        document: {
          link: payload.signedPdfUrl,
          filename: payload.fileName,
          caption: payload.caption.slice(0, 1024),
        },
      }),
      cache: "no-store",
    },
  );

  const result = (await response.json().catch(() => null)) as
    | {
        messages?: Array<{ id?: string }>;
        error?: { message?: string };
      }
    | null;

  if (!response.ok) {
    return {
      sent: false,
      reason: "api_error",
      errorMessage:
        result?.error?.message ||
        "WhatsApp API a respins trimiterea documentului.",
    };
  }

  const messageId = result?.messages?.[0]?.id;
  if (!messageId) {
    return {
      sent: false,
      reason: "api_error",
      errorMessage: "WhatsApp API nu a returnat ID-ul mesajului.",
    };
  }

  return {
    sent: true,
    messageId,
  };
}
