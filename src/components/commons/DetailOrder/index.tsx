"use client";

import { Container, HeaderWithBackButtonComponent } from "@/src/components/ui";
import OrderHeader from "./OrderHeader";
import OrderTimeline from "./OrderTimeline";
import OrderItems from "./OrderItems";
import Link from "next/link";

const MOCK_DATA = {
  kantinName: "Kantin A",
  sellerName: "Pak Yono",
  orderId: "ORD-5G9K2XQ1",
  estimation: "3 - 5 Jam",
  timeline: [
    {
      title: "Pesanan Diterima",
      description: "Penjual telah menerima pesananmu",
    },
    {
      title: "Makanan Dimasak",
      description: "Makananmu sedang disiapkan dengan cinta",
    },
    {
      title: "Siap Diambil",
      description: "Silahkan menuju ke kantin",
    },
  ],
  items: [
    {
      name: "Menu A - Ayam",
      qty: 1,
      price: "10.000",
    },
    {
      name: "Es Teh",
      qty: 1,
      price: "3.000",
    },
  ],
};

export default function DetailPesananPage() {
  return (
    <div className="bg-background-dark h-screen">
      <HeaderWithBackButtonComponent
        className={"pt-5 pb-6.25"}
        title={"Detail Pesanan"}
      />

      <Container
        needPadding={false}
        type="round"
        className="min-h-[calc(100vh-69px)] bg-[#F8F9FA] pt-5 pb-20"
      >
        <div className="flex flex-col">
          <OrderHeader
            kantinName={MOCK_DATA.kantinName}
            sellerName={MOCK_DATA.sellerName}
            orderId={MOCK_DATA.orderId}
            estimation={MOCK_DATA.estimation}
          />
          <OrderTimeline timeline={MOCK_DATA.timeline} />
          <OrderItems items={MOCK_DATA.items} />
          <Link
            className="bg-primary text-primary-foreground mx-5 mt-4 rounded-lg px-4 py-2.5 text-center text-[14px] font-semibold transition-colors hover:bg-green-50"
            href={""}
          >
            Chat Penjual
          </Link>
        </div>
      </Container>
    </div>
  );
}
