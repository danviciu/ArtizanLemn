"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { PrimaryButtonLink } from "@/components/ui/primary-button";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Container } from "@/components/ui/container";
import { mainNavigation } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nextValue = window.scrollY > 16;
      setHasScrolled((prevValue) =>
        prevValue === nextValue ? prevValue : nextValue,
      );
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500",
        hasScrolled
          ? "border-sand-300/80 bg-sand-50/96 shadow-[0_12px_34px_-26px_rgba(35,24,16,0.82)] backdrop-blur-xl"
          : "border-transparent bg-sand-50/74 backdrop-blur-lg",
      )}
    >
      <Container className="flex h-[76px] items-center justify-between gap-4 sm:h-[82px] xl:grid xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:gap-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <BrandLogo
            size="md"
            className="h-10 w-10 rounded-xl sm:h-11 sm:w-11 xl:h-12 xl:w-12"
            priority
          />
          <div className="leading-tight">
            <p className="font-display text-[1.65rem] leading-none text-wood-950 sm:text-[1.9rem] xl:text-[2.05rem]">
              Artizan Lemn
            </p>
            <p className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-wood-700 2xl:block">
              mobilier premium la comanda
            </p>
          </div>
        </Link>

        <nav className="hidden min-w-0 items-center justify-center gap-6 xl:flex">
          {mainNavigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-[13px] font-medium tracking-[0.01em] text-wood-700 transition-colors hover:text-wood-950",
                  isActive && "text-wood-950",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 xl:block">
          <PrimaryButtonLink href="/comanda-mobilier" size="sm" className="px-5">
            Solicita oferta
          </PrimaryButtonLink>
        </div>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Inchide meniul" : "Deschide meniul"}
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sand-300 bg-white/92 text-wood-900 transition-colors hover:bg-sand-100 xl:hidden"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </Container>

      {isOpen ? (
        <div className="border-t border-sand-300/70 bg-sand-50/98 backdrop-blur-xl xl:hidden">
          <Container className="py-4">
            <nav className="flex flex-col gap-1">
              {mainNavigation.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-2.5 text-sm font-medium text-wood-700 transition-colors hover:bg-sand-100 hover:text-wood-950",
                      isActive && "bg-sand-100 text-wood-950",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <PrimaryButtonLink
              href="/comanda-mobilier"
              size="sm"
              className="mt-4 h-11 w-full justify-center"
            >
              Solicita oferta
            </PrimaryButtonLink>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
