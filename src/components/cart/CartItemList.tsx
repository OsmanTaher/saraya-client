"use client";

/* eslint-disable @next/next/no-img-element */

import { useCart, getCartItemKey } from "@/src/context/CartContext";
import { ShoppingCart, Trash2 } from "lucide-react";

interface CartItemListProps {
  onZoomImage: (image: { src: string; name: string }) => void;
}

export default function CartItemList({ onZoomImage }: CartItemListProps) {
  const { cart, updateQuantity, clearCart } = useCart();

  return (
    <div className="space-y-3" dir="rtl">
      <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 text-sm space-y-2 pr-1 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-5 text-slate-400 space-y-1.5">
            <ShoppingCart className="w-6 h-6 text-slate-300 stroke-[1.75]" />
            <p className="text-xs font-medium text-slate-400">
              لم تقم بإضافة أي وجبة بعد.
            </p>
          </div>
        ) : (
          cart.map((item) => {
            const itemKey =
              item.cartItemId || getCartItemKey(item._id, item.selectedSize);
            const itemPrice = Number(item.price || 0);

            return (
              <div
                key={itemKey}
                className="flex justify-between items-center py-2.5 gap-2.5"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  onClick={() =>
                    onZoomImage({ src: item.image, name: item.name })
                  }
                  className="w-11 h-11 rounded-xl object-cover bg-slate-100 shrink-0 cursor-zoom-in hover:opacity-80 transition-opacity border border-slate-200/60"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/80x80/fff7ed/D55304?text=وجبة";
                  }}
                />

                <div className="flex-1 min-w-0 pr-1 text-right">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="font-bold text-slate-800 text-xs truncate">
                      {item.name}
                    </p>
                    {item.selectedSize && (
                      <span className="text-[10px] font-bold bg-orange-50 text-[#D55304] border border-[#D55304]/20 px-1.5 py-0.5 rounded-md">
                        {item.selectedSize}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 mt-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.cartQuantity + 1,
                          item.selectedSize
                        )
                      }
                      className="w-6 h-6 flex items-center justify-center rounded-md bg-[#D55304] text-white hover:bg-[#b84403] font-bold text-xs transition cursor-pointer"
                    >
                      +
                    </button>

                    <span className="min-w-5 text-center text-xs font-extrabold text-slate-800">
                      {item.cartQuantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.cartQuantity - 1,
                          item.selectedSize
                        )
                      }
                      className="w-6 h-6 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
                    >
                      −
                    </button>

                    <span className="text-[11px] text-slate-400 mr-1">
                      × {itemPrice.toFixed(2)} ج.م
                    </span>
                  </div>
                </div>

                <div className="text-left font-extrabold text-[#D55304] text-xs shrink-0">
                  {(itemPrice * item.cartQuantity).toFixed(2)} ج.م
                </div>
              </div>
            );
          })
        )}
      </div>

      {cart.length > 0 && (
        <button
          type="button"
          onClick={clearCart}
          className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 ml-1" />
          تفريغ السلة
        </button>
      )}
    </div>
  );
}