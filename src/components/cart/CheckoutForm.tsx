"use client";

 

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/src/context/CartContext";
import { Receipt, X } from "lucide-react";
import CartItemList from "./CartItemList";
import OrderPricingSummary from "./OrderPricingSummary";
import CustomerInfoForm from "./CustomerInfoForm";
import OrderSuccessCard from "./OrderSuccessCard";

const DELIVERY_FEE = 15;

function CheckoutFormContent() {
  const { cart, clearCart, subtotalPrice } = useCart();
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get("table")?.trim() || null;
  const isDineIn = Boolean(tableNumber);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isPickup, setIsPickup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "instapay" | "vodafone_cash"
  >("instapay");
  const [transferNumber, setTransferNumber] = useState("");

  const [zoomedImage, setZoomedImage] = useState<{
    src: string;
    name: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrderNumber, setSuccessOrderNumber] = useState<string | null>(
    null,
  );
  const [submittedPhone, setSubmittedPhone] = useState("");

  const totalPrice = Number(subtotalPrice || 0);
  const deliveryFee = isDineIn || isPickup ? 0 : DELIVERY_FEE;
  const finalTotal = totalPrice + deliveryFee;

  const [isStoreOpen, setIsStoreOpen] = useState(true);

  useEffect(() => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    fetch(`${apiUrl}/admin/store-status`)
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.isStoreOpen === "boolean") {
          setIsStoreOpen(d.isStoreOpen);
        }
      })
      .catch(() => {});
  }, []);

  const resetFormFields = () => {
    clearCart();
    setName("");
    setPhone("");
    setAddress("");
    setNotes("");
    setIsPickup(false);
    setPaymentMethod("instapay");
    setTransferNumber("");
  };

  const handleNewOrder = () => {
    setSuccessOrderNumber(null);
    resetFormFields();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (cart.length === 0) {
      setError("الرجاء اختيار وجبة واحدة على الأقل قبل إرسال الطلب");
      return;
    }

    const phoneRegex = /^01(0|1|2|5)[0-9]{8}$/;

    if (!isDineIn) {
      if (!name.trim()) {
        setError("يرجى إدخال الاسم الكامل");
        return;
      }
      if (!phoneRegex.test(phone.trim())) {
        setError(
          "أدخل رقم هاتف صحيح مكون من 11 رقم ويبدأ بـ 010 أو 011 أو 012 أو 015",
        );
        return;
      }
      if (!isPickup && !address.trim()) {
        setError("يرجى إدخال عنوان التوصيل بالتفصيل");
        return;
      }
    } else if (phone.trim() && !phoneRegex.test(phone.trim())) {
      setError("رقم الهاتف المدخل غير صحيح، يجب أن يتكون من 11 رقماً");
      return;
    }

    if (!transferNumber.trim()) {
      setError("يرجى إدخال الرقم الذي حولت منه المبلغ لتأكيد الدفع");
      return;
    }

    setLoading(true);

    const orderType = isDineIn ? "dine_in" : isPickup ? "pickup" : "delivery";

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType,
          tableNumber: isDineIn ? tableNumber : "",
          customerName:
            name.trim() ||
            (isDineIn ? `عميل صالة - ترابيزة ${tableNumber}` : "عميل السرايا"),
          phone: phone.trim(),
          address: isDineIn
            ? `صالة المطعم - ترابيزة ${tableNumber}`
            : isPickup
              ? "الاستلام من الفرع"
              : address.trim(),
          notes: notes.trim(),
          paymentMethod,
          paymentReceipt: transferNumber.trim(),
          transferNumber: transferNumber.trim(),
          items: cart.map((item) => ({
            productId: item._id,
            name: item.name,
            size: item.selectedSize || "",
            quantity: item.cartQuantity,
            price: item.price,
            image: item.image,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "تعذر إرسال الطلب");

      setSubmittedPhone(
        phone.trim() ||
          (isDineIn ? `ترابيزة #${tableNumber}` : transferNumber.trim()),
      );
      setSuccessOrderNumber(String(data.orderNumber || data._id || ""));

      resetFormFields();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "حدث خطأ أثناء الاتصال بالسيرفر",
      );
    } finally {
      setLoading(false);
    }
  };

  if (successOrderNumber) {
    return (
      <OrderSuccessCard
        phoneNumber={submittedPhone}
        orderNumber={successOrderNumber}
        onReset={handleNewOrder}
      />
    );
  }

  return (
    <>
      <div
        id="order-summary"
        className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-6 sticky top-24 space-y-5 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto custom-scrollbar"
        dir="rtl"
      >
        <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
          <Receipt className="w-5 h-5 text-[#D55304]" />
          <h3 className="text-base sm:text-lg font-extrabold">
            ملخص الطلب والحساب
          </h3>
        </div>

        {!isStoreOpen && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-right space-y-1">
            <p className="text-xs sm:text-sm font-black text-rose-700">
              🔴 المطعم مغلق حالياً
            </p>
            <p className="text-xs text-rose-600 font-medium">
              عذراً، لا يمكن إرسال طلبات جديدة في وقت إغلاق المطعم. <br /> مواعيد العمل
              يومياً من 6:00 صباحا حتى 2:00 ظهراً.
            </p>
          </div>
        )}

        <CartItemList onZoomImage={setZoomedImage} />

        <OrderPricingSummary
          totalPrice={totalPrice}
          deliveryFee={deliveryFee}
          isPickup={isPickup}
          isDineIn={isDineIn}
          finalTotal={finalTotal}
        />

        <CustomerInfoForm
          name={name}
          setName={setName}
          phone={phone}
          setPhone={setPhone}
          address={address}
          setAddress={setAddress}
          notes={notes}
          setNotes={setNotes}
          isPickup={isPickup}
          setIsPickup={setIsPickup}
          tableNumber={tableNumber}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          transferNumber={transferNumber}
          setTransferNumber={setTransferNumber}
          loading={loading}
          error={error}
          isCartEmpty={cart.length === 0 || !isStoreOpen}
          onSubmit={handleSubmit}
        />
      </div>

      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-xl rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 left-3 z-10 bg-white/90 hover:bg-[#D55304] hover:text-white text-slate-800 rounded-full p-2 transition-colors cursor-pointer"
              onClick={() => setZoomedImage(null)}
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={zoomedImage.src}
              alt={zoomedImage.name}
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl bg-white"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default function CheckoutForm() {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center text-slate-400 text-xs">
          جاري تحميل السلة...
        </div>
      }
    >
      <CheckoutFormContent />
    </Suspense>
  );
}
