/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
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
  Printer,
  Calculator,
  Store,
} from "lucide-react";

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
    label: "ملخص تحضيرات المطبخ",
    icon: BarChart3,
  },
  {
    href: "/admin/prints",
    label: "طباعة الفواتير الحرارية",
    icon: Printer,
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

  useEffect(() => {
    const token = getAdminToken();

    if (pathname === "/admin") {
      if (token) {
        router.replace("/admin/orders");
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
    }
  }, [pathname, router]);

  const handleLogout = () => {
    removeAdminToken();
    setDrawerOpen(false);
    router.replace("/");
  };

  if (checking || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm font-bold">
        جاري التحقق من الصلاحيات...
      </div>
    );
  }

  // صفحة تسجيل الدخول (/admin) أو صفحة الكاشير (/admin/cashier التي تستخدم هيدر ومنيو الصفحة الرئيسية)
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" dir="rtl">
      {/* شريط التنقل العلوي الخاص بصفحات الأدمن (/admin/orders وغيرها) */}
      <header className="sticky top-0 z-40 bg-[#D55304] text-white shadow-md print:hidden">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* يمين الهيدر: الشعار واسم لوحة التحكم */}
          <Link href="/admin/orders" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="مطعم السرايا"
              className="w-10 h-10 rounded-xl bg-white p-1 object-contain shadow-xs"
            />
            <div className="leading-tight">
              <h1 className="font-black text-base sm:text-lg">مطعم السرايا</h1>
              <p className="text-[11px] text-orange-100 font-medium">
                لوحة تحكم المشرف وإدارة المطبخ
              </p>
            </div>
          </Link>

          

          {/* يسار الهيدر: أزرار القائمة وتسجيل الخروج */}
          <div className="flex items-center gap-2">
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
            className="w-72 max-w-[80vw] bg-white h-full shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-right duration-200"
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
                </div>
              </nav>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs sm:text-sm transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </aside>
        </div>
      )}

      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}