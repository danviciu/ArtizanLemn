import { cn } from "@/lib/utils";

type AdminSectionHeadingProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function AdminSectionHeading({
  title,
  description,
  actions,
  className,
}: AdminSectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="space-y-2">
        <h1 className="text-5xl">{title}</h1>
        {description ? <p className="max-w-3xl text-sm text-wood-700">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
