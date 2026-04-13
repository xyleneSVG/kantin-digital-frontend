import { cn } from "@/src/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  icon: React.ElementType;
  title: string;
  href?: string; 
  onClick?: () => void;
  useChevron?: boolean;
  className?: string;
}

export function SelectionItemComponent({
  icon: Icon,
  title,
  href,
  onClick,
  useChevron = true,
  className,
}: Props) {
  const innerContent = (
    <>
      <div className="flex items-center gap-x-2.5">
        <Icon className="size-5" /> {/* size-5 sama dengan w-5 h-5 (20px) */}
        <p className="text-[12px]">{title}</p>
      </div>

      {useChevron && <ChevronRight className="size-4" />}
    </>
  );

  const baseClasses = cn(
    "bg-background flex w-full items-center justify-between px-4 py-2 font-medium cursor-pointer",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses} onClick={onClick}>
        {innerContent}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={baseClasses} type="button">
      {innerContent}
    </button>
  );
}