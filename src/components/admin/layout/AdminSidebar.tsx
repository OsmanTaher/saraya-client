 
"use client";

import Link from "next/link";
import {
  X,
  LogOut,
  ClipboardList,
  UtensilsCrossed,
  BarChart3,
  Calculator,
  Store,
  Power,
  Trash2,
  Loader2,
  MessageCircle,
} from "lucide-react";

export const ADMIN_NAV_LINKS = [
  {
    href: "/admin/cashier",
    label: "نقطة بيع الكاشير (POS)",
    icon: Calculator,
  },
  {
    href: "/admin/orders",
    label: "سجل وإدارة الطلبات",
    icon: ClipboardList,
  },
  {
    href: "/admin/products",
    label: "إدارة المنيو والوجبات",
    icon: UtensilsCrossed,
  },
  {
    href: "/admin/orders-summary",
    label: "ملخص طلبات اليوم",
    icon: BarChart3,
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  pathname: string;
  isStoreOpen: boolean;
  togglingStore: boolean;
  clearingOrders: boolean;
  onClose: () => void;
  onToggleStore: () => void;
  onRequestClearOrders: () => void;
  onLogout: () => void;
}

export default function AdminSidebar({
  isOpen,
  pathname,
  isStoreOpen,
  togglingStore,
  clearingOrders,
  onClose,
  onToggleStore,
  onRequestClearOrders,
  onLogout,
}: AdminSidebarProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-start print:hidden"
      onClick={onClose}
    >
      <aside
        className="w-72 max-w-[82vw] bg-white h-full shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="السرايا"
                className="w-9 h-9 rounded-xl object-contain bg-orange-50 p-1"
              />
              <div>
                <h2 className="font-black text-slate-900 text-sm">
                  إدارة مطعم السرايا
                </h2>
                <p className="text-[11px] text-slate-400">قائمة المشرف</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-1.5">
            {ADMIN_NAV_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition ${
                    isActive
                      ? "bg-[#D55304] text-white shadow-xs"
                      : "text-slate-700 hover:bg-orange-50 hover:text-[#D55304]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-2 mt-2 border-t border-slate-100">
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-600 hover:bg-slate-100 transition"
              >
                <Store className="w-4 h-4 shrink-0 text-[#D55304]" />
                <span>عرض موقع العميل الرئيسي</span>
              </Link>
              <Link
                href="https://web.telegram.org/a/#-1004380812989"
                target="_blank"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-600 hover:bg-slate-100 transition"
              >
                <MessageCircle className="w-4 h-4 shrink-0 text-[#D55304]" />
                <span>جروب تلجرام للمطبخ</span>
              </Link>
            </div>
          </nav>
        </div>

        <div className="space-y-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            disabled={togglingStore}
            onClick={onToggleStore}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition cursor-pointer border ${
              isStoreOpen
                ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
            }`}
          >
            {togglingStore ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Power className="w-4 h-4" />
            )}
            <span>
              {isStoreOpen
                ? "إغلاق الموقع (المطعم مفتوح)"
                : "فتح الموقع (المطعم مغلق)"}
            </span>
          </button>

          <button
            type="button"
            disabled={clearingOrders}
            onClick={onRequestClearOrders}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 font-extrabold text-xs sm:text-sm transition cursor-pointer"
          >
            {clearingOrders ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>مسح الطلبات</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs sm:text-sm transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </div>
  );
}