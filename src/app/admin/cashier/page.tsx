"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/src/components/product/ProductCard";
import CashierCategoryBar from "@/src/components/admin/cashier/CashierCategoryBar";
import CashierCartPanel from "@/src/components/admin/cashier/CashierCartPanel";
import CashierThermalReceipt, {
  PrintedOrderSnapshot,
} from "@/src/components/admin/cashier/CashierThermalReceipt";
import CashierOrderWatcher from "@/src/components/admin/cashier/CashierOrderWatcher";
import { useCart } from "@/src/context/CartContext";
import { CATEGORIES } from "@/src/constants/categories";
import { Product } from "@/src/types";

function CashierContent() {
  const { cart, clearCart, subtotalPrice } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategory = searchParams.get("category")?.trim() || null;

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [notes, setNotes] = useState("");
  const [paymentMode, setPaymentMode] = useState<"cash" | "card" | "instapay">(
    "cash"
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [lastReceipt, setLastReceipt] = useState<PrintedOrderSnapshot | null>(
    null
  );

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    async function fetchMeals() {
      try {
        const res = await fetch(`${apiUrl}/products`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to load products for cashier:", err);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchMeals();
  }, [apiUrl]);

  const displayedProducts = currentCategory
    ? products.filter((p) => (p.category ?? "").trim() === currentCategory)
    : products;

  const categoriesWithProducts = Array.from(
    new Set([
      ...CATEGORIES,
      ...displayedProducts.map((p) => p.category?.trim()),
    ])
  )
    .filter((cat): cat is string => Boolean(cat))
    .map((cat) => ({
      name: cat,
      products: displayedProducts.filter((p) => p.category?.trim() === cat),
    }))
    .filter((group) => group.products.length > 0);

  const totalPrice = Number(subtotalPrice || 0);

  const handleCategoryTabClick = (category: string | null) => {
    if (category) {
      router.push(`/admin/cashier?category=${encodeURIComponent(category)}`);
    } else {
      router.push("/admin/cashier");
    }
  };

  const handlePrintAndSubmit = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (cart.length === 0) {
      setErrorMsg("السلة فارغة، يرجى تحديد وجبة واحدة على الأقل");
      return;
    }

    setSubmitting(true);

    try {
      const mappedPaymentMethod =
        paymentMode === "instapay" ? "instapay" : "cash";

      const snapshotItems = cart.map((item) => ({
        productId: item._id,
        name: item.name,
        size: item.selectedSize || "",
        quantity: item.cartQuantity,
        price: Number(item.price || 0),
        image: item.image,
      }));

      const currentNotes = notes.trim();

      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType: "cashier",
          notes: currentNotes,
          customerName: "عميل كاشير",
          paymentMethod: mappedPaymentMethod,
          paymentReceipt:
            paymentMode === "card"
              ? "دفع بطاقة / فيزا للكاشير"
              : paymentMode === "instapay"
                ? "تحويل فوري للكاشير"
                : "نقدي للكاشير",
          items: snapshotItems,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "تعذر تسجيل الطلب");
      }

      const receiptData: PrintedOrderSnapshot = {
        orderNumber: data.orderNumber || "فوري",
        createdAt: new Date().toLocaleString("ar-EG"),
        paymentMethod: paymentMode,
        items: snapshotItems,
        totalPrice,
      };

      setLastReceipt(receiptData);
      setSuccessMsg(
        `تم تسجيل الطلب #${receiptData.orderNumber} وإرساله للمطبخ`
      );
      clearCart();
      setNotes("");

      setTimeout(() => {
        window.print();
      }, 150);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "حدث خطأ أثناء الاتصال بالسيرفر"
      );
    } finally {
      setSubmitting(false);
    }
  };

 return (
    <>
      <CashierOrderWatcher />

      <div className="print:hidden" dir="rtl">
        <CashierCategoryBar
          currentCategory={currentCategory}
          onSelectCategory={handleCategoryTabClick}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 w-full">
            {loadingProducts ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 text-slate-400 text-sm font-bold">
                جاري تحميل قائمة الوجبات...
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 text-slate-400 text-sm font-bold">
                لا توجد وجبات في هذا القسم حالياً.
              </div>
            ) : (
              <div className="space-y-8">
                {categoriesWithProducts.map((group) => (
                  <section key={group.name}>
                    <h3 className="mb-3 border-r-4 border-[#D55304] pr-3 text-base font-extrabold text-slate-800">
                      {group.name}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 w-full">
                      {group.products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>

          <div className="sticky top-20 lg:col-span-5 w-full">
            <CashierCartPanel
              notes={notes}
              setNotes={setNotes}
              paymentMode={paymentMode}
              setPaymentMode={setPaymentMode}
              submitting={submitting}
              errorMsg={errorMsg}
              successMsg={successMsg}
              onPrintAndSubmit={handlePrintAndSubmit}
              onResetCart={() => {
                clearCart();
                setNotes("");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
            />
          </div>
        </div>
      </div>

      <CashierThermalReceipt receipt={lastReceipt} />
    </>
  );
}

export default function CashierPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm font-bold">
          جاري تحميل شاشة الكاشير...
        </div>
      }
    >
      <CashierContent />
    </Suspense>
  );
}