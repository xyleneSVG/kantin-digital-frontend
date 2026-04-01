"use client";

import { useState } from "react";
import { Container, HeaderWithBackButtonComponent } from "@/src/components/ui";
import { TabComponent } from "./Tab";

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState("Antrean");

  return (
    <div className="bg-background-dark h-screen">
      <HeaderWithBackButtonComponent
        className="pt-5 pb-6.25"
        title="Notifikasi"
      />

      <Container
        needPadding={false}
        type="round"
        className="bg-grey min-h-[calc(100vh-69px)] pt-5 pb-20"
      >
        <TabComponent activeTab={activeTab} onChangeTab={setActiveTab} />

        {/* contoh penggunaan */}
        <div className="p-4 text-sm">
          {activeTab === "Antrean" && <p>Ini halaman Antrean</p>}
          {activeTab === "Riwayat" && <p>Ini halaman Riwayat</p>}
        </div>
      </Container>
    </div>
  );
}
