import { Container, HeaderWithBackButtonComponent } from "@/src/components/ui";
import { ASSETS } from "@/src/constants/assets";
import {
  Info,
  LogOut,
  ScrollText,
  UserSearch,
} from "lucide-react";
import { IdentityComponent } from "./Identity";
import { SelectionItemComponent } from "./SelectionItem";

export default function ProfilePage() {
  return (
    <div className="bg-background-dark h-screen">
      <HeaderWithBackButtonComponent
        className={"pt-5 pb-6.25"}
        title={"Profilku"}
      />
      <Container
        needPadding={false}
        type="round"
        className="bg-grey h-[calc(100vh-69px)] pt-5"
      >
        <IdentityComponent
          classNameCOntainer="mb-4 py-2.5"
          photoProfile={ASSETS.PROFILE}
          name="Dhavin Fasya Alvianto"
          nim="224118624"
        />
        <div className="mb-14">
          <p className="mb-2 pl-4 text-[12px] font-light">Umum</p>
          <SelectionItemComponent icon={UserSearch} title="FAQ" href="/faq" />
          <SelectionItemComponent
            icon={ScrollText}
            title="Ketentuan Pengguna"
            href="/terms"
          />
          <SelectionItemComponent
            icon={Info}
            title="Tentang POS STEMBA"
            href="/about"
          />
        </div>
        <SelectionItemComponent
          className="text-[#FF0000]"
          useChevron={false}
          icon={LogOut}
          title="Keluar"
          href="/about"
        />
      </Container>
    </div>
  );
}
