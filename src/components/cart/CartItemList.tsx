 
"use client";

import { useCart, getCartItemKey } from "@/src/context/CartContext";
import { ShoppingCart, Trash2 } from "lucide-react";

interface CartItemListProps {
  onZoomImage: (item: { src: string; name: string }) => void;
}

export default function CartItemList({ onZoomImage }: CartItemListProps) {
  const { cart, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="py-7 text-center text-slate-400 space-y-2 border-b border-slate-100">
        <ShoppingCart className="w-7 h-7 mx-auto text-slate-300 stroke-[1.75]" />
        <p className="text-xs font-medium">
          لم تقم باختيار أي وجبة بعد، أضف وجباتك من القائمة.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1 custom-scrollbar">
      {cart.map((item) => {
        const price = Number(item.price || 0);
        const qty = Number(item.cartQuantity || 0);
        const itemKey =
          item.cartItemId || getCartItemKey(item._id, item.selectedSize);

        return (
          <div
            key={itemKey}
            className="py-3 flex justify-between items-center gap-3 text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div
                className="relative w-12 h-12 rounded-xl overflow-hidden bg-orange-50/50 border border-slate-200/80 shrink-0 cursor-pointer group"
                onClick={() =>
                  onZoomImage({ src: item.image, name: item.name })
                }
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/100x100/fff7ed/D55304?text=?";
                  }}
                />
              </div>

              <div className="flex-1 min-w-0 text-right">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-bold text-slate-800 truncate">
                    {item.name}
                  </p>
                  {item.selectedSize && (
                    <span className="inline-block text-[10px] font-extrabold bg-orange-50 text-[#D55304] border border-[#D55304]/25 px-1.5 py-0.5 rounded-md">
                      {item.selectedSize}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  الكمية:{" "}
                  <span className="font-extrabold text-[#D55304]">{qty}</span> ×{" "}
                  {price} ج.م
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 whitespace-nowrap">
                {price * qty} ج.م
              </span>
              <button
                type="button"
                onClick={() => removeFromCart(item._id, item.selectedSize)}
                className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="حذف الوجبة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}