import { CardMenuComponent, Container } from "../../ui";
import { cn } from "@/src/lib/utils";
import { HomeItem } from "@/src/types/Home";

interface Props {
  classNameContainer?: string;
  sectionTitle: string;
  data: HomeItem["category"];
}

export function CategoryComponent({
  classNameContainer,
  sectionTitle,
  data,
}: Props) {
  return (
    <Container className={cn(classNameContainer)}>
      <h1 className="mb-5 font-mono text-[16px] font-semibold">
        {sectionTitle}
      </h1>
      <div className="grid w-full grid-cols-3 gap-8">
        {data.map((item) => (
          <CardMenuComponent key={item.id} item={item} variant="type2" />
        ))}
      </div>
    </Container>
  );
}
