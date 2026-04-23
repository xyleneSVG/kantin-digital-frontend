"use client";

import { useState, useEffect } from "react";
import KantinHeader from "./CanteenHeader";
import BestMenuCard from "./BestMenuCard";
import MenuItemList from "./MenuItemList";
import { useCartStore } from "@/src/store/useCartStore";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";
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

const toNumber = (value: string | number) =>
  typeof value === "number"
    ? value
    : Number(String(value).replace(/[^0-9]/g, "")) || 0;

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

  const closeModal = () => setSelectedItem(null);

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
    closeModal();
  };

  const totalItemPrice = selectedItem
    ? toNumber(selectedItem.price) * modalQty
    : 0;

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

        {/* ── Cart FAB ── */}
        {cartCount > 0 && (
          <button
            onClick={() => router.push(`/kantin/${canteenId}/checkout`)}
            className="fixed right-5 bottom-25 z-40 flex size-14 items-center justify-center rounded-full bg-[#6BBA9C] text-white shadow-lg transition-transform active:scale-95"
          >
            <div className="relative flex items-center justify-center">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            </div>
          </button>
        )}

        {/* ── Item Detail Bottom Sheet ── */}
        <AnimatePresence>
          {selectedItem && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
                className="fixed inset-0 z-[99] bg-black/50 backdrop-blur-[2px]"
              />

              {/* Sheet */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.4 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 100 || info.velocity.y > 500) {
                    closeModal();
                  }
                }}
                className="bg-secondary fixed right-0 bottom-0 left-0 z-[100] flex max-h-[90vh] flex-col overflow-hidden rounded-t-3xl"
                style={{ touchAction: "none" }}
              >
                {/* Drag Handle */}
                <div className="flex w-full cursor-grab justify-center pt-3 pb-1 active:cursor-grabbing">
                  <div className="h-1 w-10 rounded-full bg-gray-300" />
                </div>

                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 flex size-8 items-center justify-center rounded-full bg-black/10 text-gray-700 transition-colors active:bg-black/20"
                >
                  <X size={15} />
                </button>

                {/* Scrollable Content */}
                <div className="flex flex-col overflow-y-auto px-5 pt-2 pb-6">
                  {/* Image */}
                  <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100">
                    <Image
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Title & Price */}
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <h3 className="flex-1 text-[18px] leading-tight font-bold text-gray-900">
                      {selectedItem.title}
                    </h3>
                    <p className="flex-shrink-0 text-[16px] font-bold text-[#6BBA9C]">
                      Rp {selectedItem.price}
                    </p>
                  </div>

                  {/* Description */}
                  {selectedItem.description && (
                    <p className="mb-5 text-[13px] leading-relaxed text-gray-500">
                      {selectedItem.description}
                    </p>
                  )}

                  {/* Divider */}
                  <div className="mb-5 h-px bg-gray-200" />

                  {/* Qty & Add to Cart */}
                  <div className="flex items-center justify-between gap-4">
                    {/* Qty Control */}
                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2">
                      <button
                        onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                        disabled={modalQty <= 1}
                        className="flex size-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors active:bg-gray-50 disabled:opacity-30"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-6 text-center text-[16px] font-bold text-gray-900">
                        {modalQty}
                      </span>
                      <button
                        onClick={() => setModalQty((q) => q + 1)}
                        className="flex size-8 items-center justify-center rounded-full bg-[#6BBA9C] text-white transition-opacity active:opacity-80"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAddToCartFromModal}
                      className="flex flex-1 items-center justify-between rounded-2xl bg-[#6BBA9C] px-4 py-3 text-white transition-opacity active:opacity-80"
                    >
                      <span className="text-[13px] font-bold">
                        Tambah ke Keranjang
                      </span>
                      <span className="text-[13px] font-bold opacity-90">
                        Rp {formatPrice(totalItemPrice)}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </ScreenLoader>
  );
}
