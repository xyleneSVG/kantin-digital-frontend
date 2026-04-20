"use client";

import { CardMenuComponent, Container } from "../../ui";
import { cn } from "@/src/lib/utils";
import { HomeItem } from "@/src/types/Home";
import { useRouter } from "next/navigation";

interface Props {
  classNameContainer?: string;
  sectionTitle: string;
  data: HomeItem["bestChoice"];
}

export function BestChoiceComponent({
  classNameContainer,
  sectionTitle,
  data,
}: Props) {
  const router = useRouter();

  return (
    <Container className={cn(classNameContainer)}>
      <h1 className="mb-5 font-mono text-[16px] font-semibold">
        {sectionTitle}
      </h1>
      <div className="flex flex-row gap-x-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {data.map((item) => (
          <div 
            key={item.id} 
            className="w-24 shrink-0 cursor-pointer"
            onClick={() => {
              const kantinId = (item as any).kantinId || "k1"; 
              router.push(`/kantin/${kantinId}?openMenu=${item.id}`);
            }}
          >
            <CardMenuComponent item={item} variant="type3" />
          </div>
        ))}
      </div>
    </Container>
  );
}