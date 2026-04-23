// NOTE: This edit is on DetailCanteenPage.tsx, not PaymentPage
"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/src/store/useCartStore";
import {
  ArrowLeft,
  Minus,
  Plus,
  Receipt,
  Wallet,
  ChevronRight,
  ShoppingBag,
  Banknote,
  CreditCard,
  Tag,
} from "lucide-react";
import { ModalComponent } from "../../ui";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const canteenId = params.id as string;

  const cartItems = useCartStore((state) => state.carts[canteenId]?.items);
  const items = cartItems ?? [];
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const clearCart = useCartStore((state) => state.clearCart);

  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("non-tunai");
  const [loading, setLoading] = useState(false);

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID").format(num);

  const toNumber = (value: string | number) =>
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^0-9]/g, "")) || 0;

  const subtotal = items.reduce(
    (acc, item) => acc + toNumber(item.price) * item.qty,
    0,
  );

  const biayaBungkus = 0;
  const total = subtotal + biayaBungkus;

  const paymentMethods = [
    {
      id: "tunai",
      label: "Tunai",
      description: "Bayar di kasir",
      icon: Banknote,
      comingSoon: true,
    },
    {
      id: "non-tunai",
      label: "Non-Tunai",
      description: "QRIS · e-wallet · transfer",
      icon: CreditCard,
      comingSoon: false,
    },
  ];

  const getAuth = () => {
    if (typeof window === "undefined") return null;
    return {
      api_key: localStorage.getItem("api_key"),
      api_secret: localStorage.getItem("api_secret"),
      user: JSON.parse(localStorage.getItem("current_user") || "null"),
    };
  };

  const handleCreateInvoice = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const res = await fetch("/api/create-sales-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: auth?.api_key,
          api_secret: auth?.api_secret,
          customer: auth?.user?.customer_profile || "guest",
          posting_date: new Date().toISOString().split("T")[0],
          company: decodeURIComponent(canteenId),
          mode_of_payment: selectedPayment,
          items: items.map((i) => ({ item_code: i.id, qty: i.qty })),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const invoiceId = data?.data?.sales_invoice_id;
      if (!invoiceId) throw new Error("Invoice ID tidak ditemukan");
      clearCart(canteenId);
      router.push(
        `/kantin/${canteenId}/checkout/payment/${encodeURIComponent(invoiceId)}`,
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  /* ── Empty State ── */
  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f8fa] p-6">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex size-24 items-center justify-center rounded-3xl bg-white shadow-md">
            <ShoppingBag size={40} className="text-gray-300" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[16px] font-bold text-gray-800">
              Keranjang Kosong
            </p>
            <p className="text-[13px] text-gray-400">
              Belum ada item yang ditambahkan
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="bg-primary mt-1 rounded-2xl px-8 py-3 text-[13px] font-bold text-white shadow-sm transition-transform active:scale-95"
          >
            Kembali ke Kantin
          </button>
        </div>
      </div>
    );
  }

  /* ── Main ── */
  return (
    <div className="relative flex min-h-screen flex-col bg-[#f7f8fa] font-sans">
      {/* ── Header ── */}
      <div className="sticky top-0 z-20 border-b border-gray-100 bg-white/90 px-4 py-3.5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex size-9 items-center justify-center rounded-full bg-gray-100 transition-colors active:bg-gray-200"
          >
            <ArrowLeft size={17} />
          </button>
          <div className="flex flex-col">
            <h2 className="text-[15px] leading-tight font-bold text-gray-900">
              Detail Pesanan
            </h2>
            <p className="text-[11px] text-gray-400">
              {items.length} item dipilih
            </p>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col gap-3 px-4 py-4 pb-36">
        {/* ── Cart Items Card ── */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          {/* Card Header */}
          <div className="flex items-center gap-2.5 border-b border-gray-50 px-4 py-3.5">
            <div className="flex size-7 items-center justify-center rounded-xl bg-orange-50">
              <Receipt size={14} className="text-orange-500" />
            </div>
            <h3 className="text-[13px] font-bold text-gray-900">
              Pesanan Kamu
            </h3>
            <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600">
              {items.length} item
            </span>
          </div>

          {/* Items List */}
          <div className="divide-y divide-gray-50">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-3.5"
              >
                {/* Image */}
                <div className="relative size-[52px] flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="truncate text-[13px] font-semibold text-gray-900">
                    {item.title}
                  </p>
                  <p className="text-primary text-[13px] font-bold">
                    Rp {formatRupiah(toNumber(item.price))}
                  </p>
                </div>

                {/* Qty Controls */}
                <div className="flex flex-shrink-0 items-center gap-2.5">
                  <button
                    onClick={() => decreaseQty(canteenId, item.id)}
                    className="flex size-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors active:bg-gray-50"
                  >
                    <Minus size={11} />
                  </button>
                  <span className="w-5 text-center text-[14px] font-bold text-gray-900">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => increaseQty(canteenId, item.id)}
                    className="bg-primary flex size-7 items-center justify-center rounded-full text-white transition-opacity active:opacity-80"
                  >
                    <Plus size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Payment Method Card ── */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-gray-50 px-4 py-3.5">
            <div className="flex size-7 items-center justify-center rounded-xl bg-blue-50">
              <Wallet size={14} className="text-blue-500" />
            </div>
            <h3 className="text-[13px] font-bold text-gray-900">
              Metode Pembayaran
            </h3>
          </div>

          <div className="flex flex-col gap-2.5 p-4">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedPayment === method.id;
              return (
                <label
                  key={method.id}
                  className={`flex items-center gap-3.5 rounded-2xl border-2 p-3.5 transition-all ${
                    method.comingSoon
                      ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-50"
                      : isSelected
                        ? "border-primary bg-primary/5 cursor-pointer"
                        : "cursor-pointer border-gray-100 bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    value={method.id}
                    checked={isSelected}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    disabled={method.comingSoon}
                    className="hidden"
                  />
                  {/* Icon */}
                  <div
                    className={`flex size-10 flex-shrink-0 items-center justify-center rounded-2xl ${
                      isSelected ? "bg-primary/10" : "bg-white"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={isSelected ? "text-primary" : "text-gray-400"}
                    />
                  </div>
                  {/* Label */}
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-gray-900">
                        {method.label}
                      </span>
                      {method.comingSoon && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-400">
                          Segera
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400">
                      {method.description}
                    </span>
                  </div>
                  {/* Radio Indicator */}
                  <div
                    className={`flex size-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      isSelected ? "border-primary" : "border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <div className="bg-primary size-2.5 rounded-full" />
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* ── Price Summary Card ── */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-gray-50 px-4 py-3.5">
            <div className="flex size-7 items-center justify-center rounded-xl bg-green-50">
              <Tag size={14} className="text-green-500" />
            </div>
            <h3 className="text-[13px] font-bold text-gray-900">
              Ringkasan Pembayaran
            </h3>
          </div>

          <div className="flex flex-col gap-3 px-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-gray-500">Subtotal</span>
              <span className="text-[13px] font-semibold text-gray-900">
                Rp {formatRupiah(subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[13px] text-gray-500">Biaya bungkus</span>
              <span className="text-[13px] font-semibold text-gray-400">
                {biayaBungkus === 0
                  ? "Gratis"
                  : `Rp ${formatRupiah(biayaBungkus)}`}
              </span>
            </div>

            <div className="my-0.5 h-px bg-gray-100" />

            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-gray-900">Total</span>
              <span className="text-primary text-[15px] font-extrabold">
                Rp {formatRupiah(total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="fixed right-0 bottom-0 left-0 border-t border-gray-100 bg-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          {/* Total Info */}
          <div className="flex flex-col gap-0.5">
            <p className="text-[11px] font-medium text-gray-400">
              Total Pembayaran
            </p>
            <p className="text-primary text-[20px] leading-tight font-extrabold">
              Rp {formatRupiah(total)}
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setShowModal(true)}
            disabled={loading}
            className="bg-primary flex items-center gap-2 rounded-2xl px-5 py-3.5 text-[13px] font-bold text-white shadow-sm transition-transform active:scale-95 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="size-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Memproses...
              </span>
            ) : (
              <>
                Pesan Sekarang
                <ChevronRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Modal ── */}
      <ModalComponent
        type="order"
        isOpen={showModal}
        title="Konfirmasi Pesanan"
        message="Apakah kamu yakin ingin memesan ini?"
        highlight="Pesanan tidak bisa dibatalkan"
        onClose={() => setShowModal(false)}
        onConfirm={handleCreateInvoice}
      />
    </div>
  );
}
