"use client";

import KantinHeader from "./CanteenHeader";
import BestMenuCard from "./BestMenuCard";
import MenuItemList from "./MenuItemList";
import { useCartStore } from "@/src/store/useCartStore";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

const DATA = {
  kantin: {
    name: "Kantin A",
    location: "Belakang gedung SIJA",
    cover: "/images/kantinA.png",
  },
  bestMenu: [
    {
      id: "b1",
      title: "Paket A",
      price: "12.000",
      image: "/images/kantinB.png",
    },
    {
      id: "b2",
      title: "Paket B",
      price: "12.000",
      image: "/images/kantinB.png",
    },
    {
      id: "b3",
      title: "Paket C",
      price: "12.000",
      image: "/images/kantinB.png",
    },
  ],
  makanan: [
    {
      id: "m1",
      title: "Menu A",
      description: "Nasi+Ayam+Sambal",
      price: "7.000",
      image: "/images/kantinB.png",
    },
    {
      id: "m2",
      title: "Menu A",
      description: "Nasi ayam geprek dengan sambal pedas dan lalapan",
      price: "7.000",
      image: "/images/kantinB.png",
    },
  ],
  minuman: [
    {
      id: "d1",
      title: "Minuman A",
      description: "Es teh seger",
      price: "3.000",
      image: "/images/kantinB.png",
    },
    {
      id: "d2",
      title: "Minuman B",
      description: "Es jeruk segerr",
      price: "4.000",
      image: "/images/kantinB.png",
    },
  ],
};

export default function DetailCanteenPage() {
  const router = useRouter();
  const params = useParams();
  const canteenId = params.id as string;

  const addToCart = useCartStore((state) => state.addToCart);
  const cartCount = useCartStore((state) => state.carts[canteenId]?.count || 0);

  return (
    <div className="min-h-screen bg-white pb-24 font-sans relative">
      <KantinHeader
        kantinName={DATA.kantin.name}
        location={DATA.kantin.location}
        coverImage={DATA.kantin.cover}
      />
      
      <div className="flex flex-col px-4">
        <section className="mb-6">
          <h2 className="mb-3 text-[16px] font-bold text-gray-900">
            Menu terbaik
          </h2>
          <div className="flex flex-row gap-x-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {DATA.bestMenu.map((item) => (
              <BestMenuCard 
                key={item.id} 
                {...item} 
                onAdd={() => addToCart(canteenId, { id: item.id, title: item.title, price: item.price, image: item.image })} 
              />
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-[16px] font-bold text-gray-900">Makanan</h2>
          <div className="flex flex-col gap-y-3">
            {DATA.makanan.map((item) => (
              <MenuItemList 
                key={item.id} 
                {...item} 
                onAdd={() => addToCart(canteenId, { id: item.id, title: item.title, price: item.price, image: item.image })} 
              />
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-[16px] font-bold text-gray-900">Minuman</h2>
          <div className="flex flex-col gap-y-3">
            {DATA.minuman.map((item) => (
              <MenuItemList 
                key={item.id} 
                {...item} 
                onAdd={() => addToCart(canteenId, { id: item.id, title: item.title, price: item.price, image: item.image })} 
              />
            ))}
          </div>
        </section>
      </div>

      {cartCount > 0 && (
        <button
          onClick={() => router.push(`/kantin/${canteenId}/checkout`)}
          className="fixed bottom-25 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#6BBA9C] text-white shadow-[0_4px_15px_rgba(107,186,156,0.5)] transition-transform hover:scale-105 active:scale-95"
        >
          <div className="relative flex items-center justify-center">
            <ShoppingCart size={24} />
            <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white border-2 border-white">
              {cartCount}
            </span>
          </div>
        </button>
      )}
    </div>
  );
}