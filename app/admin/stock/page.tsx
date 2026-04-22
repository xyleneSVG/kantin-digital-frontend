'use client'

import React, { useState } from 'react'
import { Button } from '@/src/components/ui/og-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface StockItem {
  id: string
  namaItem: string
  jumlah: number
  uom: string
  harga: number
  supplier: string
}

const suppliers = ['CV. Segar Jaya', 'PT. Maju Mundur', 'Toko Distribusi Arum', 'UD. Berkah']
const items = ['Ayam', 'Beras', 'Minyak Goreng', 'Garam', 'Gula', 'Telur', 'Tahu', 'Tempe']
const uomOptions = ['kg', 'gram', 'liter', 'pcs', 'box', 'sak']

export default function StockPage() {
  const [supplier, setSupplier] = useState('CV. Segar Jaya')
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0])
  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: '1',
      namaItem: 'Ayam',
      jumlah: 10,
      uom: 'kg',
      harga: 50000,
      supplier: 'CV. Segar Jaya',
    }
  ])

  const handleAddItem = () => {
    const newItem: StockItem = {
      id: Date.now().toString(),
      namaItem: items[0],
      jumlah: 0,
      uom: 'kg',
      harga: 0,
      supplier: supplier,
    }
    setStockItems([...stockItems, newItem])
  }

  const handleRemoveItem = (id: string) => {
    setStockItems(stockItems.filter(item => item.id !== id))
  }

  const handleItemChange = (id: string, field: string, value: any) => {
    setStockItems(stockItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const totalHarga = stockItems.reduce((sum, item) => sum + (item.jumlah * item.harga), 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Stock purchase data:', {
      supplier,
      tanggal,
      items: stockItems
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Pembelian Stok</h1>
          <p className="text-sm text-muted-foreground mt-1">Catat pembelian barang dari supplier</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Informasi Pembelian</CardTitle>
              <CardDescription>Tentukan supplier dan tanggal pembelian</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Supplier*</label>
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {suppliers.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tanggal*</label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
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
              <Button
                type="button"
                onClick={handleAddItem}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Nama Item</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Jumlah</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">UOM</th>
                      <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Harga (Rp)</th>
                      <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Total</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockItems.map((item) => (
                      <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <select
                            value={item.namaItem}
                            onChange={(e) => handleItemChange(item.id, 'namaItem', e.target.value)}
                            className="px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            {items.map(i => (
                              <option key={i} value={i}>{i}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            value={item.jumlah}
                            onChange={(e) => handleItemChange(item.id, 'jumlah', parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-border rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
                            min="0"
                            step="0.1"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <select
                            value={item.uom}
                            onChange={(e) => handleItemChange(item.id, 'uom', e.target.value)}
                            className="px-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            {uomOptions.map(u => (
                              <option key={u} value={u}>{u}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            value={item.harga}
                            onChange={(e) => handleItemChange(item.id, 'harga', parseFloat(e.target.value) || 0)}
                            className="w-24 px-2 py-1 border border-border rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary/50"
                            min="0"
                          />
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          Rp {(item.jumlah * item.harga).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 hover:bg-destructive/10 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium">Total Pembelian:</span>
                <span className="text-3xl font-bold text-accent">Rp {totalHarga.toLocaleString('id-ID')}</span>
              </div>
              <p className="text-sm text-muted-foreground">{stockItems.length} item pembelian</p>
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Batal
              </Button>
            </Link>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Simpan Pembelian
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
