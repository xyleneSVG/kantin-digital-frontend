import { OrderItemsProps } from "@/src/types/DetailOrder";

export default function OrderItems({ items }: OrderItemsProps) {
  return (
    <div className="mt-6 px-5">
      <h3 className="mb-3 text-[15px] font-semibold text-gray-800">
        Pesanan Kamu
      </h3>
      <div className="flex flex-col gap-y-2.5 text-[13px] font-light text-gray-600">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <p>
              {item.qty}x {item.name}
            </p>
            <p className="text-gray-800">Rp {item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
