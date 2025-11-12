"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;

  // 액션들
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

// 총액과 아이템 수를 계산하는 헬퍼 함수
const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

// 표준 localStorage 스토리지 사용 (Zustand Persist 기본 동작)

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        total: 0,
        itemCount: 0,

        addItem: (item) => {
          const { items } = get();
          const existingItemIndex = items.findIndex(
            (cartItem) =>
              cartItem.id === item.id &&
              cartItem.size === item.size &&
              cartItem.color === item.color
          );

          let updatedItems: CartItem[];

          if (existingItemIndex > -1) {
            updatedItems = items.map((cartItem, index) =>
              index === existingItemIndex
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );
          } else {
            updatedItems = [...items, { ...item, quantity: 1 }];
          }

          const { total, itemCount } = calculateTotals(updatedItems);

          set({
            items: updatedItems,
            total,
            itemCount,
          });
        },

        removeItem: (id, size, color) => {
          const { items } = get();
          const filteredItems = items.filter(
            (item) =>
              !(item.id === id && item.size === size && item.color === color)
          );

          const { total, itemCount } = calculateTotals(filteredItems);

          set({
            items: filteredItems,
            total,
            itemCount,
          });
        },

        updateQuantity: (id, size, color, quantity) => {
          if (quantity <= 0) {
            get().removeItem(id, size, color);
            return;
          }

          const { items } = get();
          const updatedItems = items.map((item) =>
            item.id === id && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
          );

          const { total, itemCount } = calculateTotals(updatedItems);

          set({
            items: updatedItems,
            total,
            itemCount,
          });
        },

        clearCart: () => {
          set({
            items: [],
            total: 0,
            itemCount: 0,
          });
        },
      }),
      {
        name: "cart-store", // localStorage 키
      }
    ),
    {
      name: "cart-store",
    }
  )
);

// 탭 간 동기화를 위한 storage 이벤트 리스너
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "cart-store" && e.newValue) {
      try {
        // 다른 탭에서 변경사항이 발생하면 localStorage에서 상태를 읽어서 업데이트
        const storedState = JSON.parse(e.newValue);

        // Zustand Persist는 { state: { ... } } 형식으로 저장합니다
        const state = storedState?.state || storedState;

        if (state && Array.isArray(state.items)) {
          const { total, itemCount } = calculateTotals(state.items);
          useCartStore.setState({
            items: state.items,
            total: state.total ?? total,
            itemCount: state.itemCount ?? itemCount,
          });
        }
      } catch (error) {
        console.error("Failed to sync cart from storage event:", error);
      }
    }
  });
}
