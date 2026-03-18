import { ButtonLink } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="luxury-card p-7">
      <h2 className="text-4xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm text-wood-700">{description}</p>
      {actionHref && actionLabel ? (
        <ButtonLink href={actionHref} size="sm" className="mt-5">
          {actionLabel}
        </ButtonLink>
      ) : null}
    </div>
  );
}
