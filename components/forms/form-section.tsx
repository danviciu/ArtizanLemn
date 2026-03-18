import { cn } from "@/lib/utils";

type FormSectionProps = {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

export function FormSection({
  title,
  description,
  className,
  children,
}: FormSectionProps) {
  return (
    <section className={cn("space-y-5", className)}>
      <div className="space-y-2">
        <h2 className="text-3xl">{title}</h2>
        {description ? <p className="text-sm text-wood-700">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
