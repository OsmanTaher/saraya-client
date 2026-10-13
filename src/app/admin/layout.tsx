"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Tajawal } from "next/font/google";
import {
  Menu,
  X,
  ShoppingBag,
  Boxes,
  Package,
  LogOut,
  Loader2,
  Printer
} from "lucide-react";
import { getCookie, deleteCookie } from "@/src/lib/cookies";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (pathname === "/admin") {
      // The login page is the authentication boundary for this route tree.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(true);
      return;
    }

    const token = getCookie("toshka_admin_token");

    if (!token) {
      setIsAuthenticated(false);
      router.replace("/admin");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`${apiUrl}/admin/verify`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          deleteCookie("toshka_admin_token");
          setIsAuthenticated(false);
          router.replace("/admin");
        }
      } catch {
        deleteCookie("toshka_admin_token");
        setIsAuthenticated(false);
        router.replace("/admin");
      }
    };

    verifyToken();
  }, [pathname, router, apiUrl]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll =
        window.scrollY || document.documentElement.scrollTop;

      if (totalScroll > 0) {
        const progress = (currentScroll / totalScroll) * 100;
        setScrollProgress(Math.min(progress, 100));
      } else {
        setScrollProgress(0);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Reset menu state when navigation completes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    deleteCookie("toshka_admin_token");
    setIsAuthenticated(false);
    setIsMenuOpen(false);
    router.replace("/");
  };

  if (isAuthenticated === null && pathname !== "/admin") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3 text-slate-500 font-bold text-sm"
        dir="rtl"
      >
        <Loader2 className="w-8 h-8 text-[#5850EC] animate-spin" />
        <span>جاري التحقق من صلاحية الدخول...</span>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== "/admin") return null;

  return (
    <div
      className={`${tajawal.className} min-h-screen bg-slate-50 text-slate-800`}
      dir="rtl"
    >
      <header className="bg-[#5850EC] text-white sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            onClick={handleLogoClick}
            title="الصعود لأعلى الصفحة"
          >
            <div className="relative w-10 h-10 shrink-0 active:scale-95 transition-transform duration-150">
              <Image
                src="/icon.png"
                alt="شعار متجر بيعلي جملة"
                width={40}
                height={40}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-right">
              <h1 className="text-lg md:text-xl font-bold leading-tight">
                متجر بيعلي جملة
              </h1>
              <p className="text-xs text-white/80 font-normal">
                لوحة تحكم المشرف
              </p>
            </div>
          </div>

          {pathname !== "/admin" && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all active:scale-95 flex items-center justify-center"
                title="تسجيل الخروج"
                aria-label="تسجيل الخروج"
              >
                <LogOut size={20} />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`p-2.5 rounded-xl transition ${
                    isMenuOpen ? "bg-white/20" : "bg-white/20 hover:bg-white/30"
                  }`}
                  aria-label="Toggle Admin Menu"
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {isMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-black/20"
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="absolute left-0 mt-2.5 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                      <nav className="flex flex-col gap-1">
                        <Link
                          href="/admin/orders"
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                            pathname === "/admin/orders"
                              ? "bg-indigo-50 text-indigo-600"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <ShoppingBag size={16} />
                          </div>
                          <span>الطلبات</span>
                        </Link>

                        <Link
                          href="/admin/orders-summary"
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                            pathname === "/admin/orders-summary"
                              ? "bg-amber-50 text-amber-600"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <Boxes size={16} />
                          </div>
                          <span>ملخص الطلبات</span>
                        </Link>

                        <Link
                          href="/admin/products"
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                            pathname === "/admin/products"
                              ? "bg-emerald-50 text-emerald-600"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Package size={16} />
                          </div>
                          <span>المنتجات</span>
                        </Link>

                        <Link
                          href="/admin/prints"
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                            pathname === "/admin/prints"
                              ? "bg-amber-50 text-indigo-600"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <Printer size={16} />
                          </div>
                          <span>طباعة</span>
                        </Link>
                      </nav>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          className="absolute bottom-0 right-0 h-0.75 bg-[#FCD34D] transition-[width] duration-100 ease-out z-50"
          style={{ width: `${scrollProgress}%` }}
        />
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
    </div>
  );
}
