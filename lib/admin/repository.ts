import { adminBlogPosts } from "@/data/adminBlog";
import { adminGalleryProjects } from "@/data/adminGallery";
import { adminInquiries } from "@/data/adminInquiries";
import { adminOrders } from "@/data/adminOrders";
import { formatRon } from "@/data/product-pricing";
import {
  getPersistedAdminOfferById,
  listPersistedAdminOffers,
} from "@/lib/admin/offers-repository";
import {
  getPersistedAdminProductById,
  listPersistedAdminProducts,
} from "@/lib/admin/products-repository";
import {
  getStoredCheckoutOrderById,
  listStoredCheckoutOrders,
} from "@/lib/orders/orders-repository";
import type { AdminOrder } from "@/types/admin";
import type { StoredCheckoutOrder } from "@/types/shop";

function deliveryMethodLabel(method: StoredCheckoutOrder["deliveryMethod"]) {
  return method === "curier" ? "Curier" : "Ridicare personala";
}

function paymentMethodLabel(method: StoredCheckoutOrder["paymentMethod"]) {
  return method === "transfer_bancar" ? "Transfer bancar" : "Numerar / ramburs";
}

function mapCheckoutOrderToAdminOrder(order: StoredCheckoutOrder): AdminOrder {
  const fixedPriceLabel = `${formatRon(order.subtotalFixed)} lei`;
  const pretAgreat = order.hasOnRequestItems
    ? order.subtotalFixed > 0
      ? `${fixedPriceLabel} + la cerere`
      : "La cerere"
    : fixedPriceLabel;

  const itemSummary = order.items
    .map((item) => `${item.title} x${item.quantity}`)
    .join("; ");

  return {
    id: order.id,
    client: order.customerName,
    proiect:
      order.items.length === 1
        ? order.items[0].title
        : `Comanda website (${order.items.length} produse)`,
    pretAgreat,
    termen: "De confirmat la telefon",
    status: "confirmata",
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    notes: `Comanda web ${order.orderNumber}. Livrare: ${deliveryMethodLabel(order.deliveryMethod)}. Plata: ${paymentMethodLabel(order.paymentMethod)}. Produse: ${itemSummary}.`,
  };
}

export async function listAdminProducts() {
  return listPersistedAdminProducts();
}

export async function listAdminInquiries() {
  return [...adminInquiries];
}

export async function listAdminOrders() {
  const checkoutOrders = await listStoredCheckoutOrders();
  const mappedCheckoutOrders = checkoutOrders.map(mapCheckoutOrderToAdminOrder);

  return [...mappedCheckoutOrders, ...adminOrders].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function listAdminOffers() {
  return listPersistedAdminOffers();
}

export async function listAdminGalleryProjects() {
  return [...adminGalleryProjects];
}

export async function listAdminBlogPosts() {
  return [...adminBlogPosts];
}

export async function getAdminProductById(id: string) {
  return getPersistedAdminProductById(id);
}

export async function getAdminInquiryById(id: string) {
  return adminInquiries.find((item) => item.id === id) ?? null;
}

export async function getAdminOrderById(id: string) {
  const staticOrder = adminOrders.find((item) => item.id === id);
  if (staticOrder) {
    return staticOrder;
  }

  const checkoutOrder = await getStoredCheckoutOrderById(id);
  if (!checkoutOrder) {
    return null;
  }

  return mapCheckoutOrderToAdminOrder(checkoutOrder);
}

export async function getAdminOfferById(id: string) {
  return getPersistedAdminOfferById(id);
}

export async function getAdminGalleryById(id: string) {
  return adminGalleryProjects.find((item) => item.id === id) ?? null;
}

export async function getAdminBlogById(id: string) {
  return adminBlogPosts.find((item) => item.id === id) ?? null;
}

/**
 * Future Supabase integration plan:
 * 1. Replace list/get functions with Supabase select queries
 * 2. Add create/update/delete mutations by entity
 * 3. Sync media fields with Supabase Storage URLs
 * 4. Persist status changes and internal notes
 */
