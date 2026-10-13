"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CartItem, Product } from "@/src/types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Hydrate the client-only cart from browser storage after mounting.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const savedCart = localStorage.getItem("toshka_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("toshka_cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const addToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item._id === product._id);

      if (existingItem) {
        const newQty = existingItem.cartQuantity + quantity;

        const finalQty = product.maxQty
          ? Math.min(newQty, product.maxQty)
          : newQty;

        return prev.map((item) =>
          item._id === product._id ? { ...item, cartQuantity: finalQty } : item,
        );
      }

      const initialQty = product.maxQty
        ? Math.min(quantity, product.maxQty)
        : quantity;
      return [...prev, { ...product, cartQuantity: initialQty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item._id === productId) {
            let validQty = Math.max(0, quantity);
            if (item.maxQty) validQty = Math.min(validQty, item.maxQty);
            return { ...item, cartQuantity: validQty };
          }
          return item;
        })
        .filter((item) => item.cartQuantity > 0),
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((total, item) => total + item.cartQuantity, 0);
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.cartQuantity,
    0,
  );

  if (!isMounted) return null;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
