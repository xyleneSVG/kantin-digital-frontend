"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/og-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/og-input";
import { Settings, Upload, X } from "lucide-react";

import ScreenLoader from "@/src/hooks/useScreenLoader";
import { getCanteenDetail } from "@/src/services/user";
import { updateCanteen } from "@/src/services/admin";

interface CanteenInfo {
  kantin_id: string;
  nama_kantin: string;
  image_url: string;
  deskripsi_lokasi: string;
}

export default function CanteenSettingsPage() {
  const [canteenInfo, setCanteenInfo] = useState<CanteenInfo>({
    kantin_id: "",
    nama_kantin: "",
    image_url: "",
    deskripsi_lokasi: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState("");
  const [operationalTime, setOperationalTime] = useState({
    open: "",
    close: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const company = localStorage.getItem("company") || "";
        const data = await getCanteenDetail(company);
        setCanteenInfo({
          kantin_id: data.canteen_id,
          nama_kantin: data.canteen_name,
          image_url: data.image
            ? `https://ta-dev.subekti.web.id/api/method/${data.image}`
            : "",
          deskripsi_lokasi: data.location_description || "",
        });
        setPreviewImage(
          data.image
            ? `https://ta-dev.subekti.web.id/api/method/${data.image}`
            : "",
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCanteenInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 1 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      alert("Ukuran gambar maksimal 1MB");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewImage(result);
      setCanteenInfo((prev) => ({
        ...prev,
        image_url: result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewImage("");
    setCanteenInfo((prev) => ({
      ...prev,
      image_url: "",
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: any = {
        canteen_id: canteenInfo.kantin_id,
        canteen_name: canteenInfo.nama_kantin,
        location_description: canteenInfo.deskripsi_lokasi,
      };
      if (canteenInfo.image_url?.startsWith("data:image")) {
        payload.image = canteenInfo.image_url;
      }
      await updateCanteen(payload);
      setSuccessMessage("Data kantin berhasil disimpan!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenLoader isLoading={loading}>
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-40 border-b border-gray-300 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              <Settings className="h-8 w-8 text-emerald-600" />
              Pengaturan Kantin
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Kelola informasi dan keterangan kantin sekolah
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {successMessage && (
            <Card className="mb-6 border-2 border-green-200 bg-green-50">
              <CardContent className="py-4">
                <p className="font-medium text-green-700">{successMessage}</p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ID Kantin</CardTitle>
                <CardDescription>Identitas unik kantin</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="text"
                  name="kantin_id"
                  value={canteenInfo.kantin_id}
                  onChange={handleInputChange}
                  disabled
                  className="border-gray-300 bg-gray-100 text-gray-900"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nama Kantin</CardTitle>
                <CardDescription>
                  Nama yang akan ditampilkan di aplikasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="text"
                  name="nama_kantin"
                  value={canteenInfo.nama_kantin}
                  onChange={handleInputChange}
                  disabled
                  className="border-gray-300 bg-gray-100 text-gray-900"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Foto Kantin</CardTitle>
                <CardDescription>
                  Upload gambar kantin untuk ditampilkan di aplikasi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {previewImage && (
                  <div className="relative inline-block">
                    <img
                      src={previewImage}
                      className="h-48 w-48 rounded-lg border-2 border-gray-300 object-cover"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 rounded-full bg-red-600 p-1 text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3">
                  <Upload className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Pilih gambar atau drag & drop
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Jam Operasional</CardTitle>
                <CardDescription>
                  Atur jam buka dan tutup kantin
                </CardDescription>
              </CardHeader>

              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Jam Buka
                  </label>
                  <input
                    type="time"
                    value={operationalTime.open}
                    onChange={(e) =>
                      setOperationalTime((prev) => ({
                        ...prev,
                        open: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Jam Tutup
                  </label>
                  <input
                    type="time"
                    value={operationalTime.close}
                    onChange={(e) =>
                      setOperationalTime((prev) => ({
                        ...prev,
                        close: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deskripsi Lokasi</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  name="deskripsi_lokasi"
                  value={canteenInfo.deskripsi_lokasi}
                  onChange={handleInputChange}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3"
                  rows={3}
                />
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 gap-2 bg-emerald-600 text-white"
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </ScreenLoader>
  );
}
