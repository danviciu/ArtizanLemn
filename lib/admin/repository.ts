import { adminBlogPosts } from "@/data/adminBlog";
import { adminGalleryProjects } from "@/data/adminGallery";
import { adminInquiries } from "@/data/adminInquiries";
import { adminOrders } from "@/data/adminOrders";
import {
  getPersistedAdminProductById,
  listPersistedAdminProducts,
} from "@/lib/admin/products-repository";

export async function listAdminProducts() {
  return listPersistedAdminProducts();
}

export async function listAdminInquiries() {
  return [...adminInquiries];
}

export async function listAdminOrders() {
  return [...adminOrders];
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
  return adminOrders.find((item) => item.id === id) ?? null;
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
