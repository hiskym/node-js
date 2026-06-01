"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem } from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  removeItem: (variantId: number) => void;
  clearCart: () => void;
  totalQuantity: number;
  totalPrice: string;
  currency: string;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "fitness-shop-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const itemCount = items.length;

  useEffect(() => {
    const storedCart = window.localStorage.getItem(STORAGE_KEY);

    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(item: CartItem) {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (currentItem) => currentItem.variantId === item.variantId,
      );

      if (!existingItem) {
        return [...currentItems, item];
      }

      return currentItems.map((currentItem) =>
        currentItem.variantId === item.variantId
          ? {
              ...currentItem,
              quantity: currentItem.quantity + item.quantity,
            }
          : currentItem,
      );
    });
  }

  function updateQuantity(variantId: number, quantity: number) {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item,
      ),
    );
  }

  function removeItem(variantId: number) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.variantId !== variantId),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const value = useMemo(() => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items
      .reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0)
      .toFixed(2);

    return {
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      itemCount,
      totalQuantity,
      totalPrice,
      currency: items[0]?.currency ?? "CZK",
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}