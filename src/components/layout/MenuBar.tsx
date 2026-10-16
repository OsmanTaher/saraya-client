"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X, UtensilsCrossed, Flame, Receipt } from "lucide-react";
import { CATEGORIES } from "@/src/constants/categories";
import { useCart } from "@/src/context/CartContext";

interface MenuBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuBar({ isOpen, onClose }: MenuBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { totalItems } = useCart();
  const currentCategory = searchParams.get("category")?.trim() || null;

  if (!isOpen) return null;

  const handleCategorySelect = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set("category", category.trim());
    } else {
      params.delete("category");
    }

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
    onClose();
  };

  const handleScrollToOrderSummary = () => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById("order-summary");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-start bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      dir="rtl"
      onClick={onClose}
    >
      <aside
        className="w-72 max-w-[82vw] bg-white h-full shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#D55304] text-white flex items-center justify-center shadow-xs">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-900 text-base">
              أقسام المنيو
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
            aria-label="إغلاق القائمة"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-3 shrink-0">
          <button
            type="button"
            onClick={handleScrollToOrderSummary}
            className="w-full px-4 py-3 rounded-xl bg-orange-50 hover:bg-orange-100 border border-[#D55304]/30 text-[#D55304] font-extrabold text-xs sm:text-sm flex items-center justify-between transition cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 shrink-0" />
              <span>ملخص الطلب والحساب</span>
            </div>
            {totalItems > 0 && (
              <span className="bg-[#D55304] text-white text-[11px] font-black px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
          <button
            type="button"
            onClick={() => handleCategorySelect(null)}
            className={`w-full text-right px-4 py-3 rounded-xl font-bold text-sm transition flex items-center justify-between cursor-pointer ${
              !currentCategory
                ? "bg-[#D55304] text-white shadow-xs"
                : "bg-slate-50 hover:bg-orange-50 text-slate-700"
            }`}
          >
            <span>كل الوجبات (المنيو الكامل)</span>
            <Flame className="w-4 h-4 shrink-0" />
          </button>

          {CATEGORIES.map((category) => {
            const isActive = currentCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategorySelect(category)}
                className={`w-full text-right px-4 py-3 rounded-xl font-bold text-sm transition flex items-center justify-between cursor-pointer ${
                  isActive
                    ? "bg-[#D55304] text-white shadow-xs"
                    : "bg-slate-50 hover:bg-orange-50 text-slate-700"
                }`}
              >
                <span className="truncate">{category}</span>
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isActive ? "bg-white" : "bg-[#D55304]/40"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="border-t border-slate-100 pt-3 mt-3 text-center text-xs text-slate-400 font-medium shrink-0">
          مطعم السرايا — أشهى المأكولات
        </div>
      </aside>
    </div>
  );
}
