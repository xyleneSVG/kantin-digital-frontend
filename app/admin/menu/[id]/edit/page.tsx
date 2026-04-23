"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { useParams } from "next/navigation";
import { editMenu, getMenuDetail } from "@/src/services/admin";
import ScreenLoader from "@/src/hooks/useScreenLoader";

export default function EditMenuPage() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const params = useParams();
  const menuId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    namaItem: "",
    grupItem: "",
    hargaJual: "",
    deskripsi: "",
    lacak_stok: false,
    uom: "",
    kuantitasUom: 1,
  });

  const [conversions, setConversions] = useState<any[]>([]);
  const [image, setImage] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const apiKey = localStorage.getItem("api_key");
        const apiSecret = localStorage.getItem("api_secret");

        const res = await getMenuDetail({
          api_key: apiKey,
          api_secret: apiSecret,
          item_code: menuId,
        });

        const data = res.data;

        setFormData({
          namaItem: data.item_name || "",
          grupItem: data.item_group?.split(" - ")[1] || "",
          hargaJual: data.selling_price?.toString() || "",
          deskripsi: data.description || "",
          lacak_stok: Boolean(data.is_stock_item),
          uom: data.stock_uom || "",
          kuantitasUom: 1,
        });

        setConversions(
          data.uoms?.map((u: any) => ({
            dari: data.stock_uom,
            ke: u.uom,
            jumlah: u.conversion_factor,
          })) || [],
        );

        if (data.image) {
          setImage(`https://ta-dev.subekti.web.id${data.image}`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (menuId) fetchDetail();
  }, [menuId]);

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
      const apiKey = localStorage.getItem("api_key");
      const apiSecret = localStorage.getItem("api_secret");
      const company = localStorage.getItem("company");

      const payload: any = {
        api_key: apiKey,
        api_secret: apiSecret,
        item_code: menuId,
        item_name: formData.namaItem,
        item_group: formData.grupItem,
        stock_uom: formData.uom,
        description: formData.deskripsi,
        uoms: conversions.map((c) => ({
          uom: c.ke,
          conversion_factor: Number(c.jumlah),
        })),
        is_stock_item: formData.lacak_stok,
        selling_price: Number(formData.hargaJual),
        company,
      };

      if (newImage) {
        payload.image = newImage;
      }

      await editMenu(payload);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenLoader isLoading={isLoading}>
      <div className="bg-background min-h-screen">
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="rounded-lg bg-white px-6 py-4 text-center shadow-lg">
              <p className="text-sm font-medium text-green-600">
                Berhasil menyimpan perubahan
              </p>
            </div>
          </div>
        )}

        <header className="border-border bg-card border-b">
          <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <Link href="/admin/menu">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
            </Link>
            <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
              Edit Menu
            </h1>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Dasar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Nama Item
                  </label>
                  <input
                    type="text"
                    name="namaItem"
                    value={formData.namaItem}
                    onChange={handleInputChange}
                    className="border-border w-full rounded-lg border px-4 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Pilih Grup
                  </label>
                  <select
                    name="grupItem"
                    value={formData.grupItem}
                    onChange={handleInputChange}
                    className="border-border w-full rounded-lg border px-4 py-2"
                  >
                    <option value="">Pilih Grup</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Camilan">Camilan</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Harga Jual
                  </label>
                  <input
                    type="number"
                    name="hargaJual"
                    value={formData.hargaJual}
                    onChange={handleInputChange}
                    className="border-border w-full rounded-lg border px-4 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Deskripsi
                  </label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    rows={4}
                    className="border-border w-full rounded-lg border px-4 py-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Foto Menu</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="cursor-pointer rounded-lg border-2 border-dashed p-8 text-center"
                >
                  <Upload className="mx-auto mb-3 h-12 w-12" />
                  <label className="mb-2 block text-sm font-medium">
                    Upload Gambar
                  </label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNewImage(reader.result as string);
                        setImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                  {image && (
                    <img
                      src={image}
                      className="mx-auto mt-4 h-32 object-contain"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lacak Stok</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="lacak_stok"
                    checked={formData.lacak_stok}
                    onChange={handleInputChange}
                    className="border-border h-4 w-4 rounded"
                  />
                  <label className="text-foreground text-sm font-medium">
                    Jika aktif, sistem akan mencatat setiap perubahan jumlah
                    stok item ini
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Unit Pengukuran (UOM)</CardTitle>
                <CardDescription>Perbarui satuan dan konversi</CardDescription>
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
                    >
                      <option value="">Pilih UOM</option>
                      <option value="Pcs">Pcs</option>
                      <option value="Gram">Gram</option>
                      <option value="Ml">ML</option>
                      <option value="Liter">Liter</option>
                      <option value="Box">Box</option>
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
                    />
                  </div>
                </div>

                <div className="border-border border-t pt-4">
                  <div className="mb-4">
                    <h4 className="text-foreground mb-3 font-medium">
                      Konversi UOM
                    </h4>
                    {conversions.length > 0 && (
                      <div className="space-y-3">
                        {conversions.map((conv, idx) => (
                          <div key={idx} className="flex items-end gap-2">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={conv.dari}
                                readOnly
                                className="border-border bg-muted w-full rounded border px-3 py-2"
                              />
                            </div>
                            <div className="flex-1">
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
                                className="border-border w-full rounded border px-3 py-2"
                              />
                            </div>
                            <div className="flex-1">
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
                                className="border-border w-full rounded border px-3 py-2"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveConversion(idx)}
                              className="rounded p-2"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </ScreenLoader>
  );
}
