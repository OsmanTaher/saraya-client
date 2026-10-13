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
  addToCart: (product: Product, quantity: number, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  getItemQuantity: (productId: string, size?: string) => number;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  tableNumber: string | null;
  orderType: 'delivery' | 'dine_in' | 'cashier' | 'pickup';
  setTableNumber: (table: string | null) => void;
  setOrderType: (type: 'delivery' | 'dine_in' | 'cashier' | 'pickup') => void;
}

/** مفتاح تمييز عنصر السلة يعتمد على (productId + size) */
function cartKey(productId: string, size?: string): string {
  return size ? `${productId}__${size}` : productId;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<'delivery' | 'dine_in' | 'cashier' | 'pickup'>('delivery');

  useEffect(() => {
    // Hydrate the client-only cart from browser storage after mounting.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const savedCart = localStorage.getItem("saraya_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // قراءة رقم الترابيزة من الرابط
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");
    if (table) {
      setTableNumber(table);
      setOrderType('dine_in');
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("saraya_cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  /** حساب السعر الفعلي بناءً على الحجم المختار */
  function getEffectivePrice(product: Product, size?: string): number {
    if (size && product.sizes && product.sizes.length > 0) {
      const matched = product.sizes.find((s) => s.name === size);
      if (matched) return matched.price;
    }
    return product.price;
  }

  const addToCart = (product: Product, quantity: number, size?: string) => {
    const key = cartKey(product._id, size);
    const effectivePrice = getEffectivePrice(product, size);

    setCart((prev) => {
      const existingItem = prev.find(
        (item) => cartKey(item._id, item.selectedSize) === key
      );

      if (existingItem) {
        const newQty = existingItem.cartQuantity + quantity;
        return prev.map((item) =>
          cartKey(item._id, item.selectedSize) === key
            ? { ...item, cartQuantity: newQty, effectivePrice }
            : item
        );
      }

      return [
        ...prev,
        { ...product, cartQuantity: quantity, selectedSize: size, effectivePrice },
      ];
    });
  };

  const removeFromCart = (productId: string, size?: string) => {
    const key = cartKey(productId, size);
    setCart((prev) =>
      prev.filter((item) => cartKey(item._id, item.selectedSize) !== key)
    );
  };

  const updateQuantity = (productId: string, quantity: number, size?: string) => {
    const key = cartKey(productId, size);
    setCart((prev) =>
      prev
        .map((item) => {
          if (cartKey(item._id, item.selectedSize) === key) {
            const validQty = Math.max(0, quantity);
            return { ...item, cartQuantity: validQty };
          }
          return item;
        })
        .filter((item) => item.cartQuantity > 0)
    );
  };

  const getItemQuantity = (productId: string, size?: string): number => {
    const key = cartKey(productId, size);
    const found = cart.find(
      (item) => cartKey(item._id, item.selectedSize) === key
    );
    return found ? found.cartQuantity : 0;
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((total, item) => total + item.cartQuantity, 0);
  const totalPrice = cart.reduce(
    (total, item) => total + item.effectivePrice * item.cartQuantity,
    0
  );

  if (!isMounted) return null;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemQuantity,
        clearCart,
        totalItems,
        totalPrice,
        tableNumber,
        orderType,
        setTableNumber,
        setOrderType,
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
