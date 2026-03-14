import { ASSETS } from "@/src/constants/assets";
import Image from "next/image";

export default function SplashScreen() {
  return (
    <div className="bg-primary/60 backdrop-blur-md flex h-dvh w-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <Image
          src={ASSETS.SPLASHSCREEN}
          alt="Splash Screen Logo"
          width={160}
          height={120}
          className="mb-4 h-30 w-40"
        />
        <p className="text-primary-foreground w-max font-mono text-[28px] font-bold">
          POS Stemba
        </p>
      </div>
    </div>
  );
}