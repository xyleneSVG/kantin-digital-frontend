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
import { Eye, Package } from "lucide-react";
import Link from "next/link";

interface Order {
  sales_invoice_id: string;
  customer: string;
  posting_date: string;
  grand_total: number;
  orderStatus: "not_processed" | "processing" | "waiting_pickup" | "completed";
}

export default function OrderListsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const mockOrders: Order[] = [
          {
            sales_invoice_id: "ACC-SINV-2026-00001",
            customer: "Muhammad Abdulrozak Ramadhani",
            posting_date: "2026-04-21",
            grand_total: 17000.0,
            orderStatus: "not_processed",
          },
          {
            sales_invoice_id: "ACC-SINV-2026-00002",
            customer: "Budi Santoso",
            posting_date: "2026-04-20",
            grand_total: 45000.0,
            orderStatus: "processing",
          },
          {
            sales_invoice_id: "ACC-SINV-2026-00003",
            customer: "Siti Nurhaliza",
            posting_date: "2026-04-19",
            grand_total: 32000.0,
            orderStatus: "completed",
          },
        ];
        setOrders(mockOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  const getOrderStatusLabel = (
    status: "not_processed" | "processing" | "waiting_pickup" | "completed",
  ) => {
    switch (status) {
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

  const getOrderStatusColor = (
    status: "not_processed" | "processing" | "waiting_pickup" | "completed",
  ) => {
    switch (status) {
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

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-gray-300 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            <Package className="h-8 w-8 text-emerald-600" />
            Daftar Pesanan
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola dan lihat detail semua pesanan pelanggan
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-gray-600">
                Memuat data pesanan...
              </p>
            </CardContent>
          </Card>
        ) : orders.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Pesanan</CardTitle>
              <CardDescription>Total {orders.length} pesanan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">
                        ID Pesanan
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">
                        Pelanggan
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">
                        Tanggal
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-600">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.sales_invoice_id}
                        className="border-b border-gray-300 transition-colors last:border-0 hover:bg-gray-100"
                      >
                        <td className="px-4 py-3 font-medium text-emerald-600">
                          {order.sales_invoice_id}
                        </td>
                        <td className="px-4 py-3">{order.customer}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {formatDate(order.posting_date)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {formatCurrency(order.grand_total)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-medium ${getOrderStatusColor(order.orderStatus)}`}
                          >
                            {getOrderStatusLabel(order.orderStatus)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Link
                            href={`/admin/order-lists/${order.sales_invoice_id}`}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              Detail
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-gray-600">Tidak ada pesanan</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
