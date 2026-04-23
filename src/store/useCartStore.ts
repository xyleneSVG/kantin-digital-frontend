import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string | number;
  title: string;
  price: string;
  image: string;
  note?: string;
  qty: number;
};

export type CanteenCart = {
  items: CartItem[];
  count: number;
};

type CartStore = {
  carts: Record<string, CanteenCart>;
  addToCart: (canteenId: string, item: Omit<CartItem, "qty">) => void;
  increaseQty: (canteenId: string, itemId: string | number) => void;
  decreaseQty: (canteenId: string, itemId: string | number) => void;
  clearCart: (canteenId: string) => void;
  resetAll: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      carts: {},

      addToCart: (canteenId, item) =>
        set((state) => {
          const currentCart = state.carts[canteenId] || { items: [], count: 0 };
          const existingItem = currentCart.items.find((i) => i.id === item.id);

          let newItems;

          if (existingItem) {
            newItems = currentCart.items.map((i) =>
              i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
            );
          } else {
            newItems = [...currentCart.items, { ...item, qty: 1 }];
          }

          return {
            carts: {
              ...state.carts,
              [canteenId]: {
                items: newItems,
                count: currentCart.count + 1,
              },
            },
          };
        }),

      increaseQty: (canteenId, itemId) =>
        set((state) => {
          const currentCart = state.carts[canteenId];
          if (!currentCart) return state;

          const newItems = currentCart.items.map((item) =>
            item.id === itemId ? { ...item, qty: item.qty + 1 } : item,
          );

          return {
            carts: {
              ...state.carts,
              [canteenId]: {
                items: newItems,
                count: currentCart.count + 1,
              },
            },
          };
        }),

      decreaseQty: (canteenId, itemId) =>
        set((state) => {
          const currentCart = state.carts[canteenId];
          if (!currentCart) return state;

          const existingItem = currentCart.items.find((i) => i.id === itemId);
          if (!existingItem) return state;

          let newItems;

          if (existingItem.qty === 1) {
            newItems = currentCart.items.filter((i) => i.id !== itemId);
          } else {
            newItems = currentCart.items.map((item) =>
              item.id === itemId ? { ...item, qty: item.qty - 1 } : item,
            );
          }

          return {
            carts: {
              ...state.carts,
              [canteenId]: {
                items: newItems,
                count: Math.max(0, currentCart.count - 1),
              },
            },
          };
        }),

      clearCart: (canteenId) =>
        set((state) => {
          const newCarts = { ...state.carts };
          delete newCarts[canteenId];
          return { carts: newCarts };
        }),

      resetAll: () =>
        set(() => ({
          carts: {},
        })),
    }),
    {
      name: "kantin-cart-storage",
    },
  ),
);
