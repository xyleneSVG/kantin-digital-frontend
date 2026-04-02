/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useFrappeAuth } from "frappe-react-sdk";

export const useAuthCheck = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingUI, setIsCheckingUI] = useState(true);

  const { currentUser, isLoading } = useFrappeAuth();

  useEffect(() => {
    // Tunggu Frappe selesai cek session
    if (isLoading) return;

    const isLoggedIn = !!currentUser;

    // onboarding status
    const hasCompletedOnboarding =
      typeof window !== "undefined" &&
      localStorage.getItem("hasCompletedOnboarding") === "true";

    // =========================
    // 🔓 USER BELUM LOGIN
    // =========================
    if (!isLoggedIn) {
      // belum onboarding → paksa ke onboarding
      if (!hasCompletedOnboarding) {
        if (pathname !== "/onboarding") {
          router.replace("/onboarding");
          return;
        }
      } else {
        // sudah onboarding → paksa ke login
        if (pathname !== "/login") {
          router.replace("/login");
          return;
        }
      }

      // kalau sudah di halaman yang benar
      setIsCheckingUI(false);
      return;
    }

    // =========================
    // 🔐 USER SUDAH LOGIN
    // =========================
    if (isLoggedIn) {
      // cegah akses ke login & onboarding
      if (pathname === "/login" || pathname === "/onboarding") {
        router.replace("/");
        return;
      }

      // allow akses halaman lain
      setIsCheckingUI(false);
      return;
    }
  }, [currentUser, isLoading, pathname, router]);

  return { isChecking: isCheckingUI || isLoading };
};
