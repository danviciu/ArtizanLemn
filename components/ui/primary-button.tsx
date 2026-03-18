import { Button, ButtonLink } from "@/components/ui/button";

type PrimaryButtonProps = Omit<React.ComponentProps<typeof Button>, "variant">;
type PrimaryButtonLinkProps = Omit<
  React.ComponentProps<typeof ButtonLink>,
  "variant"
>;

export function PrimaryButton(props: PrimaryButtonProps) {
  return <Button variant="primary" {...props} />;
}

export function PrimaryButtonLink(props: PrimaryButtonLinkProps) {
  return <ButtonLink variant="primary" {...props} />;
}
