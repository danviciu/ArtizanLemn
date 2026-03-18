import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  ADMIN_SESSION_COOKIE_NAME,
  isAdminSessionTokenValid,
} from "@/lib/admin/auth";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!sessionToken || !isAdminSessionTokenValid(sessionToken)) {
    redirect("/admin-login");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
