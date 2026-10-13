"use client";

import { MealSize } from "@/src/types";

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
      {/* قسم اختيار الحجم (يظهر إذا كان للوجبة أحجام، وإلا يظهر نص حجم موحد هادئ) */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        {hasSizes ? (
          <>
            <label className="text-xs font-bold text-slate-600 shrink-0">
              الحجم:
            </label>
            <select
              value={selectedSize}
              onChange={(e) => onSizeChange?.(e.target.value)}
              className="w-full max-w-[150px] bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#D55304] transition cursor-pointer"
            >
              {sizes!.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} ({Number(s.price).toFixed(2)} ج.م)
                </option>
              ))}
            </select>
          </>
        ) : (
          <span className="text-xs font-medium text-slate-400">
            حجم موحد
          </span>
        )}
      </div>

      {/* أزرار التحكم بالكمية باللون البرتقالي #D55304 */}
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