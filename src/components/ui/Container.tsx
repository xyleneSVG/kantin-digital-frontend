import { cn } from "@/src/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
  type?: "default" | "round";
  needPadding?: boolean
}

export function Container({
  className,
  children,
  type = "default",
  needPadding = true,
}: Props) {
  const isRound = type === "round";

  if (isRound) {
    return (
      <div className={cn("w-full rounded-t-3xl", className)}>
        {needPadding ? (
          <div className="mx-auto max-w-84">{children}</div>
        ) : (
          children
        )}
      </div>
    );
  }

  return (
    <div className={cn(needPadding && "mx-auto max-w-84", className)}>
      {children}
    </div>
  );
}
