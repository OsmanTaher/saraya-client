"use client";

/* Product images are external URLs and use a native fallback on load errors. */
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useCart } from "@/src/context/CartContext";
import { Receipt, X } from "lucide-react";
import CartItemList from "./CartItemList";
import OrderPricingSummary from "./OrderPricingSummary";
import CustomerInfoForm from "./CustomerInfoForm";
import OrderSuccessCard from "./OrderSuccessCard";

const DELIVERY_FEE = 10;

export default function CheckoutForm() {
  const { cart, clearCart, totalPrice } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isPickup, setIsPickup] = useState(false);

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

  const deliveryFee = isPickup ? 0 : DELIVERY_FEE;
  const finalTotal = totalPrice > 0 ? totalPrice + deliveryFee : 0;

  const generateOrderNumber = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const resetFormFields = () => {
    clearCart();
    setName("");
    setPhone("");
    setAddress("");
    setNotes("");
    setIsPickup(false);
  };

  const handleNewOrder = () => {
    setSuccessOrderNumber(null);
    resetFormFields();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (cart.length === 0) {
      setError("الرجاء اختيار منتج واحد على الأقل قبل إرسال الطلب");
      return;
    }

    const phoneRegex = /^01(0|1|2|5)[0-9]{8}$/;
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

    setLoading(true);
    const orderNumber = generateOrderNumber();

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          customerName: name.trim(),
          phoneNumber: phone.trim(),
          address: isPickup ? "الاستلام من الجمعية" : address.trim(),
          notes: notes.trim(),
          deliveryFee,
          pickupFromAssociation: isPickup,
          totalAmount: finalTotal,
          items: cart.map((item) => ({
            productId: item._id,
            name: item.name,
            quantity: item.cartQuantity,
            unitPrice: item.price,
            totalPrice: item.price * item.cartQuantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "تعذر إرسال الطلب");

      setSubmittedPhone(phone.trim());
      setSuccessOrderNumber(orderNumber);

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
        className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sticky top-24 space-y-6 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto custom-scrollbar"
      >
        <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
          <Receipt className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold">ملخص الطلب والحساب</h3>
        </div>

        <CartItemList onZoomImage={setZoomedImage} />

        <OrderPricingSummary
          totalPrice={totalPrice}
          deliveryFee={deliveryFee}
          isPickup={isPickup}
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
          loading={loading}
          error={error}
          isCartEmpty={cart.length === 0}
          onSubmit={handleSubmit}
        />
      </div>

      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-xl rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute left-0 z-10 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full p-2 transition-colors"
              onClick={() => setZoomedImage(null)}
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={zoomedImage.src}
              alt={zoomedImage.name}
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
