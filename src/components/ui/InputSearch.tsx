import { SearchIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Props {
  classNameContainer?: string;
  classNameContent?: string;
  classNameInput?: string;
  classNameIcon?: string;
}

export function InputSearchComponent({
  classNameContainer,
  classNameContent,
  classNameInput,
  classNameIcon,
}: Props) {
  return (
    <div
      className={cn(
        "relative mx-auto flex h-10 w-full items-center rounded-[20px] border border-primary bg-primary-foreground overflow-hidden",
        classNameContainer
      )}
    >
      <div className={cn("flex w-full flex-row items-center gap-x-2 px-4", classNameContent)}>
        <input
          type="text"
          className={cn(
            "w-full flex-1 bg-transparent font-sans text-[14px] outline-none",
            classNameInput
          )}
          placeholder="Lagi mau mamam apa?"
        />
        <SearchIcon className={cn("size-5 shrink-0 text-primary", classNameIcon)} />
      </div>
    </div>
  );
}