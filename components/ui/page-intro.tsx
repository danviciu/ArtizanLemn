import { cn } from "@/lib/utils";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
  actions?: React.ReactNode;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  className,
  actions,
}: PageIntroProps) {
  return (
    <div className={cn("space-y-5", className)}>
      {eyebrow ? <p className="editorial-kicker">{eyebrow}</p> : null}
      <h1 className="max-w-4xl text-5xl md:text-6xl">{title}</h1>
      <p className="max-w-3xl text-base text-wood-700 md:text-lg">{description}</p>
      {actions ? <div className="pt-2">{actions}</div> : null}
    </div>
  );
}
