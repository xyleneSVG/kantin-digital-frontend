import { STATUS_COLOR_MAP } from "@/src/constants/statusActivity";
import Image from "next/image";

export type CardItemProps = {
  data: {
    kantin: string;
    status: string;
    image: string;
    title: string;
    qty: number;
    price: string;
    date: string;
  };
};

export default function CardItem({ data }: CardItemProps) {
  const color = STATUS_COLOR_MAP[data.status] || { bg: "bg-gray-100", text: "text-gray-500" };
  
  const isHistory = data.status === "Selesai" || data.status === "Batal" || data.status === "Batak";
  const buttonText = isHistory ? "Pesan Lagi" : "Lacak Pesanan";

  return (
    <div className="bg-secondary flex h-full flex-col rounded-xl px-4 py-3 gap-y-4 shadow-sm border border-gray-100">
      <div className="flex flex-row items-center justify-between">
        <p className="text-[14px] font-medium">{data.kantin}</p>
        
        <p
          className={`w-max rounded-sm px-2 py-1 text-[10px] ${color.bg} ${color.text}`}
        >
          {data.status === "Batak" ? "Batal" : data.status}
        </p>
      </div>

      <div className="flex flex-row gap-x-3">
        <Image
          src={data.image}
          width={1920}
          height={1920}
          alt={data.title}
          className="size-16 rounded-md object-cover"
        />
        <div className="flex flex-col gap-y-1 justify-center">
          <p className="text-[14px] font-medium">{data.title}</p>
          <p className="text-[12px] font-light text-gray-700">
            {data.qty} Item - Rp {data.price}
          </p>
          <p className="text-[10px] font-light text-gray-500">
            {data.date}
          </p>
        </div>
      </div>

      <button className="bg-[#6BBA9C] text-white w-max self-end rounded-md px-4 py-1.5 text-[12px] font-semibold hover:opacity-90 transition-opacity">
        {buttonText}
      </button>
    </div>
  );
}