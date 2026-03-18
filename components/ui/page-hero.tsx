import Image from "next/image";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-b border-sand-300/70 py-20 md:py-24",
        className,
      )}
    >
      {image ? (
        <>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-center opacity-20"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sand-50 via-sand-50/92 to-sand-50/82" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-sand-100/65 to-sand-50" />
      )}

      <Container className="relative space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-wood-700">
          {eyebrow}
        </p>
        <h1 className="max-w-4xl text-5xl md:text-6xl">{title}</h1>
        <p className="max-w-3xl text-lg text-wood-700 md:text-xl">{description}</p>
      </Container>
    </section>
  );
}
