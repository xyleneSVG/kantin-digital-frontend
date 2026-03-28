import { Container, InputSearchComponent } from "@/src/components/ui";
import Image from "next/image";
import { CanteenRecommendationComponent } from "./CanteenRecommendation";
import { CategoryComponent } from "./Category";
import { BestChoiceComponent } from "./BestChoice";
import { DATA } from "@/src/constants/data";

export default function HomePage() {
  return (
    <>
      <div className="relative w-screen">
        <Image
          src={DATA.home.headerImage}
          alt={""}
          width={1920}
          height={1080}
          className="h-auto w-full object-cover"
        />
        <p className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-white">
          woeee
        </p>
      </div>

      <Container className="relative z-20 -translate-y-5 pb-20">
        <InputSearchComponent
          classNameContainer="mb-[24px] border"
          placeholderText={"Lagi mau mamam apa?"}
        />
        <CanteenRecommendationComponent
          sectionTitle="Rekomendasi Kantin"
          data={DATA.home.canteenRecommendation}
          classNameContainer="mb-6"
        />
        <CategoryComponent
          classNameContainer="mb-6"
          sectionTitle={"Aneka Kategori"}
          data={DATA.home.category}
        />
        <BestChoiceComponent
          sectionTitle={"Pilihan Terbaik"}
          data={DATA.home.bestChoice}
        />
      </Container>
    </>
  );
}
