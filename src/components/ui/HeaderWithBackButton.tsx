"use client"

import { cn } from "@/src/lib/utils";
import { ArrowLeft } from "lucide-react";

interface Props {
  className?: string;
  title: string;
}

export function HeaderWithBackButtonComponent({ className, title }: Props) {
  return (
    <div
      className={cn(
        `text-primary-foreground relative flex max-w-90 mx-auto items-center justify-center font-mono`,
        className,
      )}
    >
      <ArrowLeft
        className="absolute left-0 size-5"
        onClick={() => history.back()}
      />
      <span className="font-mono text-[16px] font-semibold">{title}</span>
    </div>
  );
}
