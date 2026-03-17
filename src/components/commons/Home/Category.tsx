import { CardMenuComponent, Container } from "../../ui";
import { cn } from "@/src/lib/utils";
import { DATA } from "@/src/constants/data";

interface Props {
  classNameContainer?: string;
}

export function CategoryComponent({ classNameContainer }: Props) {
  return (
    <Container className={cn(classNameContainer)}>
      <h1 className="mb-5 font-mono text-[16px] font-semibold">
        Aneka Kategori
      </h1>
      <div className="grid grid-cols-3 gap-9.5 w-full">
        {DATA.home.category.map((item) => (
          <CardMenuComponent
            key={item.id}
            item={item}
            variant="type2"
          />
        ))}
      </div>
    </Container>
  );
}
