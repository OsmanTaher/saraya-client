"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Toaster, toast } from "sonner";
import { getAdminToken, removeAdminToken } from "@/src/lib/cookies";
import AdminHeader from "@/src/components/admin/layout/AdminHeader";
import AdminSidebar from "@/src/components/admin/layout/AdminSidebar";
import SearchBar from "@/src/components/layout/SearchBar";
import ConfirmModal from "@/src/components/ui/ConfirmModal";

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
  const [searchOpen, setSearchOpen] = useState(false);

  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [togglingStore, setTogglingStore] = useState(false);
  const [clearingOrders, setClearingOrders] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const isCashierPage = pathname === "/admin/cashier";

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
      fetchStoreStatus();
    }
  }, [pathname, router, fetchStoreStatus]);

  const handleLogout = () => {
    removeAdminToken();
    setDrawerOpen(false);
    router.replace("/");
  };

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
        toast.success(data.message || "تم تحديث حالة المطعم");
      }
    } catch {
      toast.error("تعذر تحديث حالة المطعم");
    } finally {
      setTogglingStore(false);
    }
  };

  const executeClearAllOrders = async () => {
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
        toast.success(data.message || "تم مسح جميع الطلبات وتنظيف التلجرام!");
        setConfirmClearOpen(false);
        setDrawerOpen(false);
        setTimeout(() => window.location.reload(), 600);
      } else {
        toast.error(data.message || "تعذر مسح الطلبات");
      }
    } catch {
      toast.error("حدث خطأ أثناء الاتصال بالسيرفر");
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
    <div
      className="min-h-screen bg-slate-50 flex flex-col print:bg-white print:min-h-0"
      dir="rtl"
    >
      <Toaster position="bottom-left" dir="rtl" richColors closeButton />

      <AdminHeader
        isCashierPage={isCashierPage}
        isStoreOpen={isStoreOpen}
        onOpenMenu={() => setDrawerOpen(true)}
        onLogout={handleLogout}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <AdminSidebar
        isOpen={drawerOpen}
        pathname={pathname}
        isStoreOpen={isStoreOpen}
        togglingStore={togglingStore}
        clearingOrders={clearingOrders}
        onClose={() => setDrawerOpen(false)}
        onToggleStore={handleToggleStore}
        onRequestClearOrders={() => setConfirmClearOpen(true)}
        onLogout={handleLogout}
      />

      {isCashierPage && (
        <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      )}

      <ConfirmModal
        isOpen={confirmClearOpen}
        title="مسح جميع طلبات اليوم وتصفير التلجرام"
        message="هل أنت متأكد من حذف جميع الطلبات المسجلة اليوم ومسح رسائل جروب التلجرام بالكامل لبدء يوم عمل جديد؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="نعم، امسح الكل"
        cancelText="تراجع"
        variant="danger"
        loading={clearingOrders}
        onConfirm={executeClearAllOrders}
        onCancel={() => setConfirmClearOpen(false)}
      />

      <main className="flex-1 container mx-auto px-4 py-6 print:p-0 print:m-0 print:max-w-none">
        {children}
      </main>
    </div>
  );
}
