import { Button, ButtonLink } from "@/components/ui/button";

type SecondaryButtonProps = Omit<React.ComponentProps<typeof Button>, "variant">;
type SecondaryButtonLinkProps = Omit<
  React.ComponentProps<typeof ButtonLink>,
  "variant"
>;

export function SecondaryButton(props: SecondaryButtonProps) {
  return <Button variant="secondary" {...props} />;
}

export function SecondaryButtonLink(props: SecondaryButtonLinkProps) {
  return <ButtonLink variant="secondary" {...props} />;
}
