"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { MealSize } from "@/src/types";

interface SizeSelectorProps {
  sizes?: MealSize[];
  selectedSize?: string; // علامة ? هنا تحل مشكلة undefined
  onSizeChange?: (size: string) => void;
  hasSizes: boolean;
}

export function SizeSelector({
  sizes = [],
  selectedSize,
  onSizeChange,
  hasSizes,
}: SizeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة تلقائياً عند الضغط في أي مكان خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!hasSizes) {
    return (
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <span className="text-xs font-medium text-slate-400">حجم موحد</span>
      </div>
    );
  }

  const currentSizeObj =
    sizes.find((s) => s.name === selectedSize) || sizes[0];

  return (
    <div className="flex items-center gap-1.5 flex-1 min-w-0" ref={dropdownRef}>
      <label className="text-xs font-bold text-slate-600 shrink-0">
        الحجم:
      </label>

      <div className="relative w-full max-w-[165px]">
        {/* زر فتح القائمة */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-full flex items-center justify-between gap-1.5 bg-slate-50 hover:bg-orange-50/60 border text-xs font-bold rounded-xl px-2.5 py-1.5 transition cursor-pointer ${
            isOpen
              ? "border-[#D55304] ring-2 ring-[#D55304]/15 bg-white text-[#D55304]"
              : "border-slate-200 text-slate-800 hover:border-orange-300"
          }`}
        >
          <span className="truncate">
            {currentSizeObj?.name}{" "}
            <span className="font-normal text-[11px] text-slate-500">
              ({Number(currentSizeObj?.price || 0).toFixed(2)} ج.م)
            </span>
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[#D55304]" : "text-slate-400"
            }`}
          />
        </button>

        {/* القائمة المنبثقة (تفتح للأعلى حتى لا تختفي خلف حدود الكارت) */}
        {isOpen && (
          <div className="absolute z-50 bottom-full mb-1.5 right-0 w-full min-w-[175px] bg-white rounded-xl shadow-xl border border-orange-100 p-1 divide-y divide-slate-50 animate-in fade-in zoom-in-95 duration-150">
            {sizes.map((s) => {
              const isSelected = s.name === currentSizeObj?.name;
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => {
                    onSizeChange?.(s.name);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? "bg-orange-50 text-[#D55304] font-bold"
                      : "text-slate-700 hover:bg-orange-50/80 hover:text-[#D55304] font-medium"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#D55304] shrink-0" />
                    )}
                    <span>{s.name}</span>
                  </span>
                  <span
                    className={`text-[11px] ${
                      isSelected ? "text-[#D55304] font-bold" : "text-slate-400"
                    }`}
                  >
                    {Number(s.price).toFixed(2)} ج.م
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}