import { cn } from "@/src/lib/utils";
import { HTMLAttributes } from "react";

interface MultilineTextProps extends HTMLAttributes<HTMLParagraphElement> {
  text: string;
}

export function MultilineTextComponent({ text, className, ...props }: MultilineTextProps) {
  if (!text) return null;

  return (
    <p className={cn(className)} {...props}>
      {text.split("\n").map((line, i) => (
        <span key={i}>
          {line}
          <br />
        </span>
      ))}
    </p>
  );
}