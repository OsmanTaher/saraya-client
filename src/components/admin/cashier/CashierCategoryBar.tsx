"use client";

import { Flame } from "lucide-react";
import { CATEGORIES } from "@/src/constants/categories";

interface CashierCategoryBarProps {
  currentCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function CashierCategoryBar({
  currentCategory,
  onSelectCategory,
}: CashierCategoryBarProps) {
  return (
    <div className="mb-2 flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
      <button
        type="button"
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
          !currentCategory
            ? "bg-[#D55304] text-white border-[#D55304] shadow-sm"
            : "bg-white text-slate-700 border-slate-200/80 hover:border-[#D55304]/40"
        }`}
      >
        <Flame className="w-4 h-4" />
        <span>كل المنيو</span>
      </button>

      {CATEGORIES.map((cat) => {
        const active = currentCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shrink-0 transition-all cursor-pointer border ${
              active
                ? "bg-[#D55304] text-white border-[#D55304] shadow-sm"
                : "bg-white text-slate-700 border-slate-200/80 hover:border-[#D55304]/40"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}