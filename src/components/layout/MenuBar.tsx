"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { X, UtensilsCrossed, Flame, ClipboardList, LayoutGrid } from "lucide-react";

interface MenuBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  "المشويات على الفحم",
  "البيتزا",
  "الأكل الإيطالي",
  "الطواجن والأطباق الشرقية",
  "الوجبات والصواني",
  "السندوتشات والبرجر",
  "المأكولات البحرية (سي فود)",
  "الشوربة",
  "السلطات والمقبلات الباردة",
  "المقبلات الساخنة والأطباق الجانبية",
  "الحلويات",
  "المشروبات",
];

export default function MenuBar({ isOpen, onClose }: MenuBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category")?.trim() || null;

  const isCashierPage = pathname?.startsWith("/admin");

  if (!isOpen) return null;

  const handleCategorySelect = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set("category", category.trim());
    } else {
      params.delete("category");
    }

    const basePath = isCashierPage ? "/admin/cashier" : "/";
    const queryString = params.toString();
    router.push(queryString ? `${basePath}?${queryString}` : basePath);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-start bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      dir="rtl"
      onClick={onClose}
    >
      <aside
        className="w-72 max-w-[80vw] bg-white h-full shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* رأس القائمة */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
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

          {/* أزرار الأقسام */}
          <nav className="space-y-2">
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
              <Flame className="w-4 h-4" />
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
                  <span>{category}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-white" : "bg-[#D55304]/40"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* روابط سريعة للأدمن تظهر فقط داخل شاشة الكاشير */}
          {isCashierPage && (
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              <p className="text-[11px] font-extrabold text-slate-400 px-1">
                الانتقال السريع للإدارة
              </p>
              <Link
                href="/admin/orders"
                onClick={onClose}
                className="w-full px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#D55304] font-extrabold text-xs flex items-center gap-2 transition"
              >
                <ClipboardList className="w-4 h-4" />
                <span>سجل وإدارة الطلبات</span>
              </Link>
              <Link
                href="/admin/products"
                onClick={onClose}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-2 transition"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>إدارة الوجبات والمنيو</span>
              </Link>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 pt-4 text-center text-xs text-slate-400 font-medium">
          مطعم السرايا — أشهى المأكولات
        </div>
      </aside>
    </div>
  );
}