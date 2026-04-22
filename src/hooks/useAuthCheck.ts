/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useFrappeAuth } from "frappe-react-sdk";

const PUBLIC_PATHS = ["/login", "/onboarding", "/admin/login"];

export const useAuthCheck = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingUI, setIsCheckingUI] = useState(true);

  const { currentUser, isLoading } = useFrappeAuth();

  useEffect(() => {
    if (isLoading) return;

    const hasToken = typeof window !== "undefined" ? !!localStorage.getItem("api_key") : false;
    const isLoggedIn = !!currentUser || hasToken;
    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    if (!isLoggedIn) {
      if (!isPublicPath) {
        if (pathname.startsWith("/admin")) {
          router.replace("/admin/login");
        } else {
          router.replace("/login");
        }
        return;
      }
      setIsCheckingUI(false);
      return;
    }

    if (isLoggedIn) {
      if (isPublicPath) {
        if (pathname.startsWith("/admin")) {
          router.replace("/admin");
        } else {
          router.replace("/");
        }
        return;
      }
      setIsCheckingUI(false);
      return;
    }
  }, [currentUser, isLoading, pathname, router]);

  return { isChecking: isCheckingUI || isLoading };
};