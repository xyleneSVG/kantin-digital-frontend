import { CardMenuComponent, Container } from "../../ui";
import { cn } from "@/src/lib/utils";
import { HomeItem } from "@/src/types/Home";

interface Props {
  classNameContainer?: string;
  sectionTitle: string;
  data: HomeItem["canteenRecommendation"];
}

export function CanteenRecommendationComponent({
  classNameContainer,
  sectionTitle,
  data,
}: Props) {
  return (
    <Container className={cn(classNameContainer)}>
      <h1 className="mb-5 font-mono text-[16px] font-semibold">
        {sectionTitle}
      </h1>
      <div className="flex flex-col gap-y-3.5">
        {data.map((item, index) => (
          <CardMenuComponent
            key={`canteen-${index}`}
            item={item}
            variant={"default"}
          />
        ))}
      </div>
    </Container>
  );
}
