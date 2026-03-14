/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useFrappeAuth } from "frappe-react-sdk"; // <-- Import dari Frappe SDK

export const useAuthCheck = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingUI, setIsCheckingUI] = useState(true);

  // Ambil data user dari Frappe SDK
  // isLoading: true saat Frappe sedang ngecek cookie ke server
  // currentUser: berisi data user kalau login, atau null/undefined kalau belum
  const { currentUser, isLoading } = useFrappeAuth();

  useEffect(() => {
    // Kalau Frappe masih loading ngecek sesi di server, tunggu dulu!
    if (isLoading) return;

    // Cek apakah ada currentUser (artinya sudah login)
    const isLoggedIn = !!currentUser; 
    
    // Status onboarding tetap baca dari localStorage
    const hasCompletedOnboarding =
      localStorage.getItem("hasCompletedOnboarding") === "true";

    if (!isLoggedIn) {
      if (!hasCompletedOnboarding) {
        if (pathname !== "/onboarding") {
          router.push("/onboarding");
        } else {
          setIsCheckingUI(false);
        }
      } else {
        if (pathname !== "/login") {
          router.push("/login");
        } else {
          setIsCheckingUI(false);
        }
      }
    } else {
      if (
        pathname === "/login" ||
        pathname === "/onboarding" ||
        pathname === "/"
      ) {
        router.push("/"); // Lempar ke halaman utama aplikasi
      } else {
        setIsCheckingUI(false);
      }
    }
  }, [currentUser, isLoading, router, pathname]);

  // Halaman dianggap "sedang ngecek" kalau UI masih ngecek ATAU Frappe masih loading
  return { isChecking: isCheckingUI || isLoading };
};