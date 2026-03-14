/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export const useAuthCheck = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const hasCompletedOnboarding =
      localStorage.getItem("hasCompletedOnboarding") === "true";

    if (!isLoggedIn) {
      if (!hasCompletedOnboarding) {
        if (pathname !== "/onboarding") {
          router.push("/onboarding");
        } else {
          setIsChecking(false);
        }
      } else {
        if (pathname !== "/login") {
          router.push("/login");
        } else {
          setIsChecking(false);
        }
      }
    } else {
      if (
        pathname === "/login" ||
        pathname === "/onboarding" ||
        pathname === "/"
      ) {
        router.push("/");
      } else {
        setIsChecking(false);
      }
    }
  }, [router, pathname]);

  return { isChecking };
};
