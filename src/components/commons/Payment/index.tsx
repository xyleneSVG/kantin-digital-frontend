"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/src/store/useCartStore";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { ModalComponent } from "../../ui";


export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const canteenId = params.id as string;

  const cart = useCartStore(
    (state) => state.carts[canteenId] || { items: [], count: 0 },
  );
  const cartItems = cart.items;
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const clearCart = useCartStore((state) => state.clearCart);

  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("syxpay");

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const priceNum = parseInt(item.price.replace(/[^0-9]/g, ""));
    return acc + priceNum * item.qty;
  }, 0);

  const biayaBungkus = 3000;
  const total = subtotal + biayaBungkus;

  const paymentMethods = [
    {
      id: "syxpay",
      label: "sYxpaY",
      image: "/icon/syxpay.svg", 
    },
    {
      id: "gopay",
      label: "Gopay",
      image: "/icon/gopay.svg", 
    },
    {
      id: "spay",
      label: "Spay",
      image: "/icon/shoope.svg", 
    },
    {
      id: "qris",
      label: "", 
      image: "/icon/qris.svg", 
    },
  ];

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#333] p-5 text-white">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
          <p className="text-[14px]">Keranjang belanja kosong.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-sm font-semibold text-primary"
          >
            Kembali ke Kantin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden font-sans">
      <div className="z-10 flex flex-col items-center justify-center">
        <div className="relative flex w-full flex-grow-0 flex-col bg-secondary p-6 drop-shadow-xl">
          <div className="relative mb-5 flex items-center justify-center border-b border-gray-300 pb-4">
            <button
              onClick={() => router.back()}
              className="absolute left-0 text-gray-800 transition-transform active:scale-95"
            >
              <ArrowLeft size={22} />
            </button>
            <h2 className="text-center text-[16px] font-bold text-gray-900">
              Detail Pesanan
            </h2>
          </div>

          <div className="no-scrollbar mb-8 flex max-h-[160px] flex-col gap-y-5 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-x-3"
              >
                <div className="flex items-center gap-x-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-gray-200">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[13px] font-semibold text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-[12px] font-bold text-primary">
                      Rp {item.price}
                    </p>
                    {item.note && (
                      <p className="mt-0.5 text-[10px] text-gray-500">
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-x-2.5">
                  <button
                    onClick={() => decreaseQty(canteenId, item.id)}
                    className="flex size-6 items-center justify-center rounded-full border border-primary bg-transparent text-primary"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="min-w-4 text-center text-[13px] font-semibold text-gray-900">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => increaseQty(canteenId, item.id)}
                    className="flex size-6 items-center justify-center rounded-full bg-primary text-white"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 className="mt-2 mb-4 text-[14px] font-bold text-gray-900">
            Metode Pembayaran
          </h3>
          <div className="mb-8 flex flex-col gap-y-4">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className="flex cursor-pointer items-center gap-x-3"
              >
                <div
                  className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                    selectedPayment === method.id
                      ? "border-primary"
                      : "border-gray-400"
                  }`}
                >
                  {selectedPayment === method.id && (
                    <div className="size-2.5 rounded-full bg-primary" />
                  )}
                </div>
                
                <div className="flex items-center gap-x-3">
                  <div className={`relative shrink-0 ${!method.label ? "w-15 h-7" : "size-7"}`}>
                    <Image 
                      src={method.image} 
                      alt={method.id} 
                      fill 
                      className="object-contain object-left" 
                    />
                  </div>
                  
                  {method.label && (
                    <span className="text-[13px] font-medium text-gray-800">
                      {method.label}
                    </span>
                  )}
                </div>

                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={selectedPayment === method.id}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="hidden"
                />
              </label>
            ))}
          </div>

          <div className="mb-12 border-t border-dashed border-gray-400 pt-5">
            <h3 className="mb-3 text-[14px] font-bold text-gray-900">
              Ringkasan
            </h3>
            <div className="flex flex-col gap-y-2 text-[13px]">
              <div className="flex items-center justify-between text-gray-700">
                <p>Subtotal</p>
                <p>Rp {formatRupiah(subtotal)}</p>
              </div>
              <div className="flex items-center justify-between text-gray-700">
                <p>Biaya bungkus</p>
                <p>Rp {formatRupiah(biayaBungkus)}</p>
              </div>
              <div className="mt-1 flex items-center justify-between border-t border-gray-200 pt-1.5">
                <p className="text-[14px] font-bold text-gray-900">Total</p>
                <p className="text-[14px] font-bold text-primary">
                  Rp {formatRupiah(total)}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full rounded-xl bg-primary py-4 text-[14px] font-semibold text-white shadow-lg transition-colors hover:bg-[#5aa387] active:scale-[0.98]"
          >
            Pesan Sekarang
          </button>
        </div>

        <div className="relative z-0 -mt-[1px] flex h-6 w-full max-w-[350px] overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="relative h-full flex-1 bg-[#F5F3EC]"
              style={{
                maskImage:
                  "radial-gradient(circle at 50% 100%, transparent 50%, black 51%)",
                WebkitMaskImage:
                  "radial-gradient(circle at 50% 100%, transparent 50%, black 51%)",
              }}
            />
          ))}
        </div>
      </div>

      <ModalComponent
        type="order"
        isOpen={showModal}
        title="Konfirmasi Pesanan"
        message="Apakah kamu yakin ingin memesan ini? Pastikan pesananmu sudah benar."
        highlight="Pesanan yang sudah dipesan tidak dapat dibatalkan"
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false);
          clearCart(canteenId);
          router.push("/activity/success");
        }}
      />
    </div>
  );
}