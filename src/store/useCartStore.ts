import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string | number;
  title: string;
  price: string;
  image: string;
  note?: string;
  qty: number;
};

type CartStore = {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'qty'>) => void;
  increaseQty: (id: string | number) => void;
  decreaseQty: (id: string | number) => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cartItems: [],
      cartCount: 0,
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cartItems.find((i) => i.id === item.id);
          
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((i) =>
                i.id === item.id ? { ...i, qty: i.qty + 1 } : i
              ),
              cartCount: state.cartCount + 1,
            };
          }
          return {
            cartItems: [...state.cartItems, { ...item, qty: 1 }],
            cartCount: state.cartCount + 1,
          };
        }),
      increaseQty: (id) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, qty: item.qty + 1 } : item
          ),
          cartCount: state.cartCount + 1,
        })),
      decreaseQty: (id) =>
        set((state) => {
          const existingItem = state.cartItems.find((i) => i.id === id);
          if (existingItem?.qty === 1) {
            return {
              cartItems: state.cartItems.filter((i) => i.id !== id),
              cartCount: state.cartCount - 1,
            };
          }
          return {
            cartItems: state.cartItems.map((item) =>
              item.id === id ? { ...item, qty: item.qty - 1 } : item
            ),
            cartCount: state.cartCount - 1,
          };
        }),
    }),
    {
      name: 'kantin-cart-storage',
    }
  )
);