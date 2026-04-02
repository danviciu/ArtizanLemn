import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoSize = "sm" | "md" | "lg";

type BrandLogoProps = {
  size?: BrandLogoSize;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

const sizeClasses: Record<BrandLogoSize, string> = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-24 w-24",
};

export function BrandLogo({
  size = "md",
  className,
  imageClassName,
  priority = false,
}: BrandLogoProps) {
  return (
    <span
      className={cn(
        "relative block overflow-hidden rounded-2xl border border-wood-900/18 bg-[#0a0705] shadow-[0_14px_28px_-22px_rgba(20,12,8,0.95)]",
        sizeClasses[size],
        className,
      )}
    >
      <Image
        src="/images/logo/artizan-lemn-mark.png"
        alt="Artizan Lemn logo"
        fill
        sizes="96px"
        quality={100}
        className={cn(
          "object-contain object-center p-[2px] brightness-110 contrast-125",
          imageClassName,
        )}
        priority={priority}
      />
    </span>
  );
}
