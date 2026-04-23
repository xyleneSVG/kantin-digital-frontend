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
import ScreenLoader from "@/src/hooks/useScreenLoader";
import {
  getCanteenDetail,
  getCanteenMenu,
  getCanteenItems,
} from "@/src/services/user";

interface SelectedItem {
  id: string;
  title: string;
  description?: string;
  price: string;
  image: string;
}

type Item = {
  id: string;
  title: string;
  description?: string;
  price: string;
  image: string;
};

const formatPrice = (value: number) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

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
  const [isLoading, setIsLoading] = useState(true);

  const [canteen, setCanteen] = useState({
    name: "",
    location: "",
    cover: "",
  });

  const [bestMenu, setBestMenu] = useState<Item[]>([]);
  const [menuByGroup, setMenuByGroup] = useState<Record<string, Item[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detail, recommend, itemsRes] = await Promise.all([
          getCanteenDetail(canteenId),
          getCanteenMenu(canteenId),
          getCanteenItems(canteenId),
        ]);

        setCanteen({
          name: detail?.canteen_name || "",
          location: detail?.location_description || "",
          cover: detail?.image
            ? `https://ta-dev.subekti.web.id/api/method/${detail.image}`
            : "/images/kantinA.png",
        });

        const recommendList = Array.isArray(recommend)
          ? recommend
          : (recommend?.data ?? recommend?.items ?? []);

        const best = recommendList.map((i: any) => ({
          id: i.item_code,
          title: i.item_name,
          description: i.description,
          price: formatPrice(Number(i.selling_price || 0)),
          image: i.image
            ? i.image.startsWith("http")
              ? i.image
              : `https://ta-dev.subekti.web.id${i.image}`
            : "/images/kantinB.png",
        }));

        setBestMenu(best);

        const rawItems =
          itemsRes?.items ?? itemsRes?.data?.items ?? itemsRes?.data ?? [];

        const safeItems = Array.isArray(rawItems) ? rawItems : [];

        const grouped: Record<string, Item[]> = {};

        safeItems.forEach((i: any) => {
          const group = i.item_group || "Lainnya";

          if (!grouped[group]) grouped[group] = [];

          grouped[group].push({
            id: i.item_code,
            title: i.item_name,
            description: i.description,
            price: formatPrice(Number(i.selling_price || 0)),
            image: i.image
              ? i.image.startsWith("http")
                ? i.image
                : `https://ta-dev.subekti.web.id${i.image}`
              : "/images/kantinB.png",
          });
        });

        setMenuByGroup(grouped);
      } catch (err) {
        setBestMenu([]);
        setMenuByGroup({});
      } finally {
        setIsLoading(false);
      }
    };

    if (canteenId) fetchData();
  }, [canteenId]);

  useEffect(() => {
    if (openMenuId) {
      const allMenus = [...bestMenu, ...Object.values(menuByGroup).flat()];
      const foundMenu = allMenus.find((m) => m.id === openMenuId);

      if (foundMenu) {
        setSelectedItem(foundMenu);
        setModalQty(1);
        router.replace(`/kantin/${canteenId}`);
      }
    }
  }, [openMenuId, canteenId, router, bestMenu, menuByGroup]);

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
    <ScreenLoader isLoading={isLoading}>
      <div className="relative min-h-screen bg-white pb-24 font-sans">
        <KantinHeader
          kantinName={canteen.name}
          location={canteen.location}
          coverImage={canteen.cover}
        />

        <div className="flex flex-col px-4">
          <section className="mb-6">
            <h2 className="mb-3 text-[16px] font-bold text-gray-900">
              Menu terbaik
            </h2>
            <div className="flex flex-row gap-x-3 overflow-x-auto pb-2">
              {bestMenu.map((item) => (
                <BestMenuCard
                  key={item.id}
                  {...item}
                  onClick={() => openModal(item)}
                  onAdd={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    addToCart(canteenId, {
                      id: item.id,
                      title: item.title,
                      price: item.price,
                      image: item.image,
                    });
                  }}
                />
              ))}
            </div>
          </section>

          {Object.entries(menuByGroup).map(([group, items]) => (
            <section className="mb-6" key={group}>
              <h2 className="mb-3 text-[16px] font-bold text-gray-900">
                {group.split(" - ")[1] || group}
              </h2>
              <div className="flex flex-col gap-y-3">
                {items.map((item) => (
                  <MenuItemList
                    key={item.id}
                    {...item}
                    onClick={() => openModal(item)}
                    onAdd={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      addToCart(canteenId, {
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        image: item.image,
                      });
                    }}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {cartCount > 0 && (
          <button
            onClick={() => router.push(`/kantin/${canteenId}/checkout`)}
            className="fixed right-5 bottom-25 z-40 flex size-14 items-center justify-center rounded-full bg-[#6BBA9C] text-white"
          >
            <div className="relative flex items-center justify-center">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
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
                className="fixed inset-0 z-[99] bg-black/40"
              />

              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="bg-secondary fixed right-0 bottom-0 left-0 z-[99] flex max-h-[90vh] flex-col rounded-t-3xl p-5 pb-24"
              >
                <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-2xl bg-white">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <h3 className="text-[18px] font-bold">{selectedItem.title}</h3>

                <p className="mt-1 text-[13px]">{selectedItem.description}</p>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-[16px] font-bold text-[#6BBA9C]">
                    Rp {selectedItem.price}
                  </p>
                </div>

                <button
                  onClick={handleAddToCartFromModal}
                  className="mt-8 w-full rounded-xl bg-[#6BBA9C] py-3.5 text-white"
                >
                  Tambah ke Keranjang
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </ScreenLoader>
  );
}
