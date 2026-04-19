"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/src/store/useCartStore";
import { ArrowLeft, Minus, Plus, AlertTriangle, Wallet, QrCode, ShoppingBag, CircleDollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const canteenId = params.id as string;

  const cart = useCartStore((state) => state.carts[canteenId] || { items: [], count: 0 });
  const cartItems = cart.items;
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("syxpay");

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const priceNum = parseInt(item.price.replace(/[^0-9]/g, ''));
    return acc + (priceNum * item.qty);
  }, 0);

  const biayaBungkus = 3000;
  const total = subtotal + biayaBungkus;

  const paymentMethods = [
    { id: "syxpay", label: "sYxpaY", icon: <CircleDollarSign size={16} className="text-[#6BBA9C]" /> },
    { id: "gopay", label: "Gopay", icon: <Wallet size={16} className="text-blue-500" /> },
    { id: "spay", label: "Spay", icon: <ShoppingBag size={16} className="text-orange-500" /> },
    { id: "qris", label: "QRIS", icon: <QrCode size={16} className="text-gray-900" /> },
  ];

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#333] flex items-center justify-center p-5 text-white">
        <div className="text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4"/>
            <p className="text-[14px]">Keranjang belanja kosong.</p>
            <button onClick={() => router.back()} className="mt-4 text-[#6BBA9C] text-sm font-semibold">
                Kembali ke Kantin
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col font-sans overflow-hidden">
      
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/kantinA.png" 
          alt="Canteen Interior"
          fill
          priority
          className="object-cover brightness-[0.3]" 
        />
      </div>

      <div className="flex flex-col flex-1 z-10 p-5 items-center justify-center pt-24 pb-12">
        
        <div className="bg-[#F5F3EC] rounded-t-2xl flex flex-col w-full max-w-[350px] p-6 drop-shadow-xl flex-grow-0 relative">
          
          <div className="flex items-center justify-center border-b border-gray-300 pb-4 mb-5 relative">
            <button onClick={() => router.back()} className="absolute left-0 text-gray-800 transition-transform active:scale-95">
              <ArrowLeft size={22} />
            </button>
            <h2 className="text-center font-bold text-[16px] text-gray-900">
                Detail Pesanan
            </h2>
          </div>

          <div className="flex flex-col gap-y-5 mb-8 overflow-y-auto max-h-[160px] no-scrollbar pr-1">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-x-3">
                <div className="flex items-center gap-x-3">
                  <div className="relative size-14 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[13px] font-semibold text-gray-900">{item.title}</p>
                    <p className="text-[12px] font-bold text-[#6BBA9C]">Rp {item.price}</p>
                    {item.note && (
                      <p className="text-[10px] text-gray-500 mt-0.5">{item.note}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-x-2.5 shrink-0">
                  <button onClick={() => decreaseQty(canteenId, item.id)} className="flex size-6 items-center justify-center rounded-full border border-[#6BBA9C] bg-transparent text-[#6BBA9C]">
                    <Minus size={14} />
                  </button>
                  <span className="text-[13px] font-semibold text-gray-900 min-w-4 text-center">{item.qty}</span>
                  <button onClick={() => increaseQty(canteenId, item.id)} className="flex size-6 items-center justify-center rounded-full bg-[#6BBA9C] text-white">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-bold text-[14px] text-gray-900 mb-4 mt-2">Metode Pembayaran</h3>
          <div className="flex flex-col gap-y-4 mb-8">
            {paymentMethods.map((method) => (
              <label key={method.id} className="flex items-center gap-x-3 cursor-pointer">
                <div 
                  className={`flex size-4 items-center justify-center rounded-full border ${
                    selectedPayment === method.id ? 'border-[#6BBA9C]' : 'border-gray-400'
                  }`}
                >
                  {selectedPayment === method.id && (
                    <div className="size-2.5 rounded-full bg-[#6BBA9C]" />
                  )}
                </div>
                <div className="flex items-center gap-x-2">
                  {method.icon}
                  <span className="text-[13px] font-medium text-gray-800">{method.label}</span>
                </div>
                <input 
                  type="radio" 
                  name="payment" 
                  value={method.id}
                  checked={selectedPayment === method.id}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="hidden"
                />
              </label>
            ))}
          </div>

          <div className="border-t border-dashed border-gray-400 pt-5 mb-12">
            <h3 className="font-bold text-[14px] text-gray-900 mb-3">Ringkasan</h3>
            <div className="flex flex-col gap-y-2 text-[13px]">
              <div className="flex justify-between items-center text-gray-700">
                <p>Subtotal</p>
                <p>Rp {formatRupiah(subtotal)}</p>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <p>Biaya bungkus</p>
                <p>Rp {formatRupiah(biayaBungkus)}</p>
              </div>
              <div className="flex justify-between items-center mt-1 border-t border-gray-200 pt-1.5">
                <p className="font-bold text-gray-900 text-[14px]">Total</p>
                <p className="font-bold text-[#6BBA9C] text-[14px]">Rp {formatRupiah(total)}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setShowModal(true)}
            className="w-full bg-[#6BBA9C] text-white py-4 rounded-xl text-[14px] font-semibold hover:bg-[#5aa387] transition-colors shadow-lg active:scale-[0.98]"
          >
            Pesan Sekarang
          </button>
          
        </div>

        <div className="h-6 w-full max-w-[350px] relative z-0 flex overflow-hidden -mt-[1px]">
           {[...Array(12)].map((_, i) => (
              <div key={i} className="flex-1 h-full bg-[#F5F3EC] relative" style={{
                maskImage: 'radial-gradient(circle at 50% 100%, transparent 50%, black 51%)',
                WebkitMaskImage: 'radial-gradient(circle at 50% 100%, transparent 50%, black 51%)'
              }} />
           ))}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-[2px]"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-3xl w-full max-w-[320px] p-6 relative flex flex-col items-center shadow-2xl"
            >
              <div className="absolute -top-7 bg-white border border-dashed border-blue-400 p-2.5 rounded-lg w-32 flex justify-center">
                  <AlertTriangle size={30} className="text-yellow-400 fill-yellow-400" />
              </div>

              <h3 className="text-[16px] font-bold text-gray-900 mt-8 mb-2">Konfirmasi Pesanan</h3>
              <p className="text-[13px] text-gray-600 text-center mb-4 leading-relaxed">
                Apakah kamu yakin ingin memesan ini? <br/> Pastikan pesananmu sudah benar.
              </p>

              <div className="bg-[#FFE8E8] text-[#FF4B4B] text-[11px] font-semibold py-2 px-3 rounded-md w-full text-center mb-6">
                Pesanan yang sudah dipesan <span className="font-bold underline">tidak dapat dibatalkan</span>
              </div>

              <button 
                onClick={() => setShowModal(false)}
                className="w-full text-gray-600 text-[14px] font-semibold py-3 mb-2.5 hover:bg-gray-50 rounded-xl transition-colors active:scale-[0.97]"
              >
                Cek Lagi
              </button>
              <button 
                onClick={() => {
                  setShowModal(false);
                  clearCart(canteenId); 
                  router.push('/activity/success') 
                }}
                className="w-full bg-[#6BBA9C] text-white text-[14px] font-semibold py-3.5 rounded-xl hover:bg-[#5aa387] transition-colors shadow-sm active:scale-[0.98]"
              >
                Ya, Pesan Sekarang
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}