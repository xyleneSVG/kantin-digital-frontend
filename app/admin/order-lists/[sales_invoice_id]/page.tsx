"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/og-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  ArrowLeft,
  Package,
  DollarSign,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getSalesInvoiceDetail } from "@/src/services/admin";
import ScreenLoader from "@/src/hooks/useScreenLoader";

interface OrderItem {
  item_code: string;
  item_name: string;
  uom: string;
  qty: number;
  rate: number;
  amount: number;
  warehouse: string;
}

interface OrderDetail {
  sales_invoice_id: string;
  customer: string;
  company: string;
  posting_date: string;
  set_warehouse: string;
  grand_total: number;
  status: string;
  payment_method: "tunai" | "non-tunai";
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const sales_invoice_id = params.sales_invoice_id as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeader = () => {
    const apiKey = localStorage.getItem("api_key");
    const apiSecret = localStorage.getItem("api_secret");
    return `token ${apiKey}:${apiSecret}`;
  };

  const [orderStatus, setOrderStatus] = useState<
    "not_processed" | "processing" | "waiting_pickup" | "completed"
  >("not_processed");
  const [paymentStatus, setPaymentStatus] = useState<"belum_dibayar" | "lunas">(
    "belum_dibayar",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);

  const mapStatusProses = (status: string) => {
    switch (status) {
      case "Pesanan Diproses":
        return "processing";
      case "Siap Diambil":
        return "waiting_pickup";
      case "Selesai":
        return "completed";
      default:
        return "not_processed";
    }
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await getSalesInvoiceDetail(sales_invoice_id);
        const { sales_invoice, payment } = res;

        const mapped: OrderDetail = {
          sales_invoice_id: sales_invoice.id,
          customer: sales_invoice.customer_name ?? sales_invoice.customer,
          company: sales_invoice.company,
          posting_date: sales_invoice.posting_date,
          set_warehouse: sales_invoice.warehouse,
          grand_total: sales_invoice.grand_total,
          status: sales_invoice.status,
          payment_method:
            payment.payment_method === "Tunai" ? "tunai" : "non-tunai",
          items: sales_invoice.items || [],
        };

        setOrder(mapped);

        const status = mapStatusProses(sales_invoice.status_proses);
        setOrderStatus(status);

        const isPaid = status !== "not_processed";
        setPaymentStatus(isPaid ? "lunas" : "belum_dibayar");
      } catch (error) {
        console.error("Failed to fetch order detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sales_invoice_id) fetchOrderDetail();
  }, [sales_invoice_id]);

  const callOrderReceived = async () => {
    const res = await fetch(
      `https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.sales_invoice.order_received`,
      {
        method: "POST",
        headers: {
          authorization: getAuthHeader(),
          "content-type": "application/json",
        },
        body: JSON.stringify({ sales_invoice_id }),
      },
    );
    if (!res.ok) throw new Error("order_received gagal");
  };

  const callReadyForPickup = async () => {
    const res = await fetch(
      `https://ta-dev.subekti.web.id/api/method/kantin_stemba.api.sales_invoice.ready_for_pickup`,
      {
        method: "POST",
        headers: {
          authorization: getAuthHeader(),
          "content-type": "application/json",
        },
        body: JSON.stringify({ sales_invoice_id }),
      },
    );
    if (!res.ok) throw new Error("ready_for_pickup gagal");
  };

  const handleProcessOrder = async () => {
    if (orderStatus === "waiting_pickup" && order?.payment_method === "tunai") {
      setShowPaymentAlert(true);
      return;
    }

    setIsProcessing(true);
    try {
      if (orderStatus === "processing") {
        await callReadyForPickup();
        setOrderStatus("waiting_pickup");
      } else if (orderStatus === "waiting_pickup") {
        await callOrderReceived();
        setOrderStatus("completed");
      }
    } catch (error) {
      console.error("Gagal memproses pesanan:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentConfirm = async () => {
    setIsProcessing(true);
    try {
      await callReadyForPickup();
      setPaymentStatus("lunas");
      setOrderStatus("completed");
      setShowPaymentAlert(false);
    } catch (error) {
      console.error("Gagal konfirmasi pembayaran:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentAlert(false);
  };

  const getOrderStatusLabel = () => {
    switch (orderStatus) {
      case "not_processed":
        return "Belum diproses";
      case "processing":
        return "Sedang diproses";
      case "waiting_pickup":
        return "Menunggu barang diambil";
      case "completed":
        return "Pesanan selesai";
      default:
        return "Belum diproses";
    }
  };

  const getOrderStatusColor = () => {
    switch (orderStatus) {
      case "not_processed":
        return "bg-gray-100 text-gray-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "waiting_pickup":
        return "bg-orange-100 text-orange-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getButtonLabel = () => {
    switch (orderStatus) {
      case "not_processed":
        return "Proses Pesanan";
      case "processing":
        return "Pesanan Siap Diambil";
      case "waiting_pickup":
        return "Barang Sudah Diambil";
      default:
        return "Proses Pesanan";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <ScreenLoader isLoading={loading}>
      {!order ? (
        <div className="min-h-screen bg-white">
          <header className="sticky top-0 z-40 border-b border-gray-300 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
              <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                <Package className="h-8 w-8 text-emerald-600" />
                Detail Pesanan
              </h1>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-gray-600">
                  Pesanan tidak ditemukan
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      ) : (
        <div className="min-h-screen bg-white">
          <header className="sticky top-0 z-40 border-b border-gray-300 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
              <div className="flex items-center gap-4">
                <Link href="/admin/order-lists">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                  </Button>
                </Link>
                <div>
                  <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                    <Package className="h-8 w-8 text-emerald-600" />
                    Detail Pesanan
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    {order.sales_invoice_id}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Informasi Pelanggan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-gray-600">Nama Pelanggan</p>
                        <p className="font-semibold text-gray-900">
                          {order.customer}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Perusahaan</p>
                        <p className="font-semibold text-gray-900">
                          {order.company}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tanggal Pesanan</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(order.posting_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Gudang</p>
                        <p className="font-semibold text-gray-900">
                          {order.set_warehouse}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Detail Barang</CardTitle>
                    <CardDescription>{order.items.length} item</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="px-4 py-3 text-left font-semibold text-gray-600">
                              Nama Barang
                            </th>
                            <th className="px-4 py-3 text-center font-semibold text-gray-600">
                              Qty
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-600">
                              Harga Satuan
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-600">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item) => (
                            <tr
                              key={item.item_code}
                              className="border-b border-gray-300 last:border-0"
                            >
                              <td className="px-4 py-3">
                                <p className="font-medium text-gray-900">
                                  {item.item_name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {item.item_code}
                                </p>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {item.qty} {item.uom}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {formatCurrency(item.rate)}
                              </td>
                              <td className="px-4 py-3 text-right font-semibold">
                                {formatCurrency(item.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-2 border-emerald-200">
                  <CardHeader>
                    <CardTitle>Ringkasan Pesanan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-300 py-2">
                      <span className="text-gray-600">Total Barang</span>
                      <span className="font-semibold">
                        {order.items.reduce((sum, item) => sum + item.qty, 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-300 py-2">
                      <span className="text-gray-600">Grand Total</span>
                      <span className="text-xl font-bold text-emerald-600">
                        {formatCurrency(order.grand_total)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">Metode Pembayaran</span>
                      <span className="font-semibold capitalize">
                        {order.payment_method === "tunai"
                          ? "Tunai"
                          : "Non Tunai"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={
                    paymentStatus === "lunas"
                      ? "border-2 border-green-200"
                      : "border-2 border-yellow-200"
                  }
                >
                  <CardHeader>
                    <CardTitle className="text-lg">Status Pembayaran</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`flex items-center gap-2 rounded-lg p-3 ${
                        paymentStatus === "lunas"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-semibold">
                        {paymentStatus === "lunas" ? "Lunas" : "Belum Dibayar"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {orderStatus !== "completed" &&
                  orderStatus !== "not_processed" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Status Pesanan
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div
                          className={`flex items-center gap-2 rounded-lg p-3 ${getOrderStatusColor()}`}
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-semibold">
                            {getOrderStatusLabel()}
                          </span>
                        </div>
                        <Button
                          onClick={handleProcessOrder}
                          disabled={isProcessing}
                          className="w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          {isProcessing ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Memproses...
                            </>
                          ) : (
                            <>
                              <DollarSign className="h-4 w-4" />
                              {getButtonLabel()}
                            </>
                          )}
                        </Button>
                        <p className="text-center text-xs text-gray-600">
                          Klik tombol untuk melanjutkan ke tahap berikutnya
                        </p>
                      </CardContent>
                    </Card>
                  )}

                {orderStatus === "completed" && (
                  <Card className="border-2 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-green-700">
                        Pesanan Selesai
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 rounded-lg bg-green-100 p-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-600">
                          Pesanan Selesai
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-gray-600">
                        Pesanan telah selesai diproses dan barang telah diambil.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </main>

          {showPaymentAlert && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <Card className="w-full max-w-md border-2 border-orange-200 bg-white">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                    <CardTitle className="text-orange-700">
                      Konfirmasi Pembayaran
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-900">
                    Pesanan ini menggunakan metode pembayaran{" "}
                    <span className="font-semibold">tunai</span>. Pastikan
                    pelanggan telah melakukan pembayaran sebelum barang diambil.
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    Total yang harus dibayar:{" "}
                    <span className="text-emerald-600">
                      {formatCurrency(order?.grand_total || 0)}
                    </span>
                  </p>
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handlePaymentCancel}
                      disabled={isProcessing}
                    >
                      Kembali
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 text-white hover:bg-green-700"
                      onClick={handlePaymentConfirm}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Memproses...
                        </>
                      ) : (
                        "Ya, Sudah Bayar"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </ScreenLoader>
  );
}
