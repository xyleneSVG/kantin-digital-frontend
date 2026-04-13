/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useFrappeAuth } from "frappe-react-sdk";

const PUBLIC_PATHS = ["/login", "/onboarding"];

export const useAuthCheck = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingUI, setIsCheckingUI] = useState(true);

  const { currentUser, isLoading } = useFrappeAuth();

  useEffect(() => {
    // Tunggu Frappe selesai cek session utamanya
    if (isLoading) return;

    // CEK TAMBAHAN: Periksa apakah token hasil login manual ada di localStorage
    const hasToken = typeof window !== "undefined" ? !!localStorage.getItem("api_key") : false;

    // User dianggap login jika currentUser (Frappe) ada ATAU token (localStorage) ada
    const isLoggedIn = !!currentUser || hasToken;
    
    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    // =========================
    // 🔓 USER BELUM LOGIN
    // =========================
    if (!isLoggedIn) {
      if (!isPublicPath) {
        router.replace("/login");
        return;
      }
      setIsCheckingUI(false);
      return;
    }

    // =========================
    // 🔐 USER SUDAH LOGIN
    // =========================
    if (isLoggedIn) {
      if (isPublicPath) {
        router.replace("/");
        return;
      }
      setIsCheckingUI(false);
      return;
    }
  }, [currentUser, isLoading, pathname, router]);

  return { isChecking: isCheckingUI || isLoading };
};