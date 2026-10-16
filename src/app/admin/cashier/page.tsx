/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/src/components/product/ProductCard";
import { useCart, getCartItemKey } from "@/src/context/CartContext";
import { Product } from "@/src/types";
import {
  Receipt,
  Printer,
  RotateCcw,
  Trash2,
  Banknote,
  CreditCard,
  Wallet,
  Flame,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
  FileText,
} from "lucide-react";

const CATEGORY_ORDER = [
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

interface PrintedOrderSnapshot {
  orderNumber: number | string;
  createdAt: string;
  paymentMethod: "cash" | "card" | "instapay";
  items: {
    name: string;
    size?: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
}

function CashierContent() {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotalPrice } =
    useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategory = searchParams.get("category")?.trim() || null;

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [paymentMode, setPaymentMode] = useState<"cash" | "card" | "instapay">(
    "cash",
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  // بيانات آخر إيصال للطباعة الحرارية 80mm
  const [lastReceipt, setLastReceipt] = useState<PrintedOrderSnapshot | null>(
    null,
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
      ...CATEGORY_ORDER,
      ...displayedProducts.map((p) => p.category?.trim()),
    ]),
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

      // فتح الطباعة الحرارية بعد تحديث DOM البون مباشرة
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
      {/* شاشة الكاشير التفاعلية (تختفي أثناء الطباعة ليظهر البون الحراري فقط) */}
      <div className="min-h-screen bg-slate-50 print:hidden" dir="rtl">
        <main className="container mx-auto px-4 py-4">
          {/* شريط أزرار الأقسام السريع للكاشير كما في الصورة */}
          <div className="mb-5 flex  bg-white items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              type="button"
              onClick={() => handleCategoryTabClick(null)}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
                !currentCategory
                  ? "bg-[#D55304] text-white border-[#D55304] shadow-sm"
                  : "bg-white text-slate-700 border-slate-200/80 hover:border-[#D55304]/40"
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>كل المنيو</span>
            </button>

            {CATEGORY_ORDER.map((cat) => {
              const active = currentCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryTabClick(cat)}
                  className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shrink-0 transition-all cursor-pointer border ${
                    active
                      ? "bg-[#D55304] text-white border-[#D55304] shadow-sm"
                      : "bg-white text-slate-700 border-slate-200/80 hover:border-[#D55304]/40"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* يمين الشاشة: شبكة الوجبات */}
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

            {/* يسار الشاشة: ملخص الطلب والحساب للكاشير (بدون أي حقول إدخال) */}
            <div className="sticky top-20 lg:col-span-5 w-full">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 space-y-5">
                {/* رأس البطاقة */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Receipt className="w-5 h-5 text-[#D55304]" />
                    <h3 className="text-base sm:text-lg font-extrabold">
                      ملخص الطلب والحساب
                    </h3>
                  </div>
                  <span className="text-[11px] font-extrabold bg-orange-50 text-[#D55304] px-2.5 py-1 rounded-full">
                    نقطة بيع الكاشير
                  </span>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* قائمة الأصناف المختارة */}
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1 custom-scrollbar">
                  {cart.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 space-y-2">
                      <ShoppingCart className="w-7 h-7 mx-auto text-slate-300" />
                      <p className="text-xs font-medium">
                        لم يتم تحديد أي وجبة بعد.
                      </p>
                    </div>
                  ) : (
                    cart.map((item) => {
                      const itemKey =
                        item.cartItemId ||
                        getCartItemKey(item._id, item.selectedSize);
                      const price = Number(item.price || 0);

                      return (
                        <div
                          key={itemKey}
                          className="py-3 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://placehold.co/80x80/fff7ed/D55304?text=?";
                              }}
                            />
                            <div className="min-w-0 flex-1 text-right">
                              <p className="font-extrabold text-slate-800 text-xs sm:text-sm truncate">
                                {item.name}
                              </p>
                              {item.selectedSize && (
                                <span className="text-[11px] text-slate-500 font-bold">
                                  ({item.selectedSize})
                                </span>
                              )}
                            </div>
                          </div>

                          {/* الكمية والسعر وحذف الصنف */}
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-0.5">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item._id,
                                    item.cartQuantity + 1,
                                    item.selectedSize,
                                  )
                                }
                                className="w-5 h-5 rounded bg-[#D55304] text-white text-xs font-bold flex items-center justify-center cursor-pointer"
                              >
                                +
                              </button>
                              <span className="px-1.5 text-xs font-extrabold text-[#D55304]">
                                {item.cartQuantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item._id,
                                    item.cartQuantity - 1,
                                    item.selectedSize,
                                  )
                                }
                                className="w-5 h-5 rounded bg-white border border-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center cursor-pointer"
                              >
                                -
                              </button>
                            </div>

                            <span className="font-extrabold text-slate-900 text-xs sm:text-sm min-w-[70px] text-left">
                              {(price * item.cartQuantity).toFixed(2)} ج.م
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(item._id, item.selectedSize)
                              }
                              className="text-rose-500 hover:text-rose-700 p-1 transition cursor-pointer"
                              title="حذف الصنف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* تفاصيل الحساب */}
                <div className="bg-slate-50/90 rounded-2xl p-4 space-y-3 border border-slate-100 text-xs sm:text-sm">
                  {/* حقل الملاحظات الإضافية */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 font-bold text-slate-700 text-xs sm:text-sm">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span>ملاحظات إضافية (اختياري)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="مثال: بدون بصل، صوص إضافي ..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#D55304] focus:ring-2 focus:ring-[#D55304]/15 transition-all resize-none text-right"
                    />
                  </div>

                  {/* الإجمالي النهائي */}
                  <div className="bg-orange-50/90 border border-[#D55304]/20 rounded-xl p-3 flex justify-between items-center">
                    <span className="font-extrabold text-[#D55304] text-sm sm:text-base flex items-center gap-1.5">
                      <Wallet className="w-4 h-4" />
                      <span>الإجمالي النهائي:</span>
                    </span>
                    <span className="text-xl font-black text-[#D55304]">
                      {totalPrice.toFixed(2)} ج.م
                    </span>
                  </div>
                </div>

                {/* اختيار طريقة الدفع للكاشير */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700">
                    <CreditCard className="w-4 h-4 text-[#D55304]" />
                    <span>طريقة الدفع</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMode("cash")}
                      className={`py-2.5 px-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                        paymentMode === "cash"
                          ? "bg-[#D55304] text-white border-[#D55304] shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      <span>كاش</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMode("card")}
                      className={`py-2.5 px-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                        paymentMode === "card"
                          ? "bg-[#D55304] text-white border-[#D55304] shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>فيزا / بطاقة</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMode("instapay")}
                      className={`py-2.5 px-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                        paymentMode === "instapay"
                          ? "bg-[#D55304] text-white border-[#D55304] shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <Wallet className="w-4 h-4" />
                      <span>إنستاباي / محفظة</span>
                    </button>
                  </div>
                </div>

                {/* أزرار الإجراءات: طباعة الإيصال + مسح السلة */}
                <div className="space-y-2.5 pt-1">
                  <button
                    type="button"
                    disabled={submitting || cart.length === 0}
                    onClick={handlePrintAndSubmit}
                    className="w-full bg-[#D55304] hover:bg-[#b84403] disabled:opacity-50 text-white font-black py-4 rounded-xl shadow-md shadow-[#D55304]/25 flex items-center justify-center gap-2 text-base transition-all active:scale-[0.99] cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري الحفظ والطباعة...</span>
                      </>
                    ) : (
                      <>
                        <Printer className="w-5 h-5" />
                        <span>طباعة الإيصال</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      clearCart();
                      setErrorMsg(null);
                      setSuccessMsg(null);
                      setNotes("");
                    }}
                    className="w-full bg-white hover:bg-orange-50 text-[#D55304] border border-[#D55304]/40 font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>طلب جديد / مسح السلة</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* قالب إيصال الطابعة الحرارية (80mm) - يظهر فقط عند الضغط على طباعة الإيصال */}
      {/* قالب إيصال الطابعة الحرارية (86mm) بارتفاع ديناميكي وبدون Footer */}
      {lastReceipt && (
        <>
          <style jsx global>{`
            @media print {
              @page {
                size: 86mm auto;
                margin: 0mm !important; /* إبقاء هامش المتصفح 0 لمنع ظهور الرابط والتاريخ */
              }
              html,
              body {
                width: 86mm !important;
                height: auto !important;
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
              }
            }
          `}</style>

          {/* 1. تم إضافة p-[10mm] و box-border لترك مسافة 10mm من جميع الجوانب الأربعة */}
          <div
            className="hidden print:block w-[86mm] max-w-[86mm] mx-auto p-[10mm] box-border text-black bg-white font-sans text-xs"
            dir="rtl"
          >
            {/* ترويسة الإيصال: النص في أعلى اليمين واللوجو في أعلى اليسار */}
            <div className="flex items-start justify-between border-b border-dashed border-black pb-2 mb-2">
              {/* يمين: النصوص */}
              <div className="text-right">
                <h2 className="text-base font-black leading-tight">مطعم السرايا</h2>
                <p className="text-[11px]">أشهى المأكولات والمشويات</p>
                <p className="text-[11px] font-bold mt-1">
                  فاتورة كاشير #{lastReceipt.orderNumber}
                </p>
                <p className="text-[10px]">{lastReceipt.createdAt}</p>
              </div>

              {/* 2. يسار: اللوجو بحواف rounded-lg وأبيض وأسود (grayscale) */}
              <img
                src="/logo.png"
                alt="مطعم السرايا"
                className="w-12 h-12 object-contain shrink-0 rounded-lg grayscale contrast-150"
              />
            </div>

            <table className="w-full text-right border-b border-dashed border-black pb-2 mb-2 text-[11px]">
              <thead>
                <tr className="border-b border-black">
                  <th className="py-1">الصنف</th>
                  <th className="py-1 text-center">الكمية</th>
                  <th className="py-1 text-left">الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {lastReceipt.items.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-dotted border-gray-400"
                  >
                    <td className="py-1 font-bold">
                      {item.name} {item.size ? `(${item.size})` : ""}
                    </td>
                    <td className="py-1 text-center">{item.quantity}</td>
                    <td className="py-1 text-left font-bold">
                      {(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="space-y-1 text-xs font-bold pb-1">
              <div className="flex justify-between text-sm font-black">
                <span>الإجمالي المطلوب:</span>
                <span>{lastReceipt.totalPrice.toFixed(2)} ج.م</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>طريقة الدفع:</span>
                <span>
                  {lastReceipt.paymentMethod === "cash"
                    ? "كاش (مدفوع)"
                    : lastReceipt.paymentMethod === "card"
                      ? "فيزا / بطاقة (مدفوع)"
                      : "إنستاباي / محفظة (مدفوع)"}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
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
