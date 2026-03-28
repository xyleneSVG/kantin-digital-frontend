import { Container, HeaderWithBackButtonComponent } from "@/src/components/ui";
import { ASSETS } from "@/src/constants/assets";
import {
  ChevronRight,
  Info,
  LogOut,
  Pencil,
  ScrollText,
  UserSearch,
} from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="bg-background-dark h-screen">
      <HeaderWithBackButtonComponent
        className={"pt-5 pb-6.25"}
        title={"Profilku"}
      />
      <Container needPadding={false} type="round" className="bg-grey h-[calc(100vh-69px)] pt-5">
        <div className="mb-4 flex w-full flex-row items-center justify-between px-5 py-2.5">
          <div className="flex flex-row items-center gap-x-3">
            <Image
              src={ASSETS.PROFILE}
              alt={"photo profile"}
              width={1920}
              height={1920}
              className="size-11 rounded-full object-cover"
            ></Image>
            <div>
              <p className="text-[15px] font-medium">Dhavin Fasya Alvianto</p>
              <p className="text-[12px] font-light">224118624</p>
            </div>
          </div>
          <Pencil className="size-5" />
        </div>
        <div className="mb-14">
          <p className="mb-2 pl-4 text-[12px] font-light">Umum</p>
          <div className="bg-background flex w-full flex-row items-center justify-between px-4 py-2 font-medium">
            <div className="flex flex-row items-center gap-x-2.5">
              <UserSearch className="text-[20px]" />
              <p className="text-[12px]">FAQ</p>
            </div>
            <ChevronRight className="text-[14px]" />
          </div>
          <div className="bg-background flex w-full flex-row items-center justify-between px-4 py-2 font-medium">
            <div className="flex flex-row items-center gap-x-2.5">
              <ScrollText className="text-[20px]" />
              <p className="text-[12px]">Ketentuan Pengguna</p>
            </div>
            <ChevronRight className="text-[14px]" />
          </div>
          <div className="bg-background flex w-full flex-row items-center justify-between px-4 py-2 font-medium">
            <div className="flex flex-row items-center gap-x-2.5">
              <Info className="text-[20px]" />
              <p className="text-[12px]">Tentang POS STEMBA</p>
            </div>
            <ChevronRight className="text-[14px]" />
          </div>
        </div>
        <div className="bg-background flex w-full flex-row items-center justify-start gap-x-2.5 px-4 py-2 font-medium text-[#FF0000]">
          <LogOut className="scale-x-[-1] transform text-[20px]" />
          <p className="text-[12px]">Keluar</p>
        </div>
      </Container>
    </div>
  );
}
