"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/og-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Plus, Trash2, ShoppingCart, DollarSign, Clock } from "lucide-react";

interface CartItem {
  id: string;
  namaItem: string;
  harga: number;
  jumlah: number;
}

const menuItems = [
  { id: "1", nama: "Ayam Geprek", harga: 25000 },
  { id: "2", nama: "Es Teh Manis", harga: 5000 },
  { id: "3", nama: "Gorengan Tahu", harga: 3000 },
  { id: "4", nama: "Nasi Kuning", harga: 15000 },
  { id: "5", nama: "Bakso Urat", harga: 12000 },
  { id: "6", nama: "Lumpia", harga: 8000 },
  { id: "7", nama: "Soto Ayam", harga: 20000 },
  { id: "8", nama: "Es Jeruk", harga: 4000 },
];

export default function TransactionsPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const handleAddItem = (itemId: string) => {
    const item = menuItems.find((m) => m.id === itemId);
    if (!item) return;

    const existingItem = cart.find((c) => c.id === itemId);
    if (existingItem) {
      setCart(
        cart.map((c) => (c.id === itemId ? { ...c, jumlah: c.jumlah + 1 } : c)),
      );
    } else {
      setCart([
        ...cart,
        {
          id: itemId,
          namaItem: item.nama,
          harga: item.harga,
          jumlah: 1,
        },
      ]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setCart(cart.filter((c) => c.id !== itemId));
  };

  const handleChangeQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
    } else {
      setCart(
        cart.map((c) => (c.id === itemId ? { ...c, jumlah: newQty } : c)),
      );
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.harga * item.jumlah,
    0,
  );

  const handleCheckout = () => {
    console.log("Checkout:", { cart, paymentMethod, totalPrice });
    alert(
      `Transaksi sebesar Rp ${totalPrice.toLocaleString("id-ID")} berhasil!`,
    );
    setCart([]);
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border bg-card sticky top-0 z-40 border-b">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <h1 className="text-foreground flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <ShoppingCart className="text-primary h-8 w-8" />
            Transaksi Penjualan
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Tambahkan item menu dan selesaikan transaksi
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Pilih Menu</CardTitle>
                <CardDescription>
                  Klik untuk menambahkan ke keranjang
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleAddItem(item.id)}
                      className="border-border hover:border-primary hover:bg-primary/5 group rounded-lg border-2 p-3 transition-all"
                    >
                      <p className="text-foreground group-hover:text-primary mb-1 line-clamp-2 text-left text-sm font-semibold transition-colors">
                        {item.nama}
                      </p>
                      <p className="text-primary text-sm font-bold">
                        Rp {item.harga.toLocaleString("id-ID")}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Keranjang</CardTitle>
                <CardDescription>{cart.length} item</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {cart.length > 0 ? (
                    cart.map((item) => (
                      <div
                        key={item.id}
                        className="border-border flex items-center justify-between gap-2 border-b pb-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground truncate text-sm font-medium">
                            {item.namaItem}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Rp {item.harga.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              handleChangeQuantity(item.id, item.jumlah - 1)
                            }
                            className="border-border hover:bg-muted rounded border px-2 py-1 transition-colors"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">
                            {item.jumlah}
                          </span>
                          <button
                            onClick={() =>
                              handleChangeQuantity(item.id, item.jumlah + 1)
                            }
                            className="border-border hover:bg-muted rounded border px-2 py-1 transition-colors"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="hover:bg-destructive/10 ml-1 rounded p-1 transition-colors"
                          >
                            <Trash2 className="text-destructive h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground py-8 text-center text-sm">
                      Keranjang kosong
                    </p>
                  )}
                </div>

                {cart.length > 0 && <div className="border-border border-t" />}

                {cart.length > 0 && (
                  <div>
                    <label className="text-foreground mb-2 block text-sm font-medium">
                      Metode Pembayaran
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="border-border focus:ring-primary/50 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                    >
                      <option value="cash">Tunai</option>
                      <option value="card">Kartu</option>
                      <option value="digital">Dompet Digital</option>
                    </select>
                  </div>
                )}

                {cart.length > 0 && (
                  <div className="border-border space-y-2 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">
                        Rp {totalPrice.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="text-primary flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Selesaikan Transaksi
                </Button>

                {cart.length === 0 && (
                  <p className="text-muted-foreground text-center text-xs">
                    Pilih menu untuk memulai transaksi
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
