"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAdminToken } from "@/src/lib/cookies";
import { Order } from "@/src/types";

export default function CashierOrderWatcher() {
  const seenOrderIds = useRef<Set<string>>(new Set());
  const initialized = useRef(false);
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const checkNewCustomerOrders = async () => {
      try {
        const token = getAdminToken();
        if (!token) return;

        const res = await fetch(`${apiUrl}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;
        const orders: Order[] = await res.json();
        if (!Array.isArray(orders)) return;

        if (!initialized.current) {
          orders.forEach((o) => seenOrderIds.current.add(o._id));
          initialized.current = true;
          return;
        }

        for (const order of orders) {
          if (!seenOrderIds.current.has(order._id)) {
            seenOrderIds.current.add(order._id);

            if (order.orderType !== "cashier") {
              const typeLabel =
                order.orderType === "dine_in"
                  ? `صالة - ترابيزة ${order.tableNumber}`
                  : order.orderType === "pickup"
                    ? "استلام من الفرع"
                    : "توصيل للمنازل";

              toast.success(`طلب جديد من عميل #${order.orderNumber}`, {
                description: `${order.customerName || "عميل السرايا"} (${typeLabel}) — الإجمالي: ${Number(order.totalPrice || 0)} ج.م`,
                duration: 9000,
                action: {
                  label: "عرض الطلب",
                  onClick: () => router.push("/admin/orders"),
                },
              });
            }
          }
        }
      } catch {}
    };

    checkNewCustomerOrders();
    const interval = setInterval(checkNewCustomerOrders, 8000);
    return () => clearInterval(interval);
  }, [apiUrl, router]);

  return null;
}
