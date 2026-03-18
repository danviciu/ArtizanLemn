import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrimaryButtonLink } from "@/components/ui/primary-button";

type SuccessStateProps = {
  onReset: () => void;
};

export function SuccessState({ onReset }: SuccessStateProps) {
  return (
    <div className="luxury-card space-y-6 p-7 md:p-10">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-moss-600/35 bg-moss-400/20 text-moss-600">
        <CheckCircle2 size={24} />
      </span>

      <div className="space-y-2">
        <h2 className="text-4xl">Cererea ta a fost trimisa</h2>
        <p className="text-sm text-wood-700 md:text-base">
          Iti multumim. Vom analiza detaliile transmise si vom reveni catre tine
          in cel mai scurt timp cu urmatorii pasi.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <PrimaryButtonLink href="/">Inapoi la homepage</PrimaryButtonLink>
        <Button type="button" variant="secondary" onClick={onReset}>
          Trimite alta cerere
        </Button>
      </div>

      <p className="text-xs text-wood-700/90">
        Daca doresti sa adaugi clarificari, poti trimite o noua cerere sau ne poti
        scrie direct la{" "}
        <Link
          href="mailto:contact@artizanlemn.ro"
          className="font-medium text-wood-900 underline-offset-4 hover:underline"
        >
          contact@artizanlemn.ro
        </Link>
        .
      </p>
    </div>
  );
}
