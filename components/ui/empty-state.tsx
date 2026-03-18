import { PrimaryButtonLink } from "@/components/ui/primary-button";

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
    <div className="luxury-card flex flex-col items-start gap-4 p-8">
      <h2 className="text-4xl">{title}</h2>
      <p className="max-w-2xl text-sm text-wood-700">{description}</p>
      {actionHref && actionLabel ? (
        <PrimaryButtonLink href={actionHref}>{actionLabel}</PrimaryButtonLink>
      ) : null}
    </div>
  );
}
