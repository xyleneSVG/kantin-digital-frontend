import { cn } from "@/src/lib/utils";
import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  classNameContainer?: string;
  classNamePlaceholder?: string;
  classNameInput?: string;
  placeholder: string;
  inputType: string;
  inputName: string;
}

export function InputComponent({
  classNameInput,
  classNameContainer,
  classNamePlaceholder,
  placeholder,
  inputType,
  inputName,
  ...props
}: Props) {
  return (
    <div className={cn(`mb-6`, classNameContainer)}>
      <p
        className={cn(
          `font-regular mb-2 font-sans text-[12px]`,
          classNamePlaceholder,
        )}
      >
        {placeholder}
      </p>
      <input
        type={inputType}
        name={inputName}
        id={inputName}
        className={cn(
          "bg-disabled focus:border-primary focus:ring-primary h-10 w-full rounded-lg px-3 outline-none focus:ring-2 focus:outline-none",
          classNameInput,
        )}
        {...props}
      />
    </div>
  );
}
