import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Container } from "@/components/ui/container";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <section className="min-h-screen bg-sand-100/40 py-8 md:py-10">
      <Container className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <AdminSidebar />

        <div className="space-y-6">
          <AdminHeader />
          {children}
        </div>
      </Container>
    </section>
  );
}
