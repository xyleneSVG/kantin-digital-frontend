"use client";

import React, { useState } from "react";
import { Button } from "@/src/components/ui/og-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface StockItem {
  id: string;
  namaItem: string;
  jumlah: number;
  uom: string;
  harga: number;
  supplier: string;
}

const suppliers = [
  "CV. Segar Jaya",
  "PT. Maju Mundur",
  "Toko Distribusi Arum",
  "UD. Berkah",
];
const items = [
  "Ayam",
  "Beras",
  "Minyak Goreng",
  "Garam",
  "Gula",
  "Telur",
  "Tahu",
  "Tempe",
];
const uomOptions = ["kg", "gram", "liter", "pcs", "box", "sak"];

export default function AddStockPage() {
  const [supplier, setSupplier] = useState("CV. Segar Jaya");
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: "1",
      namaItem: "Ayam",
      jumlah: 10,
      uom: "kg",
      harga: 50000,
      supplier: "CV. Segar Jaya",
    },
  ]);

  const handleAddItem = () => {
    const newItem: StockItem = {
      id: Date.now().toString(),
      namaItem: items[0],
      jumlah: 0,
      uom: "kg",
      harga: 0,
      supplier: supplier,
    };
    setStockItems([...stockItems, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setStockItems(stockItems.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: string, value: any) => {
    setStockItems(
      stockItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const totalHarga = stockItems.reduce(
    (sum, item) => sum + item.jumlah * item.harga,
    0,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Stock purchase data:", {
      supplier,
      tanggal,
      items: stockItems,
    });
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-300 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <Link href="/admin/stock">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Tambah Pembelian Stok
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Catat pembelian barang baru dari supplier
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Supplier & Date Section */}
          <Card className="border-2 border-emerald-200">
            <CardHeader>
              <CardTitle>Informasi Pembelian</CardTitle>
              <CardDescription>
                Tentukan supplier dan tanggal pembelian
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Supplier*
                </label>
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-600/50 focus:outline-none"
                >
                  {suppliers.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Tanggal*
                </label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-600/50 focus:outline-none"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Items Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Detail Barang</CardTitle>
                <CardDescription>Daftar barang yang dibeli</CardDescription>
              </div>
              <Button
                type="button"
                onClick={handleAddItem}
                size="sm"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">
                        Nama Item
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">
                        Jumlah
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">
                        UOM
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-600">
                        Harga (Rp)
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-600">
                        Total
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-300 transition-colors hover:bg-gray-100"
                      >
                        <td className="px-4 py-3">
                          <select
                            value={item.namaItem}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "namaItem",
                                e.target.value,
                              )
                            }
                            className="rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-emerald-600/50 focus:outline-none"
                          >
                            {items.map((i) => (
                              <option key={i} value={i}>
                                {i}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            value={item.jumlah}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "jumlah",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-20 rounded border border-gray-300 px-2 py-1 text-center text-sm focus:ring-2 focus:ring-emerald-600/50 focus:outline-none"
                            min="0"
                            step="0.1"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <select
                            value={item.uom}
                            onChange={(e) =>
                              handleItemChange(item.id, "uom", e.target.value)
                            }
                            className="rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-emerald-600/50 focus:outline-none"
                          >
                            {uomOptions.map((u) => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <input
                            type="number"
                            value={item.harga}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "harga",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-24 rounded border border-gray-300 px-2 py-1 text-right text-sm focus:ring-2 focus:ring-emerald-600/50 focus:outline-none"
                            min="0"
                          />
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          Rp{" "}
                          {(item.jumlah * item.harga).toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="rounded p-1 transition-colors hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Total Summary */}
          <Card className="border-2 border-emerald-200 bg-emerald-50">
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-medium">Total Pembelian:</span>
                <span className="text-3xl font-bold text-emerald-600">
                  Rp {totalHarga.toLocaleString("id-ID")}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {stockItems.length} item pembelian
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Link href="/admin/stock" className="flex-1">
              <Button variant="outline" className="w-full">
                Batal
              </Button>
            </Link>
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Simpan Pembelian
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
