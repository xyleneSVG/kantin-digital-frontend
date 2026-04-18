import { OrderHeaderProps } from "@/src/types/DetailOrder";

export default function OrderHeader({
  kantinName,
  sellerName,
  orderId,
  estimation,
}: OrderHeaderProps) {
  return (
    <div className="mx-4 flex items-center justify-between rounded-xl bg-[#6BBA9C] p-4 text-white shadow-sm">
      <div>
        <h2 className="text-[12px] font-medium">
          {kantinName} - {sellerName}
        </h2>
        <p className="mt-2 text-[10px] font-light">Order ID: {orderId}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-light">Estimasi</p>
        <p className="mt-2 text-[12px] font-medium">{estimation}</p>
      </div>
    </div>
  );
}
