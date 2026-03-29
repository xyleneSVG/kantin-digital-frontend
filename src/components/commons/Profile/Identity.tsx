import Image from "next/image";
import { Pencil } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Props {
  classNameCOntainer?: string;
  photoProfile: string;
  name: string;
  nim: string;
}

export function IdentityComponent({
  classNameCOntainer,
  photoProfile,
  name,
  nim,
}: Props) {
  return (
    <div
      className={cn(
        `flex w-full flex-row items-center justify-between px-5 `,
        classNameCOntainer,
      )}
    >
      <div className="flex flex-row items-center gap-x-3">
        <Image
          src={photoProfile}
          alt={"photo profile"}
          width={1920}
          height={1920}
          className="size-11 rounded-full object-cover"
        ></Image>
        <div>
          <p className="text-[15px] font-medium">{name}</p>
          <p className="text-[12px] font-light">{nim}</p>
        </div>
      </div>
      <Pencil className="size-5" />
    </div>
  );
}
