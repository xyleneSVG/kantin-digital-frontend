import { CardMenuComponent, Container } from "../../ui";
import { cn } from "@/src/lib/utils";
import { DATA } from "@/src/constants/data";

interface Props {
  classNameContainer?: string;
}

export function BestChoiceComponent({ classNameContainer }: Props) {
  return (
    <Container className={cn(classNameContainer)}>
      <h1 className="mb-5 font-mono text-[16px] font-semibold">
        Pilihan Terbaik
      </h1>
      <div className="flex flex-row gap-x-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {DATA.home.bestChoice.map((item) => (
          <div key={item.id} className="w-24 shrink-0">
            <CardMenuComponent
              item={item}
              variant="type3"
            />
          </div>
        ))}
      </div>
    </Container>
  );
}