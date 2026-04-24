"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/og-button";
import { Input } from "@/src/components/ui/og-input";
import { Eye, Package, Search } from "lucide-react";
import Link from "next/link";
import ScreenLoader from "@/src/hooks/useScreenLoader";
import { getPurchaseInvoices, PurchaseInvoice } from "@/src/services/admin";

export default function StockListPage() {
  const [purchases, setPurchases] = useState<PurchaseInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const company =
    typeof window !== "undefined" ? localStorage.getItem("company") || "" : "";
  const [canteen] = useState(company);

  const loadData = async (query = "") => {
    setLoading(true);

    const data = await getPurchaseInvoices({
      search: query,
      canteen,
      page: 1,
      per_page: 10,
    });

    setPurchases(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <ScreenLoader isLoading={loading}>
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-40 border-b border-gray-300 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold">
                <Package className="h-7 w-7 text-emerald-600" />
                Pembelian Stok
              </h1>
              <p className="text-sm text-gray-500">
                Kantin:{" "}
                <span className="font-semibold text-emerald-600">
                  {canteen}
                </span>
              </p>
            </div>

            <Link href="/admin/stock/add">
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                Tambah Pembelian
              </Button>
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Cari Pembelian</CardTitle>
              <CardDescription>Filter supplier / ID</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari supplier..."
                    className="pl-9"
                  />
                </div>

                <Button onClick={() => loadData(search)}>Cari</Button>
              </div>
            </CardContent>
          </Card>

          {purchases.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Daftar Pembelian</CardTitle>
                <CardDescription>Total {purchases.length}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Supplier</th>
                        <th className="px-4 py-3 text-left">Tanggal</th>
                        <th className="px-4 py-3 text-right">Total</th>
                        <th className="px-4 py-3 text-center">Aksi</th>
                      </tr>
                    </thead>

                    <tbody>
                      {purchases.map((item) => (
                        <tr key={item.purchase_id} className="border-b">
                          <td className="px-4 py-3 font-medium text-emerald-600">
                            {item.purchase_id}
                          </td>
                          <td className="px-4 py-3">{item.supplier}</td>
                          <td className="px-4 py-3">
                            {formatDate(item.purchase_date)}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">
                            {formatCurrency(item.total_amount)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Link href={`/admin/stock/${item.purchase_id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="mr-1 h-4 w-4" />
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
              <CardContent className="py-12 text-center text-gray-500">
                Tidak ada data pembelian
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </ScreenLoader>
  );
}
