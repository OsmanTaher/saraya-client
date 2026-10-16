"use client";

 

import Link from "next/link";
import { Menu, LogOut, Search } from "lucide-react";

interface AdminHeaderProps {
  isCashierPage: boolean;
  isStoreOpen: boolean;
  onOpenMenu: () => void;
  onLogout: () => void;
  onOpenSearch?: () => void;
}

export default function AdminHeader({
  isCashierPage,
  isStoreOpen,
  onOpenMenu,
  onLogout,
  onOpenSearch,
}: AdminHeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 bg-[#D55304] text-white shadow-md print:hidden"
      dir="rtl"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={isCashierPage ? "/admin/cashier" : "/admin/orders"}
            className="flex items-center gap-3"
          >
            <img
              src="/logo.png"
              alt="مطعم السرايا"
              className="w-10 h-10 rounded-xl bg-white p-1 object-contain shadow-xs"
            />
            <div className="leading-tight text-right">
              <h1 className="font-black text-base sm:text-lg">مطعم السرايا</h1>
              <p className="text-[11px] text-orange-100 font-medium">
                {isCashierPage
                  ? "أشهى المأكولات والمشروبات"
                  : "لوحة تحكم المشرف وإدارة المطبخ"}
              </p>
            </div>
          </Link>

          {!isStoreOpen && (
            <span className="bg-rose-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full animate-pulse">
              المطعم مغلق للعملاء
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isCashierPage && (
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => onOpenSearch?.()}
              title="بحث عن وجبة"
              aria-label="بحث عن وجبة"
              className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onLogout}
            title="تسجيل الخروج"
            aria-label="تسجيل الخروج"
            className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onOpenMenu}
            title="القائمة"
            aria-label="القائمة الجانبية"
            className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
