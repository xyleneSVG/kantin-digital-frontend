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
        `border-primary bg-primary-foreground relative mx-auto flex h-10 w-82 flex-col justify-center rounded-[20px] border`,
        classNameContainer,
      )}
    >
      <div className={cn(`flex flex-row justify-around px-4`, classNameContent)}>
        <input
          type="text"
          className={cn(
            `w-65 font-sans text-[14px] outline-none`,
            classNameInput,
          )}
          placeholder="Lagi mau mamam apa?"
        />
        <SearchIcon className={cn(`text-primary size-5`, classNameIcon)} />
      </div>
    </div>
  );
}
