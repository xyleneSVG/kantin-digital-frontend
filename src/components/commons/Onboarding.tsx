"use client";

import {
  Container,
  ButtonComponent,
  InputComponent,
  ButtonProvidersComponent,
  MultilineTextComponent,
} from "@/src/components/ui";
import { DATA } from "@/src/constants/data";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/src/lib/utils";

export default function OnBoardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const data = DATA.onboarding;
  const stepData = data[currentStep];

  const handleNext = () => {
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, data.length - 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
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
              />
              <ButtonComponent
                text={stepData.buttonSingleText}
                onClick={handleNext}
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
                  onClick={handleNext}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
