"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface MenuBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  "أقلام و أدوات مكتبية",
  "كشاكيل و كراسات",
  "أدوات الرسم",
  "لانشبوك و زمزمية",
  "مقالم و شنط",
];

export default function MenuBar({ isOpen, onClose }: MenuBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleCategorySelect = (category: string | null) => {
    if (category) {
      const encoded = encodeURIComponent(category.trim());
      router.push(`/?category=${encoded}`);
    } else {
      router.push("/");
    }
    onClose();
  };

  const handleOrderSummarySelect = () => {
    router.push("/#order-summary");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/20">
      <div
        ref={menuRef}
        className="absolute   top-14  left-4 sm:left-6 z-50 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150"
      >
        <ul className="flex flex-col p-2">
          <li>
            <button
              type="button"
              onClick={() => handleCategorySelect(null)}
              className={`w-full text-right px-4 py-2.5 rounded-xl text-sm transition ${
                !currentCategory
                  ? "bg-indigo-50 text-indigo-600 font-bold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              كل الأقسام
            </button>
          </li>

          {categories.map((cat) => (
            <li key={cat}>
              <button
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`w-full text-right px-4 py-2.5 rounded-xl text-sm transition ${
                  currentCategory === cat
                    ? "bg-indigo-50 text-indigo-600 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={handleOrderSummarySelect}
              className="w-full text-right px-4 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition"
            >
              ملخص الطلب
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
