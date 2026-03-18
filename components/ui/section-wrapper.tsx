import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type SectionTone = "default" | "muted" | "dark";

type SectionWrapperProps = {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
  tone?: SectionTone;
};

const toneClassMap: Record<SectionTone, string> = {
  default: "bg-transparent",
  muted: "bg-sand-100/45 border-y border-sand-300/65",
  dark: "bg-wood-950 text-sand-50",
};

export function SectionWrapper({
  children,
  id,
  className,
  containerClassName,
  tone = "default",
}: SectionWrapperProps) {
  return (
    <section id={id} className={cn("section-space", toneClassMap[tone], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
