"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "@/src/types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedSize?: string,
    customPrice?: number,
  ) => void;
  removeFromCart: (productId: string, selectedSize?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    selectedSize?: string,
  ) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalPrice: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "saraya_cart";

export const getCartItemKey = (productId: string, selectedSize?: string) =>
  selectedSize ? `${productId}__${selectedSize}` : productId;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setCart(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load cart from localStorage:", err);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error("Failed to save cart to localStorage:", err);
    }
  }, [cart, isInitialized]);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedSize = "",
    customPrice?: number,
  ) => {
    const key = getCartItemKey(product._id, selectedSize);
    const unitPrice = customPrice !== undefined ? customPrice : product.price;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          (item.cartItemId || getCartItemKey(item._id, item.selectedSize)) ===
          key,
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          cartQuantity: updated[existingIndex].cartQuantity + quantity,
          price: unitPrice,
          effectivePrice: unitPrice,
        };
        return updated;
      }

      return [
        ...prev,
        {
          ...product,
          cartItemId: key,
          price: unitPrice,
          effectivePrice: unitPrice,
          selectedSize,
          cartQuantity: quantity,
        },
      ];
    });
  };

  const removeFromCart = (productId: string, selectedSize = "") => {
    const key = getCartItemKey(productId, selectedSize);
    setCart((prev) =>
      prev.filter(
        (item) =>
          (item.cartItemId || getCartItemKey(item._id, item.selectedSize)) !==
            key && item._id !== key,
      ),
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    selectedSize = "",
  ) => {
    const key = getCartItemKey(productId, selectedSize);

    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        const currentKey =
          item.cartItemId || getCartItemKey(item._id, item.selectedSize);
        if (currentKey === key || (!selectedSize && item._id === productId)) {
          return { ...item, cartQuantity: quantity };
        }
        return item;
      }),
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear cart from localStorage:", err);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.cartQuantity, 0);
  const subtotalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.cartQuantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotalPrice,
        totalPrice: subtotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
