"use client";

import React, { createContext, useContext } from "react";
import { useCartStore, CartItem } from "@/stores/useCartStore";

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const CartContext = createContext<
  | {
      state: CartState;
      addItem: (item: Omit<CartItem, "quantity">) => void;
      removeItem: (id: number, size: string, color: string) => void;
      updateQuantity: (
        id: number,
        size: string,
        color: string,
        quantity: number
      ) => void;
      clearCart: () => void;
    }
  | undefined
>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Zustand Persist 스토어 사용 - 자동으로 탭 간 동기화 지원
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);
  const itemCount = useCartStore((state) => state.itemCount);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  return (
    <CartContext.Provider
      value={{
        state: {
          items,
          total,
          itemCount,
        },
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
