import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Solicita oferta personalizata",
  description:
    "Completeaza formularul pentru o oferta de mobilier din lemn masiv realizat la comanda.",
  path: "/finalizare-comanda",
});

export default function CheckoutPage() {
  redirect("/comanda-mobilier#formular-comanda");
}
