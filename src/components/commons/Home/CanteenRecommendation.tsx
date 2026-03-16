import { ICON } from "@/src/constants/assets";
import Image from "next/image";
import { Container } from "../../ui";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { DATA } from "@/src/constants/data";

interface Props {
  classNameContainer?: string;
}

export function CanteenRecommendationComponent({ classNameContainer }: Props) {
  return (
    <Container className={cn(classNameContainer)}>
      <h1 className="mb-5 font-mono text-[16px] font-semibold">
        Rekomendasi Kantin
      </h1>
      <div className="flex flex-col gap-y-3.5">
        {DATA.home.canteenRecommendation.map((item, index) => (
          <Link
            key={index}
            href={item.id}
            className="flex w-full flex-row items-center gap-x-3.5 overflow-hidden rounded-sm bg-[#ede9e6] px-3 py-1.5"
          >
            <Image
              src={item.image}
              alt={item.name || "Kantin"}
              width={1920}
              height={1920}
              className="size-12 rounded-md object-cover"
            />
            <div className="flex flex-col gap-y-2 font-sans font-medium">
              <p className="text-[14px]">{item.name}</p>

              <div className="flex flex-row items-center gap-x-2.5">
                <Image
                  src={ICON.STAR}
                  alt="Star"
                  width={1920}
                  height={1920}
                  className="size-3.5"
                />
                <p className="text-[12px]">{item.rating}/5.0</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
