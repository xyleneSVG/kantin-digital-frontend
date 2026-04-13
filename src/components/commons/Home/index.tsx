"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Container, 
  InputSearchComponent, 
  InputComponent, 
  ButtonComponent 
} from "@/src/components/ui";

import { CanteenRecommendationComponent } from "./CanteenRecommendation";
import { CategoryComponent } from "./Category";
import { BestChoiceComponent } from "./BestChoice";
import { DATA } from "@/src/constants/data";
import { changePassword } from "@/src/services/auth";

export default function HomePage() {
  const { headerImage, canteenRecommendation, category, bestChoice } = DATA.home;

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const isFirstTime = localStorage.getItem("first_time_activation");
    if (isFirstTime === "true") {
      setShowPasswordModal(true);
    }
  }, []);

  const handleChangePassword = async () => {
    // Validasi basic
    if (!passwords.current) {
      setErrorMsg("Password saat ini wajib diisi!");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setErrorMsg("Password baru tidak cocok!");
      return;
    }
    if (passwords.new.length < 6) {
      setErrorMsg("Password baru minimal 6 karakter.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      await changePassword(passwords.current, passwords.new, passwords.confirm);

      // Jika sukses, hapus flag dari localStorage
      localStorage.removeItem("first_time_activation");
      setShowPasswordModal(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menyimpan password. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
          data={canteenRecommendation}
          classNameContainer="mb-6"
        />
        <CategoryComponent
          classNameContainer="mb-6"
          sectionTitle={"Aneka Kategori"}
          data={category}
        />
        <BestChoiceComponent
          sectionTitle={"Pilihan Terbaik"}
          data={bestChoice}
        />
      </Container>

      {/* MODAL GANTI PASSWORD FIRST TIME */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-center font-sans text-xl font-bold">Keamanan Akun</h2>
            <p className="mb-6 text-center font-sans text-sm text-gray-500">
              Silakan masukkan password bawaan Anda saat ini dan buat password baru demi keamanan.
            </p>

            <div className="mb-4 flex flex-col">
              <InputComponent
                inputType="password"
                inputName="currentPassword"
                placeholder="Password Saat Ini"
                onChange={(e: any) => setPasswords({ ...passwords, current: e.target.value })}
              />
              <InputComponent
                inputType="password"
                inputName="newPassword"
                placeholder="Password Baru"
                onChange={(e: any) => setPasswords({ ...passwords, new: e.target.value })}
              />
              <InputComponent
                inputType="password"
                inputName="confirmPassword"
                placeholder="Ulangi Password Baru"
                onChange={(e: any) => setPasswords({ ...passwords, confirm: e.target.value })}
              />
            </div>

            {/* Area Error Message */}
            {errorMsg && (
              <p className="mb-4 text-center text-sm font-medium italic text-red-500">
                "{errorMsg}"
              </p>
            )}

            <ButtonComponent
              text={isLoading ? "Menyimpan..." : "Simpan Password"}
              onClick={handleChangePassword}
              disabled={isLoading || !passwords.current || !passwords.new || !passwords.confirm}
              className={isLoading ? "opacity-50" : ""}
            />
          </div>
        </div>
      )}
    </>
  );
}