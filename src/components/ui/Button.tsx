import { cn } from "@/src/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  text: string;
}

export function ButtonComponent({ className, text, ...props }: Props) {
  return (
    <button
      className={cn(
        "bg-primary text-primary-foreground w-full rounded-2xl py-2 font-mono text-[16px] font-bold",
        className,
        props.disabled && "opacity-60"
      )}
      {...props}
    >
      {text}
    </button>
  );
}
