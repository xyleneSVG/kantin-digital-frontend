import { ICON } from "@/src/constants/assets";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/src/lib/utils";

interface Props {
  variant: "default" | "type2";
  item: {
    id: string;
    image: string;
    name: string;
    rating?: number;
  };
}

export function CardMenuComponent({ item, variant }: Props) {
  return (
    <Link
      href={item.id}
      className={cn(
        "flex w-full items-center overflow-hidden",
        variant === "default" && "flex-row gap-x-3.5 rounded-sm bg-secondary px-3 py-1.5",
        variant === "type2" && "flex-col justify-center gap-y-1.5 rounded-xl bg-cream py-3 px-1 hover:bg-cream/80 transition-colors"
      )}
    >
      <Image
        src={item.image}
        alt={item.name || "Kategori"}
        width={1920}
        height={1920}
        className={cn(
          variant === "default" && "size-12 rounded-md object-cover",
          variant === "type2" && "size-6 object-contain"
        )}
      />
      <div
        className={cn(
          "flex flex-col font-sans font-medium",
          variant === "default" && "gap-y-2",
          variant === "type2" && "items-center font-normal"
        )}
      >
        <p
          className={cn(
            "text-[14px]",
            variant === "type2" && "text-center text-[13px] text-gray-800"
          )}
        >
          {item.name}
        </p>
        <div
          className={cn(
            "flex flex-row items-center gap-x-2.5",
            variant === "type2" && "hidden"
          )}
        >
          <Image
            src={ICON.STAR}
            alt="Star"
            width={1920}
            height={1920}
            className="size-3.5"
          />
          <p className="text-[12px]">{item.rating}/5.0</p>
        </div>
      </div>
    </Link>
  );
}