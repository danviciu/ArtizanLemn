import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "border border-wood-900 bg-wood-900 text-sand-50 hover:bg-wood-800 hover:border-wood-800 shadow-[0_12px_24px_-18px_rgba(46,31,22,0.9)]",
  secondary:
    "border border-sand-300 bg-white text-wood-950 hover:bg-sand-100 hover:border-sand-400",
  ghost:
    "border border-wood-900/25 bg-transparent text-wood-900 hover:bg-wood-900/8 hover:border-wood-900/45",
} as const;

const sizes = {
  sm: "h-10 px-5 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-7 text-base",
} as const;

type SharedProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & SharedProps;

type ButtonLinkProps = React.ComponentProps<typeof Link> & SharedProps;

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wood-700 focus-visible:ring-offset-2",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wood-700 focus-visible:ring-offset-2",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
