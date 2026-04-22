"use client";

import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/src/components/ui/og-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Plus,
  ShoppingCart,
  Package,
  TrendingUp,
  Clock,
  Eye,
} from "lucide-react";
import Link from "next/link";

const mockData = [
  { name: "Senin", pemasukan: 1200000, pengeluaran: 400000 },
  { name: "Selasa", pemasukan: 1800000, pengeluaran: 500000 },
  { name: "Rabu", pemasukan: 1600000, pengeluaran: 480000 },
  { name: "Kamis", pemasukan: 1900000, pengeluaran: 550000 },
  { name: "Jumat", pemasukan: 2100000, pengeluaran: 600000 },
];

const topMenu = [
  { name: "Ayam Geprek", sales: 400 },
  { name: "Es Teh", sales: 200 },
  { name: "Gorengan", sales: 100 },
];

const recentTransactions = [
  { id: "SN-001", item: "Ayam Geprek", time: "12.00", status: "Selesai" },
  { id: "SN-002", items: "2 Hari Lalu", time: "11.45", status: "Selesai" },
  { id: "SN-003", items: "12 Mar 2026", time: "11.45", status: "Selesai" },
];

export default function AdminDashboardPage() {
  const currentTime = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-300 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                POS Kantin Sekolah
              </h1>
              <p className="mt-1 text-gray-600">
                Dashboard Admin - Kelola penjualan dan stok
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-2xl font-semibold text-emerald-600">
                {currentTime}
              </p>
              <p className="text-sm text-gray-600 capitalize">{currentDate}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Session Status */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="border-2 border-emerald-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Status Sesi Hari Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="h-12 w-full rounded-lg bg-emerald-600 font-semibold text-white hover:bg-emerald-700">
                <Clock className="mr-2 h-5 w-5" />
                Buka Sesi (08:00 - 16:00)
              </Button>
              <p className="mt-3 text-center text-sm text-gray-600">
                Status:{" "}
                <span className="font-semibold text-green-600">Dibuka</span>
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Pemasukan Bulan Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-emerald-600">
                  Rp 8.600.000
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  +12% dari bulan lalu
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Pengeluaran Bulan Ini
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">Rp 2.530.000</p>
                <p className="mt-1 text-xs text-gray-600">
                  -5% dari bulan lalu
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link href="/admin/order-lists">
            <Card className="h-full cursor-pointer border-2 transition-shadow hover:border-emerald-200 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <ShoppingCart className="h-6 w-6" />
                  Daftar Pesanan
                </CardTitle>
                <CardDescription>Kelola pesanan pelanggan</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Lihat Pesanan
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/menu">
            <Card className="h-full cursor-pointer border-2 transition-shadow hover:border-amber-200 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600">
                  <Package className="h-6 w-6" />
                  Kelola Menu
                </CardTitle>
                <CardDescription>Tambah & edit menu items</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Kelola Menu
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/stock">
            <Card className="h-full cursor-pointer border-2 transition-shadow hover:border-blue-200 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Package className="h-6 w-6" />
                  Pembelian Stok
                </CardTitle>
                <CardDescription>Catat pembelian supplier</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Stok
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Charts Section */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Grafik Pemasukan & Pengeluaran</CardTitle>
              <CardDescription>Data mingguan</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={mockData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(value) => `Rp ${value / 1000000}M`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => {
                      if (typeof value !== "number") return value;
                      return `Rp ${(value / 1000000).toFixed(2)}M`;
                    }}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: `1px solid #e5e7eb`,
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="pemasukan"
                    fill="#10b981"
                    name="Pemasukan"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="pengeluaran"
                    fill="#ef4444"
                    name="Pengeluaran"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Menu</CardTitle>
              <CardDescription>Penjualan terbanyak</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topMenu.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b border-gray-300 pb-2 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-600">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-emerald-600">
                      {item.sales}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-600" />
              Transaksi Terakhir
            </CardTitle>
            <CardDescription>Aktivitas penjualan terkini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      ID Transaksi
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Waktu
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-gray-300 transition-colors last:border-0 hover:bg-gray-100"
                    >
                      <td className="px-4 py-3 font-medium">{tx.id}</td>
                      <td className="px-4 py-3">{tx.item}</td>
                      <td className="px-4 py-3 text-gray-600">{tx.time}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
