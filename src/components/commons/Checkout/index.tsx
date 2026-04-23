"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, ChevronRight, Tag } from "lucide-react";
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

  const biayaBungkus = 0;
  const cashback = 0;
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
        className="flex min-h-[calc(100vh-69px)] flex-col overflow-y-auto bg-[#f0f2f5] pb-40"
      >
        <div className="flex flex-1 flex-col gap-3 px-4 pt-4">
          {/* Cart Items Card */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3.5">
              <ShoppingCart size={15} className="text-primary" />
              <h2 className="text-[13px] font-bold text-gray-800">Kantin A</h2>
              {cartItems.length > 0 && (
                <span className="bg-primary/10 text-primary ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold">
                  {cartItems.length} item
                </span>
              )}
            </div>

            <div className="flex flex-col divide-y divide-gray-50 px-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-4">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-primary text-[12px] font-bold">
                      Rp {item.price}
                    </p>
                    {item.note && (
                      <p className="mt-0.5 truncate text-[10px] text-gray-400 italic">
                        {item.note}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => decreaseQty(canteenId, item.id)}
                      className="border-primary/50 bg-primary/5 text-primary flex size-7 items-center justify-center rounded-full border transition-all active:scale-90"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="min-w-5 text-center text-[13px] font-bold text-gray-900">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => increaseQty(canteenId, item.id)}
                      className="bg-primary flex size-7 items-center justify-center rounded-full text-white shadow-sm transition-all active:scale-90"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}

              {cartItems.length === 0 && (
                <p className="py-8 text-center text-[13px] text-gray-400">
                  Keranjang kamu masih kosong.
                </p>
              )}
            </div>
          </div>

          {/* Cashback Banner */}
          <div className="bg-primary/10 flex items-center gap-3 rounded-2xl px-4 py-3">
            <span className="text-xl">🎉</span>
            <div className="flex-1">
              <p className="text-primary text-[12px] font-bold">
                Cashback aktif!
              </p>
              <p className="text-primary/70 text-[11px]">
                Hemat Rp {formatRupiah(cashback)} untuk pesanan ini
              </p>
            </div>
            <Tag size={14} className="text-primary/50" />
          </div>

          {/* Summary Card */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3.5">
              <h3 className="text-[13px] font-bold text-gray-800">
                Ringkasan Pembayaran
              </h3>
            </div>

            <div className="flex flex-col gap-2.5 px-4 py-4">
              <div className="flex items-center justify-between text-[13px] text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">Rp {formatRupiah(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[13px] text-gray-600">
                <span>Biaya bungkus</span>
                <span className="font-medium">
                  Rp {formatRupiah(biayaBungkus)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px] text-green-600">
                <span>Cashback</span>
                <span className="font-semibold">
                  - Rp {formatRupiah(cashback)}
                </span>
              </div>

              <div className="my-0.5 border-t border-dashed border-gray-200" />

              <div className="flex items-center justify-between">
                <span className="text-[14px] font-bold text-gray-900">
                  Total
                </span>
                <span className="text-primary text-[16px] font-extrabold">
                  Rp {formatRupiah(total > 0 ? total : 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Sticky Bottom Bar */}
      <div className="bg-secondary fixed right-0 bottom-0 left-0 z-50 mx-auto w-full max-w-md border-t border-gray-100 px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-[11px] text-gray-400">Total Pembayaran</p>
            <p className="text-primary text-[18px] font-extrabold">
              Rp {formatRupiah(total > 0 ? total : 0)}
            </p>
          </div>
          <button
            onClick={() => router.push(`/kantin/${canteenId}/checkout/payment`)}
            className="bg-primary flex items-center gap-2 rounded-xl px-6 py-3.5 text-[14px] font-bold text-white shadow-md transition-all hover:bg-[#5aa387] active:scale-95"
          >
            Pesan Sekarang
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
