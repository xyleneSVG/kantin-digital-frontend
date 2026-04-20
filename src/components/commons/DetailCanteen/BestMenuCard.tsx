import Image from "next/image";
import { Plus } from "lucide-react";
import React from "react";

interface BestMenuProps {
  id: string;
  title: string;
  price: string;
  image: string;
  onClick?: () => void;
  onAdd: (e: React.MouseEvent) => void;
}

export default function BestMenuCard({
  title,
  price,
  image,
  onClick,
  onAdd,
}: BestMenuProps) {
  return (
    <div
      onClick={onClick}
      className="flex min-w-[140px] cursor-pointer flex-col rounded-2xl bg-[#F5F3EC] p-3 shadow-sm transition-transform active:scale-[0.98]"
    >
      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      
      <h3 className="text-[13px] font-bold text-gray-900">{title}</h3>
      
      <div className="mt-2 flex items-center justify-between">
        <p className="text-[13px] font-bold text-[#6BBA9C]">Rp {price}</p>
        <button
          onClick={onAdd}
          className="flex size-6 items-center justify-center rounded-full bg-[#6BBA9C] text-white active:scale-95"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}