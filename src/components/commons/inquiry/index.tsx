"use client";

import { useRouter, useParams } from "next/navigation";
import {
  Home,
  MapPin,
  Store,
  CreditCard,
  Clock,
  CheckCircle2,
  Package,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

type StatusProses =
  | "Belum Dibayar"
  | "Pesanan Diproses"
  | "Menunggu Diambil"
  | "Selesai";

interface OrderItem {
  name: string;
  qty: number;
  rate: number;
  amount: number;
}

interface OrderData {
  orderId: string;
  canteen: string;
  items: OrderItem[];
  cashback: number;
  biayaBungkus: number;
  redirectUrl: string | null;
  statusProses: StatusProses;
}

const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID").format(num);

export default function SuccessPage() {
  const router = useRouter();
  const params = useParams();

  const salesInvoiceId = params["sales-invoice-id"] as string;
  const canteenId = params.id as string;

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>({
    orderId: salesInvoiceId,
    canteen: "",
    items: [],
    cashback: 0,
    biayaBungkus: 0,
    redirectUrl: null,
    statusProses: "Belum Dibayar",
  });

  // Fungsi utama untuk mengambil detail dan sinkronisasi status (Inquiry)
  const fetchData = useCallback(
    async (showLoading = true) => {
      if (!salesInvoiceId) return;
      if (showLoading) setIsRefreshing(true);

      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");
      const authHeader =
        apiKey && apiSecret ? `token ${apiKey}:${apiSecret}` : "";

      try {
        // 1. Hit API Inquiry untuk update status terbaru di server
        await fetch(
          `/api/sales-invoice/inquiry?sales_invoice_id=${salesInvoiceId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader,
            },
          },
        );

        // 2. Ambil detail data terbaru
        const res = await fetch(
          `/api/sales-invoice?sales_invoice_id=${salesInvoiceId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader,
            },
          },
        );

        const json = await res.json();
        if (!res.ok || !json.data) throw new Error("Gagal memuat data");

        const inv = json.data.sales_invoice;
        const pay = json.data.payment;

        const items: OrderItem[] = (inv?.items ?? []).map((i: any) => ({
          name: i.item_name ?? i.item_code ?? "Item",
          qty: Number(i.qty ?? 1),
          rate: Number(i.rate ?? 0),
          amount: Number(i.amount ?? 0),
        }));

        setOrderData({
          orderId: inv?.id ?? salesInvoiceId,
          canteen: inv?.company ?? decodeURIComponent(canteenId) ?? "Kantin",
          items,
          cashback: Number(inv?.discount_amount ?? 0),
          biayaBungkus: 0,
          redirectUrl: pay?.redirect_url ?? null,
          statusProses: (inv?.status_proses as StatusProses) || "Belum Dibayar",
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoadingData(false);
        setIsRefreshing(false);
      }
    },
    [salesInvoiceId, canteenId],
  );

  // Efek saat pertama kali load (Reload)
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRedirectPayment = () => {
    if (orderData.redirectUrl) {
      window.location.href = orderData.redirectUrl;
    } else {
      alert("Link pembayaran tidak tersedia.");
    }
  };

  const getTheme = () => {
    const s = orderData.statusProses;
    if (s === "Belum Dibayar") {
      return {
        bg: "bg-[#fff8f3]",
        blob: "bg-orange-400/10",
        iconBg: "bg-orange-400 shadow-orange-400/30",
        badgeBg: "bg-orange-100",
        badgeText: "text-orange-500",
        badgeDot: "bg-orange-400",
        infoBanner: "bg-orange-50",
        btnPay: "bg-orange-400 shadow-orange-400/25",
        textPrimary: "text-orange-500",
      };
    }
    return {
      bg: "bg-[#f0f4f2]",
      blob: "bg-primary/10",
      iconBg: "bg-primary shadow-primary/30",
      badgeBg: "bg-primary/10",
      badgeText: "text-primary",
      badgeDot: "bg-primary",
      infoBanner: "bg-primary/5",
      btnPay: "bg-primary shadow-primary/25",
      textPrimary: "text-primary",
    };
  };

  const theme = getTheme();
  const subtotal = orderData.items.reduce((acc, item) => acc + item.amount, 0);
  const total = subtotal - orderData.cashback + orderData.biayaBungkus;

  if (isLoadingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="border-primary size-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex min-h-screen flex-col items-center justify-between overflow-hidden font-sans transition-colors duration-500 ${theme.bg}`}
    >
      <div
        className={`pointer-events-none absolute -top-20 -left-20 size-64 rounded-full blur-3xl transition-colors duration-500 ${theme.blob}`}
      />
      <div
        className={`pointer-events-none absolute top-32 -right-16 size-48 rounded-full blur-2xl transition-colors duration-500 ${theme.blob}`}
      />

      <div className="flex w-full max-w-md flex-1 flex-col items-center px-5 pt-16 pb-8">
        {/* Status Icon */}
        <div className="relative mb-6 flex items-center justify-center">
          <div
            className={`absolute size-32 animate-ping rounded-full opacity-20 transition-colors duration-500 ${theme.blob}`}
          />
          <div
            className={`relative flex size-20 items-center justify-center rounded-full shadow-lg transition-colors duration-500 ${theme.iconBg}`}
          >
            {orderData.statusProses === "Belum Dibayar" ? (
              <Clock size={32} color="white" strokeWidth={2.5} />
            ) : orderData.statusProses === "Pesanan Diproses" ? (
              <Package size={32} color="white" strokeWidth={2.5} />
            ) : (
              <CheckCircle2 size={32} color="white" strokeWidth={2.5} />
            )}
          </div>
        </div>

        {/* Title */}
        <div className="mb-8 flex flex-col items-center gap-1 text-center">
          <h1 className="text-[22px] font-extrabold tracking-tight text-gray-900">
            {orderData.statusProses}
          </h1>
          <div
            className={`mt-2 flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors duration-500 ${theme.badgeBg}`}
          >
            <span
              className={`size-1.5 rounded-full transition-colors duration-500 ${theme.badgeDot}`}
            />
            <p
              className={`text-[12px] font-semibold transition-colors duration-500 ${theme.badgeText}`}
            >
              Order ID: {orderData.orderId}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full overflow-hidden rounded-3xl bg-white shadow-md shadow-black/5">
          <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-2xl transition-colors duration-500 ${theme.badgeBg}`}
            >
              <Store size={18} className={theme.badgeText} />
            </div>
            <div>
              <p className="text-[14px] font-bold text-gray-900">
                {orderData.canteen}
              </p>
              <p className="text-[11px] text-gray-400">Kantin mitra resmi</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 px-4 py-4">
            <p className="mb-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
              Rincian Pesanan
            </p>
            {orderData.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 rounded-2xl bg-gray-50 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[13px] ${theme.badgeBg}`}
                    >
                      🍽️
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {item.qty} x Rp {formatRupiah(item.rate)}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`shrink-0 text-[13px] font-bold ${theme.textPrimary}`}
                  >
                    Rp {formatRupiah(item.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-dashed border-gray-200 px-5 py-4">
            <div className="flex items-center justify-between text-[13px] text-gray-500">
              <span>Total Pembayaran</span>
              <span
                className={`text-[15px] font-extrabold ${theme.textPrimary}`}
              >
                Rp {formatRupiah(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div
          className={`mt-4 mb-6 flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition-colors duration-500 ${theme.infoBanner}`}
        >
          <span className="text-xl">
            {orderData.statusProses === "Belum Dibayar" ? "💳" : "👨‍🍳"}
          </span>
          <div>
            <p className="text-[12px] font-bold text-gray-800">
              {orderData.statusProses === "Belum Dibayar"
                ? "Menunggu Pembayaran"
                : "Update Terbaru"}
            </p>
            <p className="text-[11px] text-gray-500">
              {orderData.statusProses === "Belum Dibayar"
                ? "Selesaikan pembayaran via Midtrans"
                : "Silakan cek berkala status pesananmu."}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3">
          {orderData.statusProses === "Belum Dibayar" && (
            <button
              onClick={handleRedirectPayment}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[14px] font-bold text-white transition-all active:scale-95 ${theme.btnPay}`}
            >
              <CreditCard size={16} />
              Bayar Sekarang
            </button>
          )}

          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-4 text-[14px] font-bold text-gray-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {isRefreshing ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            {isRefreshing ? "Mengecek..." : "Cek Transaksi Terkini"}
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
    </div>
  );
}
