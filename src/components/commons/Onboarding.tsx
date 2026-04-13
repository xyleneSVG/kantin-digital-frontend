"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Container,
  ButtonComponent,
  InputComponent,
  ButtonProvidersComponent,
  MultilineTextComponent,
  ModalComponent,
} from "@/src/components/ui";

import { DATA } from "@/src/constants/data";
import { cn } from "@/src/lib/utils";
import { checkCustomerActivation, activateAccount } from "@/src/services/auth";

export default function OnBoardingPage() {
  const router = useRouter();
  const data = DATA.onboarding;

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Menyimpan input user (misal: nis, email)
  const [form, setForm] = useState<Record<string, string>>({});

  // State untuk modal error
  const [errorState, setErrorState] = useState({
    isOpen: false,
    title: "",
    message: "",
    highlight: "",
  });

  const stepData = data[currentStep];

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleNextStep = async () => {
    // Pastikan kita berada di step input yang tipenya 'single'
    if (stepData.buttonType === "single") {
      
      // CEK: Apakah ini step input Nomor Identitas (NIS)?
      if (stepData.inputName === "identityNumber") {
        const nis = form["identityNumber"];
        
        if (!nis) return; // Jangan lanjut kalau kosong

        setIsLoading(true);
        try {
          // 1. Panggil API pengecekan aktivasi
          const res = await checkCustomerActivation(nis);

          // LOGIKA: Kalau SUDAH AKTIF (misal flag-nya 'active' atau 'is_active')
          // Sesuaikan 'res.is_active' dengan property asli dari API-mu
          if (res.is_active || res.activated) { 
            // Tendang ke halaman login
            router.push("/login");
            return; 
          }

          // Kalau BELUM AKTIF, lanjut ke step onboarding berikutnya (misal isi email)
          proceedNext();
        } catch (err: any) {
          // Jika error (misal NIS tidak terdaftar), tampilkan di modal
          showError(err);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // Jika ini step 'single' tapi BUKAN NIS (misal step isi email)
      proceedNext();
      return;
    }

    // Jika ini step 'double' (pilihan metode aktivasi), ditangani oleh handleFinalActivation
  };

  const handleFinalActivation = async (methodVariantText: string) => {
    const nis = form["identityNumber"]; 
    const method = methodVariantText.toLowerCase().includes("whatsapp") ? "whatsapp" : "email";

    setIsLoading(true);
    try {
      await activateAccount(nis, method);
      
      // SET PENANDA: Tandai bahwa user baru saja aktivasi
      localStorage.setItem("first_time_activation", "true");
      
      // Jika berhasil, redirect ke login
      router.push("/login"); 
    } catch (err: any) {
      showError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const proceedNext = () => {
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, data.length - 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const showError = (err: any) => {
    setErrorState({
      isOpen: true,
      title: err.title || "Terjadi Kesalahan",
      message: err.message || "Gagal memproses permintaan.",
      highlight: err.highlight || "Silakan coba lagi.",
    });
  };

  return (
    <>
      <Container className="mt-10 flex h-[calc(100dvh-65px)] flex-col justify-between px-2 pb-5">
        <div className="relative mb-5 flex w-full items-center justify-center">
          {currentStep > 0 && (
            <ArrowLeft
              onClick={handlePrev}
              className="absolute left-0 size-6 cursor-pointer"
            />
          )}
          <p className="text-center font-mono text-[24px] font-bold">
            {stepData.heading}
          </p>
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div className="relative w-full">
            <AnimatePresence custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: direction > 0 ? -50 : 50,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="flex w-full flex-col items-center"
              >
                <Image
                  src={stepData.illustration}
                  alt="Onboarding Illustration"
                  width={1080}
                  height={1080}
                  priority
                  className="mb-5 size-80 object-contain"
                />

                <MultilineTextComponent
                  text={stepData.title}
                  className="mb-2 text-center font-sans text-[20px] font-semibold"
                />

                <MultilineTextComponent
                  text={stepData.description}
                  className="font-regular mb-10 text-center font-sans text-[16px]"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mb-9 flex w-full flex-row items-center justify-center gap-x-1">
            {Array.from({ length: data.length }).map((_, index) => (
              <div
                key={`dot-${index}`}
                className={cn(
                  "h-1 w-5 rounded-sm transition-colors duration-300",
                  index === currentStep ? "bg-primary" : "bg-disabled",
                )}
              />
            ))}
          </div>
          <div className="w-full">
            {stepData.buttonType === "single" ? (
              <>
                <InputComponent
                  placeholder={stepData.inputPlaceholder}
                  inputType={stepData.inputType}
                  inputName={stepData.inputName}
                  onChange={(e: any) => handleChange(stepData.inputName, e.target.value)}
                />
                <ButtonComponent
                  text={isLoading ? "Memuat..." : stepData.buttonSingleText}
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className={isLoading ? "opacity-50 grayscale" : "opacity-100"}
                />
              </>
            ) : (
              <div className="flex flex-col">
                {stepData.buttonVariant?.map((variant, index, array) => (
                  <ButtonProvidersComponent
                    key={variant.text}
                    icon={variant.icon}
                    text={variant.text}
                    color={variant.color}
                    textColor={variant.textColor}
                    showSeparator={index < array.length - 1}
                    separatedText="Atau"
                    onClick={() => handleFinalActivation(variant.text)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Tambahkan Modal Sama Seperti di Login */}
      <ModalComponent
        isOpen={errorState.isOpen}
        type={"error"}
        title={errorState.title}
        message={errorState.message}
        highlight={errorState.highlight}
        onClose={() => setErrorState({ isOpen: false, title: "", message: "", highlight: "" })}
      />
    </>
  );
}