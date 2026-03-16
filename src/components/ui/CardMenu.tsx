import { ICON } from "@/src/constants/assets";
import Image from "next/image"

export function CardMenuComponent() {
  return (
    <div className="flex flex-col gap-y-2 font-sans font-medium">
      <p className="text-[14px]">Kantin Jono</p>
      <div className="flex flex-row items-center gap-x-2.5">
        <Image
          src={ICON.star}
          alt={""}
          width={1920}
          height={1920}
          className="size-3.5"
        />
        <p className="text-[12px]">4.9/5.0</p>
      </div>
    </div>
  );
}
