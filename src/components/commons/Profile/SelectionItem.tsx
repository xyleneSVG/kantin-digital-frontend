import { cn } from "@/src/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  icon: React.ElementType;
  title: string;
  href: string;
  useChevron?: boolean;
  className?: string;
}

export function SelectionItemComponent({
  icon: Icon,
  title,
  href,
  useChevron = true,
  className,
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        `bg-background flex w-full items-center justify-between px-4 py-2 font-medium`,
        className,
      )}
    >
      <div className="flex items-center gap-x-2.5">
        <Icon className="text-[20px]" />
        <p className="text-[12px]">{title}</p>
      </div>

      {useChevron && <ChevronRight className="text-[14px]" />}
    </Link>
  );
}
