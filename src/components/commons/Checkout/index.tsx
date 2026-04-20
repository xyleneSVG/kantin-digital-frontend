"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { Container, HeaderWithBackButtonComponent } from "@/src/components/ui";
import { useCartStore } from "@/src/store/useCartStore";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const canteenId = params.id as string;

  const cart = useCartStore(
    (state) => state.carts[canteenId] || { items: [], count: 0 },
  );
  const cartItems = cart.items;
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);

  const subtotal = cartItems.reduce((acc, item) => {
    const priceNum = parseInt(item.price.replace(/[^0-9]/g, ""));
    return acc + priceNum * item.qty;
  }, 0);

  const biayaBungkus = 3000;
  const cashback = 5000;
  const total = subtotal + biayaBungkus - cashback;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  return (
    <div className="bg-background-dark relative h-screen font-sans">
      <HeaderWithBackButtonComponent
        className={"pt-5 pb-6.25"}
        title={"Keranjang Saya"}
      />

      <Container
        needPadding={false}
        type="round"
        className="flex min-h-[calc(100vh-69px)] flex-col overflow-y-auto bg-white pt-6 pb-40"
      >
        <div className="flex flex-1 flex-col px-4">
          <h2 className="mb-4 text-[16px] font-bold text-gray-900">Kantin A</h2>

          <div className="mb-6 flex flex-col gap-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl bg-[#F5F5F5] p-3"
              >
                <div className="flex items-center gap-x-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[14px] font-semibold text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-[13px] font-bold text-[#6BBA9C]">
                      Rp {item.price}
                    </p>
                    {item.note && (
                      <p className="mt-0.5 text-[11px] text-gray-500">
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-x-3">
                  <button
                    onClick={() => decreaseQty(canteenId, item.id)}
                    className="flex size-6 items-center justify-center rounded-md border border-gray-300 bg-transparent text-gray-700"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-[14px] font-semibold text-gray-900">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => increaseQty(canteenId, item.id)}
                    className="flex size-6 items-center justify-center rounded-md bg-[#6BBA9C] text-white"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}

            {cartItems.length === 0 && (
              <p className="py-4 text-center text-sm text-gray-500">
                Keranjang kamu masih kosong.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-y-2.5 text-[13px] text-gray-600">
            <div className="flex items-center justify-between">
              <p>Subtotal</p>
              <p className="font-medium text-gray-900">
                Rp {formatRupiah(subtotal)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p>Biaya bungkus</p>
              <p className="font-medium text-gray-900">
                Rp {formatRupiah(biayaBungkus)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p>Cashback</p>
              <p className="font-medium text-gray-900">
                -Rp {formatRupiah(cashback)}
              </p>
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-2">
              <p className="text-[14px] font-bold text-gray-900">Total</p>
              <p className="text-[14px] font-bold text-[#6BBA9C]">
                Rp {formatRupiah(total > 0 ? total : 0)}
              </p>
            </div>
          </div>
        </div>
      </Container>

      <div className="bg-secondary fixed right-0 bottom-17.5 left-0 z-50 mx-auto flex w-full max-w-md items-center justify-between rounded-t-2xl px-4 py-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
          <p className="mb-0.5 text-[12px] font-medium text-gray-800">
            Total Bayar
          </p>
          <p className="text-[18px] font-bold text-[#6BBA9C]">
            Rp {formatRupiah(total > 0 ? total : 0)}
          </p>
        </div>
        <button
          onClick={() => router.push(`/kantin/${canteenId}/checkout/payment`)}
          className="rounded-lg bg-[#6BBA9C] px-6 py-2.5 text-[14px] font-semibold text-white shadow-md transition-colors hover:bg-[#5aa387]"
        >
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
}
