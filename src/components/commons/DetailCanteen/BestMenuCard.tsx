import Image from "next/image";
import { MenuItemType } from "@/src/types/DetailCanteen";

type BestMenuCardProps = MenuItemType & {
  onAdd: () => void;
};

export default function BestMenuCard({
  title,
  price,
  image,
  onAdd,
}: BestMenuCardProps) {
  return (
    <div className="bg-secondary flex min-w-30 flex-col rounded-xl">
      <div className="relative h-18 w-full overflow-hidden rounded-t-lg">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-2">
        <div className="mt-2 flex flex-col gap-y-1">
          <p className="text-[13px] font-medium text-gray-800">{title}</p>
          <p className="text-[12px] font-semibold text-[#6BBA9C]">Rp {price}</p>
        </div>
        <button
          onClick={onAdd}
          className="mt-3 w-full rounded-md bg-[#6BBA9C] py-1 text-white transition-all hover:bg-[#5aa387] active:scale-95"
        >
          +
        </button>
      </div>
    </div>
  );
}
