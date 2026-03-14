"use client";

import { useAuthCheck } from "@/src/hooks/useAuthCheck";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isChecking } = useAuthCheck();

  if (isChecking) {
    return null; 
  }

  return <>{children}</>;
}