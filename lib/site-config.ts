export const siteContactConfig = {
  whatsappNumber: "40755573522",
  whatsappMessage:
    "Buna! As dori mai multe informatii despre mobilierul realizat la comanda.",
  location: {
    latitude: "45.72060923534372",
    longitude: "25.76049694026621",
  },
} as const;

export function createWhatsAppLink(
  message: string = siteContactConfig.whatsappMessage,
) {
  const cleanNumber = siteContactConfig.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message.trim())}`;
}

export function normalizeWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("00")) {
    return digits.slice(2);
  }

  if (digits.startsWith("0") && digits.length === 10) {
    return `40${digits.slice(1)}`;
  }

  return digits;
}

export function createWhatsAppLinkToPhone(phone: string, message: string) {
  const cleanNumber = normalizeWhatsAppNumber(phone);
  if (!cleanNumber) {
    return "";
  }

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message.trim())}`;
}

export function createGoogleMapsEmbedLink() {
  const { latitude, longitude } = siteContactConfig.location;
  return `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;
}

export function createGoogleMapsLink() {
  const { latitude, longitude } = siteContactConfig.location;
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}
