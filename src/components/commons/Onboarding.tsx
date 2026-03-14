"use client";

import {
  Container,
  ButtonComponent,
  InputComponent,
  ButtonProvidersComponent,
  ImageWithProgressionComponent,
  MultilineTextComponent,
} from "@/src/components/ui";
import { DATA } from "@/src/constants/data";
import { useState } from "react";

export default function OnBoardingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const data = DATA.onboarding;
  const stepData = data[currentStep];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, data.length - 1));
  };

  return (
    <Container className="mt-10 flex h-[calc(100dvh-65px)] flex-col justify-around px-2">
      <p className="mb-5 text-center font-mono text-[24px] font-bold">
        {stepData.heading}
      </p>

      <div>
        <ImageWithProgressionComponent
          currentStep={currentStep}
          totalSteps={data.length}
          illustrationSrc={stepData.illustration}
        />

        <MultilineTextComponent
          text={stepData.title}
          className="mb-2 text-center font-sans text-[20px] font-semibold"
        />

        <MultilineTextComponent
          text={stepData.description}
          className="font-regular mb-10 text-center font-sans text-[16px]"
        />

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
            {stepData.buttonVariant.map((variant, index, array) => (
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
    </Container>
  );
}
