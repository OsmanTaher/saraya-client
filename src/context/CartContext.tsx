"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "@/src/types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedSize?: string,
    customPrice?: number
  ) => void;
  removeFromCart: (productId: string, selectedSize?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    selectedSize?: string
  ) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalPrice: number;
  totalPrice: number; // متوافق مع CheckoutForm وباقي المكونات
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const getCartItemKey = (productId: string, selectedSize?: string) =>
  selectedSize ? `${productId}__${selectedSize}` : productId;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("saraya_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load cart from localStorage:", err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("saraya_cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Failed to save cart to localStorage:", err);
    }
  }, [cart]);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedSize = "",
    customPrice?: number
  ) => {
    const key = getCartItemKey(product._id, selectedSize);
    const unitPrice = customPrice !== undefined ? customPrice : product.price;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          (item.cartItemId || getCartItemKey(item._id, item.selectedSize)) ===
          key
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          cartQuantity: updated[existingIndex].cartQuantity + quantity,
          price: unitPrice,
        };
        return updated;
      }

      return [
        ...prev,
        {
          ...product,
          cartItemId: key,
          price: unitPrice,
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
            key && item._id !== key
      )
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    selectedSize = ""
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
      })
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.cartQuantity, 0);
  const subtotalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.cartQuantity,
    0
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