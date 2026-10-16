"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { MealSize } from "@/src/types";

interface SizeSelectorProps {
  sizes?: MealSize[] | null;
  selectedSize?: string;
  onSizeChange?: (sizeName: string) => void;
  onSelectSize?: (sizeName: string) => void;
  onSelect?: (sizeName: string) => void;
  hasSizes?: boolean;
}

export function SizeSelector({
  sizes = [],
  selectedSize,
  onSizeChange,
  onSelectSize,
  onSelect,
  hasSizes = true,
}: SizeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const validSizes = Array.isArray(sizes) ? sizes : [];
  if (!hasSizes || validSizes.length === 0) {
    return (
      <span className="text-[11px] font-bold text-slate-400 select-none">
        حجم عادي
      </span>
    );
  }

  const currentSizeObj =
    validSizes.find((s) => s.name === selectedSize) || validSizes[0];

  const handleChooseSize = (sizeName: string) => {
    onSizeChange?.(sizeName);
    onSelectSize?.(sizeName);
    onSelect?.(sizeName);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-1.5 flex-1 min-w-0" ref={dropdownRef}>
      <span className="text-[11px] font-bold text-slate-500 shrink-0">
        الحجم:
      </span>

      <div className="relative flex-1 min-w-0">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center justify-between gap-1.5 bg-slate-50 hover:bg-orange-50/60 border border-slate-200/90 hover:border-[#D55304]/50 rounded-xl px-2.5 py-1.5 text-xs transition-all cursor-pointer focus:outline-none focus:border-[#D55304] focus:ring-2 focus:ring-[#D55304]/15"
        >
          <div className="flex items-center gap-1 truncate">
            <span className="font-extrabold text-slate-800 truncate">
              {currentSizeObj?.name}
            </span>
            <span className="text-[10px] font-bold text-[#D55304] shrink-0">
              ({Number(currentSizeObj?.price || 0)} ج.م)
            </span>
          </div>

          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[#D55304]" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute bottom-full mb-1.5 right-0 left-0 z-30 bg-white border border-slate-200/90 rounded-xl shadow-lg py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {validSizes.map((s) => {
              const isSelected = s.name === currentSizeObj?.name;
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => handleChooseSize(s.name)}
                  className={`w-full px-2.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-orange-50/90 text-[#D55304] font-extrabold"
                      : "text-slate-700 font-bold hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#D55304] shrink-0" />
                    )}
                    <span className="truncate">{s.name}</span>
                  </div>
                  <span
                    className={`text-[11px] shrink-0 ${
                      isSelected ? "text-[#D55304]" : "text-slate-500"
                    }`}
                  >
                    {Number(s.price)} ج.م
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

export default SizeSelector;