import { cn } from "@/src/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export function Container({ className, children }: Props) {
  return <div className={cn("mx-auto max-w-84", className)}>{children}</div>;
}
