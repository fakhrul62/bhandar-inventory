"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

type CartState = {
  items: CartItem[];
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  setQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (entry) => entry.productId === item.productId && entry.variantId === item.variantId,
          );

          if (!existing) {
            return { items: [...state.items, item] };
          }

          return {
            items: state.items.map((entry) =>
              entry.productId === item.productId && entry.variantId === item.variantId
                ? { ...entry, quantity: entry.quantity + item.quantity }
                : entry,
            ),
          };
        }),
      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (entry) => !(entry.productId === productId && entry.variantId === variantId),
          ),
        })),
      setQuantity: (productId, quantity, variantId) =>
        set((state) => ({
          items: state.items.map((entry) =>
            entry.productId === productId && entry.variantId === variantId
              ? { ...entry, quantity: Math.max(1, quantity) }
              : entry,
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "bhandar-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
