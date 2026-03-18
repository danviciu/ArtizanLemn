import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import {
  ADMIN_SESSION_COOKIE_NAME,
  getAdminAuthConfigError,
  isAdminSessionTokenValid,
  sanitizeAdminRedirectPath,
} from "@/lib/admin/auth";
import { createPageMetadata } from "@/lib/site";

type AdminLoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Autentificare Admin",
    description: "Acces securizat in panoul administrativ Artizan Lemn.",
    path: "/admin-login",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const nextPath = sanitizeAdminRedirectPath(params.next);
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (sessionToken && isAdminSessionTokenValid(sessionToken)) {
    redirect(nextPath);
  }

  const configError = getAdminAuthConfigError();

  return (
    <section className="bg-sand-100/40 py-14 md:py-20">
      <div className="mx-auto w-full max-w-5xl px-5">
        <AdminLoginForm nextPath={nextPath} configError={configError} />
      </div>
    </section>
  );
}
