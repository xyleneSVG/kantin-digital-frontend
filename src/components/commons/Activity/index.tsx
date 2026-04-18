"use client";

import { useState } from "react";
import { Container, HeaderWithBackButtonComponent } from "@/src/components/ui";
import { TabComponent } from "./Tab";
import CardItem from "./CardItem";

const ANTREAN_DATA = [
  {
    id: 1,
    kantin: "Kantin A",
    status: "Siap Diambil",
    image: "/images/kantinC.png",
    title: "Menu A - Ayam + Es Teh",
    qty: 2,
    price: "10.000",
    date: "16 Maret, 16 : 00",
  },
  {
    id: 2,
    kantin: "Kantin B",
    status: "Dimasak",
    image: "/images/kantinC.png",
    title: "Seblak Gemoy",
    qty: 1,
    price: "3.000",
    date: "17 Maret, 19 : 00",
  },
];

const RIWAYAT_DATA = [
  {
    id: 1,
    kantin: "Kantin A",
    status: "Selesai",
    image: "/images/kantinC.png",
    title: "Menu A - Ayam + Es Teh",
    qty: 2,
    price: "10.000",
    date: "16 Maret, 16 : 00",
  },
  {
    id: 2,
    kantin: "Kantin P",
    status: "Batak",
    image: "/images/kantinC.png",
    title: "Minyak Sawit",
    qty: 1,
    price: "53.000",
    date: "20 Maret, 19 : 00",
  },
];

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState("Antrean");

  return (
    <div className="bg-background-dark h-screen">
      <HeaderWithBackButtonComponent
        className="pt-5 pb-6.25"
        title="Aktivitas Saya"
      />

      <Container
        needPadding={false}
        type="round"
        className="bg-background min-h-[calc(100vh-69px)] pt-5 pb-20"
      >
        <TabComponent activeTab={activeTab} onChangeTab={setActiveTab} />

        <div className="flex flex-col gap-y-4 p-4 text-sm">
          {activeTab === "Antrean" &&
            ANTREAN_DATA.map((item) => (
              <CardItem key={`antrean-${item.id}`} data={item} />
            ))}

          {activeTab === "Riwayat" &&
            RIWAYAT_DATA.map((item) => (
              <CardItem key={`riwayat-${item.id}`} data={item} />
            ))}
        </div>
      </Container>
    </div>
  );
}
