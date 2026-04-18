"use client";

import Image from "next/image";
import { Minus, Plus, Ticket } from "lucide-react";
import { Container, HeaderWithBackButtonComponent } from "@/src/components/ui";
import { useCartStore } from "@/src/store/useCartStore";

export default function CheckoutPage() {
  const { cartItems, increaseQty, decreaseQty } = useCartStore();

  const subtotal = cartItems.reduce((acc, item) => {
    const priceNum = parseInt(item.price.replace(/[^0-9]/g, ''));
    return acc + (priceNum * item.qty);
  }, 0);

  const biayaBungkus = 3000;
  const cashback = 5000;
  const total = subtotal + biayaBungkus - cashback;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  return (
    <div className="bg-background-dark h-screen relative font-sans">
      <HeaderWithBackButtonComponent
        className={"pt-5 pb-6.25"}
        title={"Keranjang Saya"}
      />

      <Container
        needPadding={false}
        type="round"
        className="bg-white min-h-[calc(100vh-69px)] pt-6 pb-40 flex flex-col overflow-y-auto"
      >
        <div className="px-4 flex flex-col flex-1">
          
          <h2 className="font-bold text-[16px] text-gray-900 mb-4">Kantin A</h2>

          <div className="flex flex-col gap-y-3 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-[#F5F5F5] rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-x-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[14px] font-semibold text-gray-900">{item.title}</p>
                    <p className="text-[13px] font-bold text-[#6BBA9C]">Rp {item.price}</p>
                    {item.note && (
                      <p className="text-[11px] text-gray-500 mt-0.5">{item.note}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-x-3">
                  <button 
                    onClick={() => decreaseQty(item.id)}
                    className="flex size-6 items-center justify-center rounded-md border border-gray-300 bg-transparent text-gray-700"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-[14px] font-semibold text-gray-900">{item.qty}</span>
                  <button 
                    onClick={() => increaseQty(item.id)}
                    className="flex size-6 items-center justify-center rounded-md bg-[#6BBA9C] text-white"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}

            {cartItems.length === 0 && (
              <p className="text-center text-gray-500 py-4 text-sm">Keranjang kamu masih kosong.</p>
            )}
          </div>

          <div className="flex flex-col gap-y-2.5 text-[13px] text-gray-600">
            <div className="flex justify-between items-center">
              <p>Subtotal</p>
              <p className="font-medium text-gray-900">Rp {formatRupiah(subtotal)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Biaya bungkus</p>
              <p className="font-medium text-gray-900">Rp {formatRupiah(biayaBungkus)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Cashback</p>
              <p className="font-medium text-gray-900">-Rp {formatRupiah(cashback)}</p>
            </div>
            <div className="flex justify-between items-center pt-2 mt-1 border-t border-gray-100">
              <p className="font-bold text-gray-900 text-[14px]">Total</p>
              <p className="font-bold text-[#6BBA9C] text-[14px]">Rp {formatRupiah(total > 0 ? total : 0)}</p>
            </div>
          </div>
        </div>
      </Container>

      <div className="fixed bottom-17.5 left-0 right-0 mx-auto w-full max-w-md bg-secondary rounded-t-2xl px-4 py-4 flex items-center justify-between shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50">
        <div className="flex flex-col">
          <p className="text-[12px] text-gray-800 font-medium mb-0.5">Total Bayar</p>
          <p className="text-[18px] font-bold text-[#6BBA9C]">Rp {formatRupiah(total > 0 ? total : 0)}</p>
        </div>
        <button className="bg-[#6BBA9C] text-white px-6 py-2.5 rounded-lg text-[14px] font-semibold hover:bg-[#5aa387] transition-colors shadow-md">
          Pesan Sekarang
        </button>
      </div>

    </div>
  );
}