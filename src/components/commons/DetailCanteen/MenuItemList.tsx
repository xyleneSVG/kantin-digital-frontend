import Image from "next/image";
import { Plus } from "lucide-react";
import { MenuItemType } from "@/src/types/DetailCanteen";

type Props = MenuItemType & {
  onAdd: () => void;
};

export default function MenuItemList({ title, description, price, image, onAdd }: Props) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-secondary p-2.5">
      <div className="flex items-center gap-x-3">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
        <div className="flex flex-col">
          <p className="text-[14px] font-medium text-gray-900">{title}</p>
          {description && (
            <p className="text-[11px] leading-snug text-gray-600 line-clamp-2 pr-2">{description}</p>
          )}
          <p className="mt-1 text-[13px] font-semibold text-[#6BBA9C]">Rp {price}</p>
        </div>
      </div>
      <button 
        onClick={onAdd}
        className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#6BBA9C] text-white hover:bg-[#5aa387] active:scale-95 transition-all"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}