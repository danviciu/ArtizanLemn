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

export function createGoogleMapsEmbedLink() {
  const { latitude, longitude } = siteContactConfig.location;
  return `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;
}

export function createGoogleMapsLink() {
  const { latitude, longitude } = siteContactConfig.location;
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}
