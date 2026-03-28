import { Container, InputSearchComponent } from "@/src/components/ui";
import { ASSETS } from "@/src/constants/assets";
import Image from "next/image";
import { CanteenRecommendationComponent } from "./CanteenRecommendation";
import { CategoryComponent } from "./Category";
import { BestChoiceComponent } from "./BestChoice";

export default function HomePage() {
  return (
    <>
      <div className="relative w-screen">
        <Image
          src={ASSETS.HOME.HEADER}
          alt={""}
          width={1920}
          height={1080}
          className="h-auto w-full object-cover"
        />
        <p className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-white">
          woeee
        </p>
      </div>

      <Container className="relative z-20 -translate-y-5">
        <InputSearchComponent classNameContainer="mb-[24px] border" />
        <CanteenRecommendationComponent classNameContainer="mb-6" />
        <CategoryComponent classNameContainer="mb-6" />
        <BestChoiceComponent />
        <div className="h-20 w-full"></div>
      </Container>
    </>
  );
}
