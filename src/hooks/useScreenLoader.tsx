"use client";

import SplashScreen from "@/src/components/commons/SplashScreen";

interface Props {
  isLoading: boolean;
  children: React.ReactNode;
}

export default function ScreenLoader({ isLoading, children }: Props) {
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-999 flex items-center justify-center bg-white">
        <SplashScreen />
      </div>
    );
  }

  return <>{children}</>;
}
