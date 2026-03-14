import { cn } from "@/src/lib/utils";
import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  placeholder: string;
  inputType: string;
  inputName: string;
}

export default function InputComponent({
  className,
  placeholder,
  inputType,
  inputName,
  ...props
}: Props) {
  return (
    <div className="mb-6">
      <p className="font-regular mb-2 font-sans text-[12px]">{placeholder}</p>
      <input
        type={inputType}
        name={inputName}
        id={inputName}
        className={cn(
          "bg-disabled focus:border-primary focus:ring-primary h-10 w-full rounded-lg px-3 outline-none focus:ring-2 focus:outline-none",
          className,
        )}
        {...props}
      />
    </div>
  );
}
