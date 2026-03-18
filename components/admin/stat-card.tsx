import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
};

export function StatCard({ label, value, hint, className }: StatCardProps) {
  return (
    <article className={cn("luxury-card p-5", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wood-700">
        {label}
      </p>
      <p className="mt-2 text-4xl">{value}</p>
      {hint ? <p className="mt-2 text-xs text-wood-700">{hint}</p> : null}
    </article>
  );
}
