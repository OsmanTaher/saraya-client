"use client";

import { MealSize } from "@/src/types";
import { SizeSelector } from "./SizeDropdown";

interface ProductQuantityControlProps {
  currentQty: number;
  sizes?: MealSize[];
  selectedSize?: string;
  onSizeChange?: (size: string) => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function ProductQuantityControl({
  currentQty,
  sizes,
  selectedSize,
  onSizeChange,
  onIncrease,
  onDecrease,
}: ProductQuantityControlProps) {
  const hasSizes = Array.isArray(sizes) && sizes.length > 0;

  return (
    <div
      className="px-4 py-3 mt-1 border-t border-slate-100 flex items-center justify-between gap-2"
      dir="rtl"
    >
      <SizeSelector
        sizes={sizes}
        selectedSize={selectedSize}
        onSizeChange={onSizeChange}
        hasSizes={hasSizes}
      />

      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 rounded-xl p-0.5 shrink-0">
        <button
          type="button"
          onClick={onIncrease}
          aria-label="زيادة الكمية"
          className="w-7 h-7 rounded-lg bg-[#D55304] hover:bg-[#b84403] text-white font-bold text-sm flex items-center justify-center transition active:scale-95 cursor-pointer shadow-2xs"
        >
          +
        </button>

        <span className="w-7 text-center font-extrabold text-xs text-slate-800 select-none">
          {currentQty}
        </span>

        <button
          type="button"
          onClick={onDecrease}
          disabled={currentQty === 0}
          aria-label="إنقاص الكمية"
          className="w-7 h-7 rounded-lg bg-[#D55304] hover:bg-[#b84403] disabled:bg-[#D55304]/40 text-white font-bold text-sm flex items-center justify-center transition active:scale-95 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
        >
          -
        </button>
      </div>
    </div>
  );
}
