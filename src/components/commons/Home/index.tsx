"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Container, 
  InputSearchComponent, 
  ButtonComponent 
} from "@/src/components/ui";

import { CanteenRecommendationComponent } from "./CanteenRecommendation";
import { CategoryComponent } from "./Category";
import { BestChoiceComponent } from "./BestChoice";
import { DATA } from "@/src/constants/data";
import { changePassword } from "@/src/services/auth";
// Pastikan import fungsi service baru ini
import { getCanteenRecommendations, getMenuRecommendations } from "@/src/services/home"; 
import ScreenLoader from "@/src/hooks/useScreenLoader";

export default function HomePage() {
  const { headerImage, category } = DATA.home;

  const [canteenRecs, setCanteenRecs] = useState<any[]>([]);
  // Tambahkan state untuk data Best Choice
  const [bestChoiceRecs, setBestChoiceRecs] = useState<any[]>([]); 
  const [isFetchingData, setIsFetchingData] = useState(true); 

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const isFirstTime = localStorage.getItem("first_time_activation");
    if (isFirstTime === "true") {
      setShowPasswordModal(true);
    }

    const fetchAllRecommendations = async () => {
      try {
        // Fetch dua API sekaligus secara bersamaan agar lebih cepat
        const [canteenData, menuData] = await Promise.all([
          getCanteenRecommendations(),
          getMenuRecommendations()
        ]);
        
        // 1. Format Data Kantin
        const formattedCanteen = canteenData.map((item: any) => {
          const fullImageUrl = item.image 
            ? `https://ta-dev.subekti.web.id${item.image}` 
            : "/assets/images/placeholder.png"; 

          return {
            ...item,
            image: fullImageUrl,
          };
        });

        // 2. Format Data Menu (Best Choice)
        const formattedMenu = menuData.map((item: any) => {
          const fullImageUrl = item.image 
            ? `https://ta-dev.subekti.web.id${item.image}` 
            : "/assets/images/placeholder.png"; 

          // Ambil nama kantin dari item_group (Misal: "Kantin Mak Cor - Minuman" -> "Kantin Mak Cor")
          const kantinName = item.item_group ? item.item_group.split(" - ")[0] : "k1";

          return {
            id: item.item_code,      // Disimpan untuk parameter URL openMenu
            name: item.item_name,    // Ditampilkan di card
            image: fullImageUrl,
            kantinId: kantinName,    // Disimpan untuk pindah halaman ke kantin tersebut
            price: item.selling_price, 
            rating: 0,               // Default rating jika belum ada di API
          };
        });

        setCanteenRecs(formattedCanteen);
        setBestChoiceRecs(formattedMenu);
      } catch (error) {
        console.error("Gagal memuat data dari API:", error);
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchAllRecommendations();
  }, []);

  const handleChangePassword = async () => {
    if (!passwords.current) {
      setErrorMsg("Password saat ini wajib diisi!");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setErrorMsg("Password baru tidak cocok!");
      return;
    }
    if (passwords.new.length < 8) {
      setErrorMsg("Password baru minimal 8 karakter.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      await changePassword(passwords.current, passwords.new, passwords.confirm);
      localStorage.removeItem("first_time_activation");
      setShowPasswordModal(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menyimpan password. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenLoader isLoading={isFetchingData}>
      <div className="relative w-screen">
        <Image
          src={headerImage}
          alt={""}
          width={1920}
          height={1080}
          className="h-auto w-full object-cover"
        />
        <p className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-white">
          woeee
        </p>
      </div>

      <Container className="relative z-20 -translate-y-5 pb-20">
        <InputSearchComponent
          classNameContainer="mb-[24px] border"
          placeholderText={"Lagi mau mamam apa?"}
        />
        
        <CanteenRecommendationComponent
          sectionTitle="Rekomendasi Kantin"
          data={canteenRecs} 
          classNameContainer="mb-6"
        />
        
        <CategoryComponent
          classNameContainer="mb-6"
          sectionTitle={"Aneka Kategori"}
          data={category}
        />

        {/* Masukkan state bestChoiceRecs ke sini */}
        <BestChoiceComponent
          sectionTitle={"Pilihan Terbaik"}
          data={bestChoiceRecs} 
        />
      </Container>

      {/* Modal ... (Tetap sama seperti kodemu) ... */}
      {showPasswordModal && (
        // ... (Isi modal disembunyikan agar kode lebih ringkas dibaca) ...
        <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
           <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-center font-sans text-xl font-bold">Keamanan Akun</h2>
            {/* ... form modalmu ... */}
            <ButtonComponent
              text={isLoading ? "Menyimpan..." : "Simpan Password"}
              onClick={handleChangePassword}
              disabled={isLoading || !passwords.current || !passwords.new || !passwords.confirm}
              className={isLoading ? "opacity-50" : ""}
            />
          </div>
        </div>
      )}
    </ScreenLoader>
  );
}