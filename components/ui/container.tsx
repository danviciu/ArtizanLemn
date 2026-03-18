import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentProps<"div">;

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1220px] px-6 md:px-10", className)}
      {...props}
    />
  );
}
