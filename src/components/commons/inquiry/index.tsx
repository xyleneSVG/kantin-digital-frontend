"use client";

import { useRouter } from "next/navigation";
import { Home, MapPin, Store, CreditCard, Clock } from "lucide-react";
import { useState } from "react";

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess?: () => void;
          onPending?: () => void;
          onError?: () => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

type PaymentStatus = "pending" | "paid";

// Simulasi data — ganti dengan props/store sesuai kebutuhan
const orderData = {
  orderId: "ORD-5G9K2XQ1",
  canteen: "Kantin A",
  items: [
    { name: "Paket Nasi Ayam Geprek", price: 12000 },
    { name: "Es Teh Manis Jumbo", price: 3000 },
  ],
  cashback: 0,
  biayaBungkus: 0,
};

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID").format(num);

export default function SuccessPage() {
  const router = useRouter();
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  // Ganti initial state sesuai status dari backend: "pending" | "paid"
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending");

  const isPaid = paymentStatus === "paid";

  const subtotal = orderData.items.reduce((acc, item) => acc + item.price, 0);
  const total = subtotal - orderData.cashback + orderData.biayaBungkus;

  // Warna tema berdasarkan status
  const theme = {
    bg: isPaid ? "bg-[#f0f4f2]" : "bg-[#fff8f3]",
    blob: isPaid ? "bg-primary/10" : "bg-orange-400/10",
    pingRing1: isPaid ? "bg-primary/10" : "bg-orange-400/10",
    pingRing2: isPaid ? "bg-primary/15" : "bg-orange-400/15",
    iconBg: isPaid ? "bg-primary shadow-primary/30" : "bg-orange-400 shadow-orange-400/30",
    badgeBg: isPaid ? "bg-primary/10" : "bg-orange-100",
    badgeDot: isPaid ? "bg-primary" : "bg-orange-400",
    badgeText: isPaid ? "text-primary" : "text-orange-500",
    storeBg: isPaid ? "bg-primary/10" : "bg-orange-100",
    storeIcon: isPaid ? "text-primary" : "text-orange-400",
    itemIconBg: isPaid ? "bg-primary/10" : "bg-orange-100",
    priceText: isPaid ? "text-primary" : "text-orange-500",
    totalText: isPaid ? "text-primary" : "text-orange-500",
    infoBanner: isPaid ? "bg-primary/5" : "bg-orange-50",
    payBtn: isPaid
      ? "bg-primary shadow-primary/25"
      : "bg-orange-400 shadow-orange-400/25",
  };

  const handleMidtransPayment = async () => {
    setIsLoadingPayment(true);
    try {
      const res = await fetch("/api/payment/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.orderId,
          amount: total,
          items: orderData.items,
        }),
      });

      const { token } = await res.json();

      if (!window.snap) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://app.midtrans.com/snap/snap.js";
          script.setAttribute(
            "data-client-key",
            process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ""
          );
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Gagal memuat Midtrans"));
          document.head.appendChild(script);
        });
      }

      window.snap.pay(token, {
        onSuccess: () => {
          setPaymentStatus("paid");
        },
        onPending: () => {
          setPaymentStatus("pending");
        },
        onError: () => {
          alert("Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: () => {
          setIsLoadingPayment(false);
        },
      });
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoadingPayment(false);
    }
  };

  return (
    <div className={`relative flex min-h-screen flex-col items-center justify-between overflow-hidden font-sans transition-colors duration-500 ${theme.bg}`}>

      {/* Decorative blobs */}
      <div className={`pointer-events-none absolute -top-20 -left-20 size-64 rounded-full blur-3xl transition-colors duration-500 ${theme.blob}`} />
      <div className={`pointer-events-none absolute -right-16 top-32 size-48 rounded-full blur-2xl transition-colors duration-500 ${theme.blob}`} />

      {/* Main content */}
      <div className="flex w-full max-w-md flex-1 flex-col items-center px-5 pt-16 pb-8">

        {/* Status Icon */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className={`absolute size-32 animate-ping rounded-full transition-colors duration-500 ${theme.pingRing1}`} style={{ animationDuration: "2s" }} />
          <div className={`absolute size-24 animate-ping rounded-full transition-colors duration-500 ${theme.pingRing2}`} style={{ animationDuration: "2s", animationDelay: "0.3s" }} />
          <div className={`relative flex size-20 items-center justify-center rounded-full shadow-lg transition-colors duration-500 ${theme.iconBg}`}>
            {isPaid ? (
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path
                  d="M8 18L15 25L28 11"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="30"
                  strokeDashoffset="0"
                  style={{ animation: "drawCheck 0.5s ease-out forwards" }}
                />
              </svg>
            ) : (
              <Clock size={32} color="white" strokeWidth={2.5} />
            )}
          </div>
        </div>

        {/* Title */}
        <div className="mb-8 flex flex-col items-center gap-1 text-center">
          <h1 className="text-[22px] font-extrabold tracking-tight text-gray-900">
            {isPaid ? "Pembayaran Berhasil!" : "Menunggu Pembayaran"}
          </h1>
          <p className="mb-2 text-[12px] text-gray-400">
            {isPaid
              ? "Pesananmu sudah dikonfirmasi"
              : "Selesaikan pembayaran untuk melanjutkan"}
          </p>
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors duration-500 ${theme.badgeBg}`}>
            <span className={`size-1.5 rounded-full transition-colors duration-500 ${theme.badgeDot}`} />
            <p className={`text-[12px] font-semibold transition-colors duration-500 ${theme.badgeText}`}>
              Order ID: {orderData.orderId}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-md shadow-black/5">

          {/* Canteen header */}
          <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-2xl transition-colors duration-500 ${theme.storeBg}`}>
              <Store size={18} className={`transition-colors duration-500 ${theme.storeIcon}`} />
            </div>
            <div>
              <p className="text-[14px] font-bold text-gray-900">{orderData.canteen}</p>
              <p className="text-[11px] text-gray-400">
                {isPaid ? "Pesananmu sudah diterima" : "Menunggu konfirmasi pembayaran"}
              </p>
            </div>
          </div>

          {/* Per-item cards */}
          <div className="flex flex-col gap-2 px-4 py-4">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Rincian Pesanan
            </p>
            {orderData.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`flex size-7 items-center justify-center rounded-full text-[13px] transition-colors duration-500 ${theme.itemIconBg}`}>
                    🍽️
                  </span>
                  <p className="text-[13px] font-semibold text-gray-800">{item.name}</p>
                </div>
                <p className={`shrink-0 text-[13px] font-bold transition-colors duration-500 ${theme.priceText}`}>
                  Rp {formatRupiah(item.price)}
                </p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="flex flex-col gap-2 border-t border-dashed border-gray-200 px-5 py-4">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Ringkasan
            </p>
            <div className="flex items-center justify-between text-[13px] text-gray-500">
              <span>Subtotal</span>
              <span className="font-medium text-gray-700">Rp {formatRupiah(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-[13px] text-gray-500">
              <span>Cashback</span>
              <span className="font-medium text-gray-700">Rp {formatRupiah(orderData.cashback)}</span>
            </div>
            <div className="flex items-center justify-between text-[13px] text-gray-500">
              <span>Biaya pembungkusan</span>
              <span className="font-medium text-gray-700">Rp {formatRupiah(orderData.biayaBungkus)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-2">
              <span className="text-[14px] font-extrabold text-gray-900">Total</span>
              <span className={`text-[15px] font-extrabold transition-colors duration-500 ${theme.totalText}`}>
                Rp {formatRupiah(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div className={`mt-4 mb-6 flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition-colors duration-500 ${theme.infoBanner}`}>
          <span className="text-xl">{isPaid ? "⏱️" : "💳"}</span>
          <div>
            <p className="text-[12px] font-bold text-gray-800">
              {isPaid ? "Estimasi siap" : "Belum dibayar"}
            </p>
            <p className="text-[11px] text-gray-500">
              {isPaid
                ? "Pesananmu sedang diproses oleh kantin"
                : "Tap tombol di bawah untuk menyelesaikan pembayaran"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3">
          {!isPaid && (
            <button
              onClick={handleMidtransPayment}
              disabled={isLoadingPayment}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[14px] font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 ${theme.payBtn}`}
            >
              {isLoadingPayment ? (
                <>
                  <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memproses...
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  Bayar Sekarang
                </>
              )}
            </button>
          )}

          <button
            onClick={() => router.push("/activity")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-4 text-[14px] font-bold text-gray-700 transition-all active:scale-95"
          >
            <MapPin size={16} />
            Lacak Pesanan
          </button>

          <button
            onClick={() => router.push("/")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[14px] font-semibold text-gray-500 transition-all active:scale-95"
          >
            <Home size={15} />
            Kembali ke Beranda
          </button>
        </div>
      </div>

      <style>{`
        @keyframes drawCheck {
          from { stroke-dashoffset: 30; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
} 