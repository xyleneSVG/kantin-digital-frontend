/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useAuthCheck } from "@/src/hooks/useAuthCheck";
import SplashScreen from "./SplashScreen";
import { useEffect, useState } from "react";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isChecking } = useAuthCheck();

  const [showSplash, setShowSplash] = useState(true);

  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isChecking) {
      setFadeOut(true);

      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isChecking]);

  return (
    <>
      {!isChecking && children}

      {showSplash && (
        <div
          className={`fixed inset-0 z-999 transition-opacity duration-500 ease-in-out ${
            fadeOut ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <SplashScreen />
        </div>
      )}
    </>
  );
}
