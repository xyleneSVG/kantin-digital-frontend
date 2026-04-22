"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/src/components/ui/og-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { ArrowLeft, Upload, Plus, X } from "lucide-react";
import Link from "next/link";
import { createMenu } from "@/src/services/admin";

export default function AddMenuPage() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    namaItem: "",
    grupItem: "Makanan Utama",
    hargaJual: "",
    deskripsi: "",
    tersedia: false,
    uom: "pcs",
    kuantitasUom: 1,
  });

  const [conversions, setConversions] = useState<any[]>([]);
  const [image, setImage] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddConversion = () => {
    setConversions([...conversions, { dari: formData.uom, ke: "", jumlah: 1 }]);
  };

  const handleRemoveConversion = (idx: number) => {
    setConversions(conversions.filter((_, i) => i !== idx));
  };

  const handleConversionChange = (idx: number, field: string, value: any) => {
    const updated = [...conversions];
    updated[idx][field] = value;
    setConversions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const api_key = localStorage.getItem("api_key");
      const api_secret = localStorage.getItem("api_secret");
      const company = localStorage.getItem("company");

      const payload: any = {
        api_key,
        api_secret,
        item_name: formData.namaItem,
        item_group: formData.grupItem,
        stock_uom: formData.uom,
        uoms: [
          {
            uom: formData.uom,
            conversion_factor: Number(formData.kuantitasUom),
          },
          ...conversions.map((c) => ({
            uom: c.ke,
            conversion_factor: Number(c.jumlah),
          })),
        ],
        is_stock_item: formData.tersedia,
        selling_price: Number(formData.hargaJual),
        company,
      };

      if (base64Image) {
        payload.image = base64Image;
      }

      await createMenu(payload);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border bg-card border-b">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <Link href="/admin/menu">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
            Tambah Menu Baru
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Lengkapi informasi menu kantin
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>Masukkan detail umum menu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-foreground mb-2 block text-sm font-medium">
                  Nama Item*
                </label>
                <input
                  type="text"
                  name="namaItem"
                  value={formData.namaItem}
                  onChange={handleInputChange}
                  placeholder="Contoh: Ayam Geprek"
                  className="border-border focus:ring-primary/50 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">
                    Grup Item*
                  </label>
                  <select
                    name="grupItem"
                    value={formData.grupItem}
                    onChange={handleInputChange}
                    className="border-border focus:ring-primary/50 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                    required
                  >
                    <option value="Minuman">Minuman</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Camilan">Camilan</option>
                  </select>
                </div>

                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">
                    Harga Jual (Rp)*
                  </label>
                  <input
                    type="number"
                    name="hargaJual"
                    value={formData.hargaJual}
                    onChange={handleInputChange}
                    placeholder="25000"
                    className="border-border focus:ring-primary/50 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-foreground mb-2 block text-sm font-medium">
                  Deskripsi*
                </label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  placeholder="Deskripsi lengkap menu..."
                  rows={4}
                  className="border-border focus:ring-primary/50 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Foto Menu</CardTitle>
              <CardDescription>Upload gambar untuk menu</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-primary/30 hover:border-primary/50 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors"
              >
                <Upload className="text-primary/50 mx-auto mb-3 h-12 w-12" />
                <p className="text-foreground mb-1 font-medium">
                  Klik untuk upload atau drag & drop
                </p>
                <p className="text-muted-foreground text-sm">
                  PNG, JPG hingga 5MB
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setBase64Image(reader.result as string);
                      setImage(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                {image && (
                  <img
                    src={image}
                    className="mx-auto mt-3 h-32 object-contain"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ketersediaan & Stok</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="tersedia"
                  checked={formData.tersedia}
                  onChange={handleInputChange}
                  className="border-border h-4 w-4 rounded"
                  required
                />
                <label className="text-foreground text-sm font-medium">
                  Item tersedia untuk dijual?
                </label>
              </div>
              <p className="text-muted-foreground text-xs">
                Uncheck jika item sedang habis atau tidak ingin dijual
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Unit Pengukuran (UOM)</CardTitle>
              <CardDescription>Tentukan satuan dan konversi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">
                    UOM Utama*
                  </label>
                  <select
                    name="uom"
                    value={formData.uom}
                    onChange={handleInputChange}
                    className="border-border focus:ring-primary/50 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                    required
                  >
                    <option value="pcs">Pcs</option>
                    <option value="gram">Gram</option>
                    <option value="ml">ML</option>
                    <option value="liter">Liter</option>
                    <option value="box">Box</option>
                  </select>
                </div>

                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">
                    Jumlah Per UOM*
                  </label>
                  <input
                    type="number"
                    name="kuantitasUom"
                    value={formData.kuantitasUom}
                    onChange={handleInputChange}
                    className="border-border focus:ring-primary/50 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:outline-none"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="border-border border-t pt-4">
                <div className="mb-4">
                  <h4 className="text-foreground mb-3 font-medium">
                    Konversi UOM
                  </h4>
                  {conversions.length > 0 ? (
                    <div className="space-y-3">
                      {conversions.map((conv, idx) => (
                        <div key={idx} className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="text-muted-foreground mb-1 block text-xs">
                              Dari
                            </label>
                            <input
                              type="text"
                              value={conv.dari}
                              readOnly
                              className="border-border bg-muted w-full rounded border px-3 py-2"
                              required
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-muted-foreground mb-1 block text-xs">
                              Ke
                            </label>
                            <input
                              type="text"
                              value={conv.ke}
                              onChange={(e) =>
                                handleConversionChange(
                                  idx,
                                  "ke",
                                  e.target.value,
                                )
                              }
                              placeholder="Contoh: gram"
                              className="border-border focus:ring-primary/50 w-full rounded border px-3 py-2 focus:ring-2 focus:outline-none"
                              required
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-muted-foreground mb-1 block text-xs">
                              Jumlah
                            </label>
                            <input
                              type="number"
                              value={conv.jumlah}
                              onChange={(e) =>
                                handleConversionChange(
                                  idx,
                                  "jumlah",
                                  e.target.value,
                                )
                              }
                              className="border-border focus:ring-primary/50 w-full rounded border px-3 py-2 focus:ring-2 focus:outline-none"
                              min="1"
                              required
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveConversion(idx)}
                            className="hover:bg-destructive/10 rounded p-2 transition-colors"
                          >
                            <X className="text-destructive h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddConversion}
                    className="mt-3 w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Konversi
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4">
            <Link href="/admin/menu" className="flex-1">
              <Button variant="outline" className="w-full">
                Batal
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
            >
              {isSubmitting ? "Loading..." : "Simpan Menu"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}