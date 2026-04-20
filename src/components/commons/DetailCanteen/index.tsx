"use client";

import { useState, useEffect } from "react";
import KantinHeader from "./CanteenHeader";
import BestMenuCard from "./BestMenuCard";
import MenuItemList from "./MenuItemList";
import { useCartStore } from "@/src/store/useCartStore";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const DATA = {
  kantin: {
    name: "Kantin A",
    location: "Belakang gedung SIJA",
    cover: "/images/kantinA.png",
  },
  bestMenu: [
    {
      id: "123",
      title: "Paket A",
      price: "12.000",
      image: "/images/kantinB.png",
    },
    {
      id: "321",
      title: "Paket B",
      price: "12.000",
      image: "/images/kantinB.png",
    },
    {
      id: "41231",
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

interface SelectedItem {
  id: string;
  title: string;
  description?: string;
  price: string;
  image: string;
}

export default function DetailCanteenPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const canteenId = params.id as string;
  const openMenuId = searchParams.get("openMenu");

  const addToCart = useCartStore((state) => state.addToCart);
  const cartCount = useCartStore((state) => state.carts[canteenId]?.count || 0);

  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [modalQty, setModalQty] = useState(1);

  useEffect(() => {
    if (openMenuId) {
      const allMenus = [...DATA.bestMenu, ...DATA.makanan, ...DATA.minuman];
      const foundMenu = allMenus.find((m) => m.id === openMenuId);
      
      if (foundMenu) {
        setSelectedItem(foundMenu);
        setModalQty(1);
        
        // Error replace sudah diatasi dengan hanya mengirimkan 1 parameter string
        router.replace(`/kantin/${canteenId}`);
      }
    }
  }, [openMenuId, canteenId, router]);

  const openModal = (item: SelectedItem) => {
    setSelectedItem(item);
    setModalQty(1);
  };

  const handleAddToCartFromModal = () => {
    if (!selectedItem) return;
    
    for (let i = 0; i < modalQty; i++) {
      addToCart(canteenId, {
        id: selectedItem.id,
        title: selectedItem.title,
        price: selectedItem.price,
        image: selectedItem.image,
      });
    }
    
    setSelectedItem(null);
  };

  return (
    <div className="relative min-h-screen bg-white pb-24 font-sans">
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
                onClick={() => openModal(item)}
                onAdd={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  addToCart(canteenId, { id: item.id, title: item.title, price: item.price, image: item.image });
                }} 
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
                onClick={() => openModal(item)}
                onAdd={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  addToCart(canteenId, { id: item.id, title: item.title, price: item.price, image: item.image });
                }} 
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
                onClick={() => openModal(item)}
                onAdd={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  addToCart(canteenId, { id: item.id, title: item.title, price: item.price, image: item.image });
                }} 
              />
            ))}
          </div>
        </section>
      </div>

      {cartCount > 0 && (
        <button
          onClick={() => router.push(`/kantin/${canteenId}/checkout`)}
          className="fixed bottom-25 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#6BBA9C] text-white shadow-[0_4px_15px_rgba(107,186,156,0.5)] transition-transform hover:scale-105 active:scale-95"
        >
          <div className="relative flex items-center justify-center">
            <ShoppingCart size={24} />
            <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[11px] font-bold text-white">
              {cartCount}
            </span>
          </div>
        </button>
      )}

      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-[2px]"
            />
            
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.y > 100 || velocity.y > 500) {
                  setSelectedItem(null);
                }
              }}
              className="fixed bottom-0 left-0 right-0 z-[99] flex max-h-[90vh] flex-col rounded-t-3xl bg-[#F5F3EC] p-5 pb-24 shadow-2xl"
            >
              <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-300" />

              <div className="overflow-y-auto no-scrollbar pointer-events-none">
                <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-2xl bg-white shadow-sm">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <h3 className="text-[18px] font-bold text-gray-900">
                  {selectedItem.title}
                </h3>
                {selectedItem.description && (
                  <p className="mt-1 text-[13px] text-gray-600 leading-relaxed">
                    {selectedItem.description}
                  </p>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <p className="text-[16px] font-bold text-[#6BBA9C]">
                  Rp {selectedItem.price}
                </p>
                
                <div className="flex shrink-0 items-center gap-x-3">
                  <button
                    onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                    className="flex size-7 items-center justify-center rounded-full border border-gray-400 bg-transparent text-gray-600 active:scale-95"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="min-w-5 text-center text-[15px] font-bold text-gray-900">
                    {modalQty}
                  </span>
                  <button
                    onClick={() => setModalQty(modalQty + 1)}
                    className="flex size-7 items-center justify-center rounded-full bg-[#6BBA9C] text-white active:scale-95"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCartFromModal}
                className="mt-8 w-full rounded-xl bg-[#6BBA9C] py-3.5 text-[14px] font-bold text-white shadow-md transition-colors hover:bg-[#5aa387] active:scale-[0.98]"
              >
                Tambah ke Keranjang
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}