import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface ImageWithProgressionProps {
  currentStep: number;
  totalSteps: number;
  illustrationSrc: string;
  imageClassName?: string;
  dotsClassName?: string;
}

export function ImageWithProgressionComponent({
  currentStep,
  totalSteps,
  illustrationSrc,
  imageClassName,
  dotsClassName,
}: ImageWithProgressionProps) {
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.35 }}
          className={cn("flex justify-center", imageClassName)}
        >
          <Image
            src={illustrationSrc}
            alt="On Boarding"
            width={1080}
            height={1080}
            className="size-80"
          />
        </motion.div>
      </AnimatePresence>

      <div
        className={cn(
          "mb-9 flex w-full flex-row items-center justify-center gap-x-1",
          dotsClassName,
        )}
      >
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={`dot-${index}`}
            className={cn(
              index === currentStep ? "bg-primary" : "bg-disabled",
              "h-1 w-5 rounded-sm",
            )}
          />
        ))}
      </div>
    </>
  );
}
