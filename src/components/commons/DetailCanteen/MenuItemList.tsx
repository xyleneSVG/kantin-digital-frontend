import Image from "next/image";
import { Plus } from "lucide-react";
import React from "react";

interface MenuItemProps {
  id: string;
  title: string;
  description?: string;
  price: string;
  image: string;
  onClick?: () => void;
  onAdd: (e: React.MouseEvent) => void;
}

export default function MenuItemList({
  title,
  description,
  price,
  image,
  onClick,
  onAdd,
}: MenuItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center justify-between gap-x-3 rounded-2xl bg-[#F5F3EC] p-3 shadow-sm transition-transform active:scale-[0.98]"
    >
      <div className="flex items-center gap-x-3">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-[14px] font-bold text-gray-900">{title}</h3>
          {description && (
            <p className="mt-0.5 line-clamp-2 text-[11px] text-gray-500">
              {description}
            </p>
          )}
          <p className="mt-1 text-[13px] font-bold text-[#6BBA9C]">
            Rp {price}
          </p>
        </div>
      </div>
      
      <button
        onClick={onAdd}
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#6BBA9C] text-white active:scale-95"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}