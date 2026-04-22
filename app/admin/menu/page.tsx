"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/og-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import Link from "next/link";
import ScreenLoader from "@/src/hooks/useScreenLoader";
import { getAdminMenuList } from "@/src/services/admin";

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const company = localStorage.getItem("company");
        if (!company) return;
        const data = await getAdminMenuList(company);
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Hapus item ini?")) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.grup.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <ScreenLoader isLoading={isLoading}>
      <div className="bg-background min-h-screen">
        <header className="border-border bg-card sticky top-0 z-50 border-b">
          <div className="mx-auto bg-background max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-foreground text-2xl font-bold sm:text-3xl">
                  Kelola Menu
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Kantin:{" "}
                  <span className="font-bold text-emerald-600">
                    {typeof window !== "undefined"
                      ? localStorage.getItem("company")
                      : ""}
                  </span>
                </p>
              </div>
              <Link href="/admin/menu/add">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Menu
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Cari Menu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-3 left-3 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Cari nama menu atau grup..."
                  className="border-border focus:ring-emerald-500/50 w-full rounded-lg border py-2 pr-4 pl-10 focus:ring-2 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden transition-shadow hover:shadow-lg"
                >
                  <div className="h-40 w-full relative bg-gray-100 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.nama}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <p className="text-4xl">🍴</p>
                        <p className="text-muted-foreground text-[10px] uppercase mt-2">
                          No Image
                        </p>
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-tight truncate">
                          {item.nama}
                        </CardTitle>
                        <CardDescription className="text-xs uppercase font-bold text-emerald-600 mt-1">
                          {item.grup}
                        </CardDescription>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          item.tersedia
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.tersedia ? "Tersedia" : "Habis"}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="mb-4 border-b pb-4 border-gray-100">
                      <p className="text-muted-foreground text-sm line-clamp-2 min-h-[40px]">
                        {item.deskripsi}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-emerald-600 text-xl font-bold">
                          Rp {item.harga.toLocaleString("id-ID")}
                        </p>
                        <p className="text-gray-500 text-xs italic">
                          Stok: {item.stok}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/admin/menu/${item.id}/edit`}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          className="w-full border-gray-200"
                        >
                          <Edit2 className="mr-2 h-3 w-3" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-muted-foreground text-sm">
                  Tidak ada menu ditemukan
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ScreenLoader>
  );
}