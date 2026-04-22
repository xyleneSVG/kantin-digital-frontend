"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/og-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { ArrowLeft, Package, Truck, CheckCircle2 } from "lucide-react";
import ScreenLoader from "@/src/hooks/useScreenLoader";
import {
  getPurchaseInvoiceDetail,
  PurchaseInvoiceDetail,
} from "@/src/services/admin";

type StatusType = "pending" | "received" | "completed";

export default function StockDetailPage() {
  const params = useParams();
  const id = params.purchase_invoice as string;

  const [data, setData] = useState<PurchaseInvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<StatusType>("pending");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const res = await getPurchaseInvoiceDetail(id);

        const mapped: PurchaseInvoiceDetail = {
          ...res,
          items: res.items || [],
        };

        setData(mapped);

        if (res.docstatus === 0) setStatus("pending");
        else if (res.docstatus === 1) setStatus("received");
        else setStatus("completed");
      } catch (e) {
        console.error(e);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const handleStatusUpdate = async (newStatus: StatusType) => {
    setIsUpdating(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setStatus(newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "received":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
    }
  };

  const getStatusLabel = (status: StatusType) => {
    switch (status) {
      case "pending":
        return "Menunggu";
      case "received":
        return "Diterima";
      case "completed":
        return "Selesai";
    }
  };

  const totalQty = data?.items.reduce((sum, i) => sum + i.qty, 0) || 0;

  return (
    <ScreenLoader isLoading={loading}>
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-40 border-b border-gray-300 bg-white">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-6">
            <Link href="/admin/stock">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
            </Link>

            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold">
                <Package className="h-7 w-7 text-emerald-600" />
                Detail Purchase Invoice
              </h1>
              <p className="text-sm text-gray-500">
                {data?.purchase_invoice_id}
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
          {!data ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                Data tidak ditemukan
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Pembelian</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">Supplier</p>
                    <p className="font-semibold">{data.supplier}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-semibold">{data.company}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Tanggal</p>
                    <p className="font-semibold">
                      {formatDate(data.posting_date)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Warehouse</p>
                    <p className="font-semibold">{data.set_warehouse}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detail Barang</CardTitle>
                  <CardDescription>{data.items.length} item</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-150 text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="w-[40%] px-4 py-3 text-left">Nama</th>
                          <th className="w-[20%] px-4 py-3 text-center">Qty</th>
                          <th className="w-[20%] px-4 py-3 text-right">
                            Harga
                          </th>
                          <th className="w-[20%] px-4 py-3 text-right">
                            Total
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {data.items.map((item) => (
                          <tr key={item.item_code} className="border-b">
                            <td className="px-4 py-3">
                              <div className="font-medium">
                                {item.item_name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.item_code}
                              </div>
                            </td>

                            <td className="px-4 py-3 text-center whitespace-nowrap">
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

              <Card className="border-2 border-emerald-200">
                <CardHeader>
                  <CardTitle>Ringkasan</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Item</span>
                    <span>{data.items.length}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total Qty</span>
                    <span>{totalQty}</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-emerald-600">
                    <span>Grand Total</span>
                    <span>{formatCurrency(data.grand_total)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div
                    className={`flex items-center gap-2 rounded p-3 ${getStatusColor(
                      status,
                    )}`}
                  >
                    {status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Truck className="h-5 w-5" />
                    )}
                    <span className="font-semibold">
                      {getStatusLabel(status)}
                    </span>
                  </div>

                  {status === "pending" && (
                    <Button
                      onClick={() => handleStatusUpdate("received")}
                      disabled={isUpdating}
                      className="w-full bg-emerald-600 text-white"
                    >
                      Tandai Diterima
                    </Button>
                  )}

                  {status === "received" && (
                    <Button
                      onClick={() => handleStatusUpdate("completed")}
                      disabled={isUpdating}
                      className="w-full bg-emerald-600 text-white"
                    >
                      Tandai Selesai
                    </Button>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>
    </ScreenLoader>
  );
}
