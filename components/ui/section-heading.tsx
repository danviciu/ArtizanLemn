import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-4", align === "center" && "text-center", className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-wood-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-4xl md:text-5xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-base text-wood-700 md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
