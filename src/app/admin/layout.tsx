/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getAdminToken, removeAdminToken } from "@/src/lib/cookies";
import {
  Menu,
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
import SearchBar from "@/src/components/layout/SearchBar";

const ADMIN_NAV_LINKS = [
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [togglingStore, setTogglingStore] = useState(false);
  const [clearingOrders, setClearingOrders] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchStoreStatus = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/admin/store-status`);
      if (res.ok) {
        const data = await res.json();
        setIsStoreOpen(Boolean(data.isStoreOpen));
      }
    } catch (err) {
      console.error("Failed to fetch store status:", err);
    }
  }, [apiUrl]);

  useEffect(() => {
    const token = getAdminToken();

    if (pathname === "/admin") {
      if (token) {
        router.replace("/admin/orders");
      } else {
        setAuthorized(true);
        setChecking(false);
      }
      return;
    }

    if (!token) {
      router.replace("/admin");
    } else {
      setAuthorized(true);
      setChecking(false);
      fetchStoreStatus();
    }
  }, [pathname, router, fetchStoreStatus]);

  const handleLogout = () => {
    removeAdminToken();
    setDrawerOpen(false);
    router.replace("/");
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // تبديل فتح / إغلاق الموقع للعملاء
  const handleToggleStore = async () => {
    setTogglingStore(true);
    try {
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/admin/store-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isStoreOpen: !isStoreOpen }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsStoreOpen(Boolean(data.isStoreOpen));
      }
    } catch (err) {
      console.error("Error toggling store status:", err);
    } finally {
      setTogglingStore(false);
    }
  };

  // مسح جميع الطلبات وتنظيف جروب التلجرام لليوم الجديد
  const handleClearAllOrders = async () => {
    const confirmed = window.confirm(
      "تحذير هام: هل أنت متأكد من حذف جميع طلبات اليوم ومسح رسائل جروب التلجرام لبدء يوم جديد؟",
    );
    if (!confirmed) return;

    setClearingOrders(true);
    try {
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/orders/clear-all`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "تم مسح جميع الطلبات وجروب التلجرام بنجاح!");
        setDrawerOpen(false);
        window.location.reload();
      } else {
        alert(data.message || "تعذر مسح الطلبات");
      }
    } catch {
      alert("حدث خطأ أثناء الاتصال بالسيرفر");
    } finally {
      setClearingOrders(false);
    }
  };

  if (checking || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm font-bold">
        جاري التحقق من الصلاحيات...
      </div>
    );
  }

  if (pathname === "/admin") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" dir="rtl">
      <header className="sticky top-0 z-40 bg-[#D55304] text-white shadow-md print:hidden">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/admin/orders"
            className="flex items-center gap-3"
            onClick={handleLogoClick}
          >
            <img
              src="/logo.png"
              alt="مطعم السرايا"
              className="w-10 h-10 rounded-xl bg-white p-0.5 object-contain shadow-xs"
            />
            <div className="text-right">
            <h1 className="text-lg md:text-xl font-bold leading-tight">
              مطعم السرايا
            </h1>
            <p className="text-xs text-white/80 font-normal">
              أشهى المأكولات والمشويات
            </p>
          </div>
          </Link>

          <div className="flex items-center gap-2">
            {!isStoreOpen && (
              <span className="bg-rose-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full animate-pulse">
                مغلق
              </span>
            )}

            {pathname === "/admin/cashier" && <SearchBar />}

            <button
              type="button"
              onClick={handleLogout}
              title="تسجيل الخروج"
              className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              title="القائمة"
              className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* القائمة الجانبية للأدمن */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-start print:hidden"
          onClick={() => setDrawerOpen(false)}
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
                  onClick={() => setDrawerOpen(false)}
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
                      onClick={() => setDrawerOpen(false)}
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
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-600 hover:bg-slate-100 transition"
                  >
                    <Store className="w-4 h-4 shrink-0 text-[#D55304]" />
                    <span>عرض موقع العميل الرئيسي</span>
                  </Link>
                  <Link
                    href="https://web.telegram.org/a/#-1004380812989"
                    target="_blank"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-600 hover:bg-slate-100 transition"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0 text-[#D55304]" />
                    <span>جروب التلجرام لطلبات المطبخ</span>
                  </Link>
                </div>
              </nav>
            </div>

            {/* الأزرار الثلاثة أسفل القائمة الجانبية: إغلاق الموقع + مسح الطلبات + تسجيل الخروج */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              {/* 1. زر إغلاق / فتح الموقع */}
              <button
                type="button"
                disabled={togglingStore}
                onClick={handleToggleStore}
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

              {/* 2. زر مسح الطلبات وتنظيف التلجرام */}
              <button
                type="button"
                disabled={clearingOrders}
                onClick={handleClearAllOrders}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 font-extrabold text-xs sm:text-sm transition cursor-pointer"
              >
                {clearingOrders ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>مسح الطلبات</span>
              </button>

              {/* 3. زر تسجيل الخروج */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs sm:text-sm transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
