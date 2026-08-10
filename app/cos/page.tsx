import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Solicita oferta personalizata",
  description:
    "Trimite o cerere pentru mobilier din lemn masiv realizat la comanda.",
  path: "/cos",
});

export default function CartPage() {
  redirect("/comanda-mobilier#formular-comanda");
}
