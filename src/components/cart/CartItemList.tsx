"use client";

/* Cart images are external product URLs with a native fallback on load errors. */
/* eslint-disable @next/next/no-img-element */

import { useCart } from "@/src/context/CartContext";
import { Trash2 } from "lucide-react";

interface CartItemListProps {
  onZoomImage: (image: { src: string; name: string }) => void;
}

export default function CartItemList({ onZoomImage }: CartItemListProps) {
  const { cart, updateQuantity, clearCart } = useCart();

  return (
    <div className="space-y-3">
      <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 text-sm space-y-2 pr-1 custom-scrollbar">
        {cart.length === 0 ? (
          <p className="text-slate-400 text-center py-4 text-xs">
            لم تقم بإضافة أي منتج بعد.
          </p>
        ) : (
          cart.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center py-2 gap-2"
            >
              <img
                src={item.image}
                alt={item.name}
                onClick={() =>
                  onZoomImage({ src: item.image, name: item.name })
                }
                className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 cursor-zoom-in hover:opacity-80 transition-opacity"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/80x80/e2e8f0/475569?text=صورة";
                }}
              />
              <div className="flex-1 min-w-0 pr-1">
                <p className="font-medium text-slate-800 text-xs truncate">
                  {item.name}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item._id, item.cartQuantity - 1)
                    }
                    className="w-6 h-6 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 font-bold text-xs"
                  >
                    −
                  </button>
                  <span className="min-w-5 text-center text-[10px] font-bold text-slate-700">
                    {item.cartQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item._id, item.cartQuantity + 1)
                    }
                    className="w-6 h-6 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 font-bold text-xs"
                  >
                    +
                  </button>
                  <span className="text-[10px] text-slate-400">
                    × {item.price.toFixed(2)} ج
                  </span>
                </div>
              </div>
              <div className="text-left font-bold text-slate-700 text-xs shrink-0">
                {(item.price * item.cartQuantity).toFixed(2)} ج
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <button
          type="button"
          onClick={clearCart}
          className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5 ml-1" />
          تفريغ السلة
        </button>
      )}
    </div>
  );
}
