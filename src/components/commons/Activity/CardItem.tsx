import { STATUS_COLOR_MAP } from "@/src/constants/statusActivity";
import Image from "next/image";
import Link from "next/link";

export type CardItemProps = {
  data: {
    kantin: string;
    status: string;
    image: string;
    title: string;
    qty: number;
    price: string;
    date: string;
    idPesanan?: string;
  };
};

export default function CardItem({ data }: CardItemProps) {
  const color = STATUS_COLOR_MAP[data.status] || {
    bg: "bg-gray-100",
    text: "text-gray-500",
  };

  const isHistory =
    data.status === "Selesai" ||
    data.status === "Batal" ||
    data.status === "Batak";
    
  const buttonText = isHistory ? "Pesan Lagi" : "Lacak Pesanan";
  
  const actionStyle = "w-max self-end rounded-md bg-[#6BBA9C] px-4 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90";

  return (
    <div className="bg-secondary flex h-full flex-col gap-y-4 rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
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
        <div className="flex flex-col justify-center gap-y-1">
          <p className="text-[14px] font-medium">{data.title}</p>
          <p className="text-[12px] font-light text-gray-700">
            {data.qty} Item - Rp {data.price}
          </p>
          <p className="text-[10px] font-light text-gray-500">{data.date}</p>
        </div>
      </div>

      {data.idPesanan ? (
        <Link href={`/activity/${data.idPesanan}`} className={actionStyle}>
          {buttonText}
        </Link>
      ) : (
        <button className={actionStyle}>
          {buttonText}
        </button>
      )}
    </div>
  );
}