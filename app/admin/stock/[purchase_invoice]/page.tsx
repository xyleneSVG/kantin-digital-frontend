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
import { ArrowLeft, Package, Truck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface StockItem {
  item_code: string;
  item_name: string;
  uom: string;
  qty: number;
  rate: number;
  amount: number;
}

interface StockPurchaseDetail {
  purchase_id: string;
  supplier: string;
  purchase_date: string;
  received_date?: string;
  items: StockItem[];
  total_amount: number;
  status: "pending" | "received" | "completed";
  notes?: string;
}

export default function StockDetailPage() {
  const params = useParams();
  const [detail, setDetail] = useState<StockPurchaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"pending" | "received" | "completed">(
    "pending",
  );
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Simulasi fetch data detail pembelian stok
    setTimeout(() => {
      const mockDetail: StockPurchaseDetail = {
        purchase_id: "PO-2026-00001",
        supplier: "PT. Supplier Makanan Jaya",
        purchase_date: "2026-04-20",
        received_date: "2026-04-22",
        items: [
          {
            item_code: "AYAM-001",
            item_name: "Ayam Potong",
            uom: "kg",
            qty: 25,
            rate: 45000,
            amount: 1125000,
          },
          {
            item_code: "BERAS-001",
            item_name: "Beras Premium",
            uom: "kg",
            qty: 50,
            rate: 12000,
            amount: 600000,
          },
          {
            item_code: "MINYAK-001",
            item_name: "Minyak Goreng 2L",
            uom: "botol",
            qty: 20,
            rate: 28000,
            amount: 560000,
          },
          {
            item_code: "GARAM-001",
            item_name: "Garam Halus",
            uom: "kg",
            qty: 10,
            rate: 8000,
            amount: 80000,
          },
          {
            item_code: "GULA-001",
            item_name: "Gula Putih",
            uom: "kg",
            qty: 15,
            rate: 13000,
            amount: 195000,
          },
          {
            item_code: "TELUR-001",
            item_name: "Telur Ayam",
            uom: "butir",
            qty: 300,
            rate: 1500,
            amount: 450000,
          },
          {
            item_code: "TAHU-001",
            item_name: "Tahu Putih",
            uom: "pcs",
            qty: 100,
            rate: 5000,
            amount: 500000,
          },
          {
            item_code: "TEMPE-001",
            item_name: "Tempe",
            uom: "pcs",
            qty: 80,
            rate: 4000,
            amount: 320000,
          },
        ],
        total_amount: 3830000,
        status: "received",
        notes: "Pengiriman sesuai jadwal, semua barang dalam kondisi baik",
      };
      setDetail(mockDetail);
      setStatus(mockDetail.status);
      setLoading(false);
    }, 500);
  }, [params.purchase_id]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleStatusUpdate = async (newStatus: "received" | "completed") => {
    setIsUpdating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus(newStatus);
      if (detail) {
        setDetail({
          ...detail,
          status: newStatus,
          received_date:
            newStatus === "received"
              ? new Date().toISOString().split("T")[0]
              : detail.received_date,
        });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "received":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu";
      case "received":
        return "Diterima";
      case "completed":
        return "Selesai";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-40 border-b border-gray-300 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              <Package className="h-8 w-8 text-emerald-600" />
              Detail Pembelian Stok
            </h1>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-gray-600">
                Memuat detail pembelian stok...
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-40 border-b border-gray-300 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              <Package className="h-8 w-8 text-emerald-600" />
              Detail Pembelian Stok
            </h1>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-gray-600">
                Pembelian stok tidak ditemukan
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
            <Link href="/admin/stock">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                <Package className="h-8 w-8 text-emerald-600" />
                Detail Pembelian Stok
              </h1>
              <p className="mt-1 text-sm text-gray-600">{detail.purchase_id}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Supplier Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pembelian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Supplier</p>
                  <p className="font-semibold text-gray-900">
                    {detail.supplier}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tanggal Pembelian</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(detail.purchase_date)}
                  </p>
                </div>
                {detail.received_date && (
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Diterima</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(detail.received_date)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detail Barang</CardTitle>
              <CardDescription>{detail.items.length} item</CardDescription>
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
                    {detail.items.map((item) => (
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

          {/* Summary */}
          <Card className="border-2 border-emerald-200">
            <CardHeader>
              <CardTitle>Ringkasan Pembelian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-300 py-2">
                <span className="text-gray-600">Total Item</span>
                <span className="font-semibold">
                  {detail.items.length} item
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-300 py-2">
                <span className="text-gray-600">Total Qty</span>
                <span className="font-semibold">
                  {detail.items.reduce((sum, item) => sum + item.qty, 0)} unit
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Total Amount</span>
                <span className="text-xl font-bold text-emerald-600">
                  {formatCurrency(detail.total_amount)}
                </span>
              </div>
              {detail.notes && (
                <div className="border-t border-gray-300 pt-4">
                  <p className="mb-2 text-sm text-gray-600">Catatan</p>
                  <p className="text-gray-900">{detail.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
