"use client";

import React, { useEffect, useState } from "react";
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
import ScreenLoader from "@/src/hooks/useScreenLoader";
import {
  getAdminMenuList,
  getSuppliers,
  createPurchaseInvoice,
} from "@/src/services/admin";

interface StockItem {
  id: string;
  namaItem: string;
  jumlah: number;
  uom: string;
  harga: number;
  item_code: string;
}

export default function AddStockPage() {
  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState("");
  const [supplierList, setSupplierList] = useState<string[]>([]);
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [itemsMaster, setItemsMaster] = useState<any[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const company =
    typeof window !== "undefined" ? localStorage.getItem("company") || "" : "";

  useEffect(() => {
    const load = async () => {
      const company = localStorage.getItem("company");
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");

      if (!company || !apiKey || !apiSecret) {
        setLoading(false);
        return;
      }

      try {
        const items = await getAdminMenuList(company);
        setItemsMaster(items);

        const suppliers = await getSuppliers(company);
        setSupplierList(suppliers);
        setSupplier(suppliers[0] || "");

        setStockItems([
          {
            id: Date.now().toString(),
            namaItem: items[0]?.nama || "",
            jumlah: 1,
            uom: "Pcs",
            harga: items[0]?.harga || 0,
            item_code: items[0]?.id || "",
          },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const searchSupplier = async (q: string) => {
    const data = await getSuppliers(company, q);
    setSupplierList(data);
  };

  const handleAddItem = () => {
    setStockItems([
      ...stockItems,
      {
        id: Date.now().toString(),
        namaItem: itemsMaster[0]?.nama || "",
        jumlah: 1,
        uom: "Pcs",
        harga: itemsMaster[0]?.harga || 0,
        item_code: itemsMaster[0]?.id || "",
      },
    ]);
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

  const handleItemSelect = (id: string, code: string) => {
    const selected = itemsMaster.find((i) => i.id === code);
    setStockItems(
      stockItems.map((item) =>
        item.id === id
          ? {
              ...item,
              namaItem: selected.nama,
              harga: selected.harga,
              item_code: selected.id,
            }
          : item,
      ),
    );
  };

  const totalHarga = stockItems.reduce(
    (sum, item) => sum + item.jumlah * item.harga,
    0,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await createPurchaseInvoice({
        supplier,
        posting_date: tanggal,
        company,
        items: stockItems.map((i) => ({
          item_code: i.item_code,
          uom: i.uom,
          qty: i.jumlah,
          price: i.harga,
        })),
      });

      console.log("SUCCESS:", res);

      // window.location.href = "/admin/stock";
    } catch (err: any) {
      console.error("CREATE ERROR:", err);
      alert(err.message || "Gagal menyimpan data");
    }
  };

  return (
    <ScreenLoader isLoading={loading}>
      <div className="min-h-screen bg-white">
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

        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  <input
                    value={supplier}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSupplier(val);
                      searchSupplier(val);
                    }}
                    list="supplier-list"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />

                  <datalist id="supplier-list">
                    {supplierList.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                  <datalist id="supplier-list">
                    {supplierList.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">
                    Tanggal*
                  </label>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Detail Barang</CardTitle>
                  <CardDescription>Daftar barang yang dibeli</CardDescription>
                </div>
                <Button type="button" onClick={handleAddItem} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Item
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="px-4 py-3 text-left">Nama Item</th>
                        <th className="px-4 py-3 text-center">Jumlah</th>
                        <th className="px-4 py-3 text-center">UOM</th>
                        <th className="px-4 py-3 text-right">Harga</th>
                        <th className="px-4 py-3 text-right">Total</th>
                        <th className="px-4 py-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockItems.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="px-4 py-3">
                            <select
                              value={item.item_code}
                              onChange={(e) =>
                                handleItemSelect(item.id, e.target.value)
                              }
                              className="border px-2 py-1"
                            >
                              {itemsMaster.map((i) => (
                                <option key={i.id} value={i.id}>
                                  {i.nama}
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
                              className="w-20 border text-center"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              value={item.uom}
                              onChange={(e) =>
                                handleItemChange(item.id, "uom", e.target.value)
                              }
                              className="w-20 border text-center"
                            />
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
                              className="w-24 border text-right"
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

            <Card className="border-2 border-emerald-200 bg-emerald-50">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-between">
                  <span>Total Pembelian:</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    Rp {totalHarga.toLocaleString("id-ID")}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-emerald-600 text-white"
              >
                Simpan Pembelian
              </Button>
            </div>
          </form>
        </main>
      </div>
    </ScreenLoader>
  );
}
