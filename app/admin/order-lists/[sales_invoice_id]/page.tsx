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
  payment_method: "tunai" | "non_tunai";
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const sales_invoice_id = params.sales_invoice_id as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [orderStatus, setOrderStatus] = useState<
    "not_processed" | "processing" | "waiting_pickup" | "completed"
  >("not_processed");
  const [paymentStatus, setPaymentStatus] = useState<"belum_dibayar" | "lunas">(
    "belum_dibayar",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);

  useEffect(() => {
    // Fetch order detail from BE
    const fetchOrderDetail = async () => {
      try {
        // Simulasi fetch data
        const mockOrderDetail: OrderDetail = {
          sales_invoice_id: "ACC-SINV-2026-00001",
          customer: "Muhammad Abdulrozak Ramadhani",
          company: "Kantin Mak Cor",
          posting_date: "2026-04-21",
          set_warehouse: "Kantin Mak Cor - KMC",
          grand_total: 17000.0,
          status: "Unpaid",
          payment_method: "tunai",
          items: [
            {
              item_code: "mizone-kantin-mak-cor",
              item_name: "Mizone",
              uom: "Pcs",
              qty: 2.0,
              rate: 6000.0,
              amount: 12000.0,
              warehouse: "Kantin Mak Cor - KMC",
            },
            {
              item_code: "eno-coek-kantin-mak-cor",
              item_name: "eno Coek",
              uom: "Pcs",
              qty: 1.0,
              rate: 5000.0,
              amount: 5000.0,
              warehouse: "Kantin Mak Cor - KMC",
            },
          ],
        };
        setOrder(mockOrderDetail);
        // Set payment status based on payment method
        if (mockOrderDetail.payment_method === "non_tunai") {
          setPaymentStatus("lunas");
        } else {
          setPaymentStatus("belum_dibayar");
        }
      } catch (error) {
        console.error("Failed to fetch order detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [sales_invoice_id]);

  const handleProcessOrder = async () => {
    // Jika tahap waiting_pickup dan method tunai, tampilkan alert
    if (orderStatus === "waiting_pickup" && order?.payment_method === "tunai") {
      setShowPaymentAlert(true);
      return;
    }

    setIsProcessing(true);
    try {
      // Simulasi update status pesanan
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (orderStatus === "not_processed") {
        setOrderStatus("processing");
      } else if (orderStatus === "processing") {
        setOrderStatus("waiting_pickup");
      } else if (orderStatus === "waiting_pickup") {
        setOrderStatus("completed");
      }
    } catch (error) {
      console.error("Failed to process order:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentConfirm = async () => {
    setIsProcessing(true);
    try {
      // Simulasi update status pembayaran
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPaymentStatus("lunas");
      setOrderStatus("completed");
      setShowPaymentAlert(false);
    } catch (error) {
      console.error("Failed to confirm payment:", error);
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
        return "Pesanan Selesai";
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

  if (loading) {
    return (
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
                Memuat detail pesanan...
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
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
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Order Information */}
          <div className="space-y-6 lg:col-span-2">
            {/* Customer Info */}
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

            {/* Order Items */}
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

          {/* Summary & Action */}
          <div className="space-y-6">
            {/* Order Summary */}
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
                    {order.payment_method === "tunai" ? "Tunai" : "Non Tunai"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Status */}
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

            {/* Process Order Button */}
            {orderStatus !== "completed" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status Pesanan</CardTitle>
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

            {/* Completed Status Card */}
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

      {/* Payment Alert Modal */}
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
                <span className="font-semibold">tunai</span>. Pastikan pelanggan
                telah melakukan pembayaran sebelum barang diambil.
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
  );
}
