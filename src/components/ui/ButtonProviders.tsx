import { ButtonHTMLAttributes } from "react";
import Image from "next/image";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  text: string;
  color: string;
  textColor: string;
  showSeparator?: boolean;
  separatedText?: string;
}

export default function ButtonProvidersComponent({
  icon,
  text,
  color,
  textColor,
  showSeparator,
  separatedText = "Atau",
  ...props
}: Props) {
  return (
    <div>
      <button
        className="flex w-full items-center justify-center gap-x-3 rounded-lg py-2 font-sans text-[14px] font-normal"
        style={{
          backgroundColor: color,
          color: textColor,
        }}
        {...props}
      >
        <Image
          src={icon}
          alt={text}
          width={50}
          height={50}
          className="size-6"
        />
        {text}
      </button>
      {showSeparator && (
        <p className="my-4 text-center font-sans text-[12px] font-normal">
          {separatedText}
        </p>
      )}
    </div>
  );
}
