"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";

export interface DrawerMenuItem {
  id: string;
  title: string;
  description?: string;
  price: string;
  image: string;
}

interface MenuDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: DrawerMenuItem | null;
  onAddToCart: (item: DrawerMenuItem, qty: number) => void;
}

export function MenuDrawerModalComponent({
  isOpen,
  onClose,
  item,
  onAddToCart,
}: MenuDrawerModalProps) {
  const [modalQty, setModalQty] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setModalQty(1);
    }
  }, [isOpen]);

  const handleAdd = () => {
    if (item) {
      onAddToCart(item, modalQty);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                onClose();
              }
            }}
            className="fixed bottom-0 left-0 right-0 z-[99] flex max-h-[90vh] flex-col rounded-t-3xl bg-[#F5F3EC] p-5 pb-24 shadow-2xl"
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-300" />

            <div className="pointer-events-none overflow-y-auto no-scrollbar">
              <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-2xl bg-white shadow-sm">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="text-[18px] font-bold text-gray-900">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 text-[13px] leading-relaxed text-gray-600">
                  {item.description}
                </p>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <p className="text-[16px] font-bold text-[#6BBA9C]">
                Rp {item.price}
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
              onClick={handleAdd}
              className="mt-8 w-full rounded-xl bg-[#6BBA9C] py-3.5 text-[14px] font-bold text-white shadow-md transition-colors hover:bg-[#5aa387] active:scale-[0.98]"
            >
              Tambah ke Keranjang
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}