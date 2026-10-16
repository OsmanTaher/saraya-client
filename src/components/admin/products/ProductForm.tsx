/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef } from "react";
import { Product } from "@/src/types";
import { CloudUpload, Check, Loader2, X, AlertCircle } from "lucide-react";

interface ProductFormProps {
  initialData?: Product | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (payload: Record<string, any>) => Promise<void>;
  onCancel: () => void;
}

const CATEGORIES = [
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

const AVAILABLE_SIZES = ["صغير", "وسط", "كبير"] as const;

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState(
    initialData?.category || "سندوتشات"
  );
  const [price, setPrice] = useState<string>(
    initialData?.price !== undefined ? String(initialData.price) : ""
  );
  const [oldPrice, setOldPrice] = useState<string>(
    initialData?.oldPrice ? String(initialData.oldPrice) : ""
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.image || ""
  );

  // إدارة الأحجام الثلاثة (صغير - وسط - كبير)
  const initSizeMap = () => {
    const map: Record<string, { enabled: boolean; price: string }> = {
      صغير: { enabled: false, price: "" },
      وسط: { enabled: false, price: "" },
      كبير: { enabled: false, price: "" },
    };
    if (initialData?.sizes && Array.isArray(initialData.sizes)) {
      for (const s of initialData.sizes) {
        if (map[s.name]) {
          map[s.name] = { enabled: true, price: String(s.price) };
        }
      }
    }
    return map;
  };

  const [sizesState, setSizesState] = useState(initSizeMap);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ضغط وتحويل الصورة المختارة إلى Base64 لرفعها إلى Cloudinary عبر السيرفر
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("يرجى اختيار ملف صورة صالح");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 900;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL("image/jpeg", 0.85);
        setImagePreview(base64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const toggleSize = (sizeName: string) => {
    setSizesState((prev) => ({
      ...prev,
      [sizeName]: {
        ...prev[sizeName],
        enabled: !prev[sizeName].enabled,
      },
    }));
  };

  const updateSizePrice = (sizeName: string, val: string) => {
    setSizesState((prev) => ({
      ...prev,
      [sizeName]: {
        ...prev[sizeName],
        enabled: true,
        price: val,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("يرجى إدخال اسم الوجبة");
      return;
    }

    const activeSizes = AVAILABLE_SIZES.filter(
      (sz) => sizesState[sz].enabled && sizesState[sz].price.trim() !== ""
    ).map((sz) => ({
      name: sz,
      price: Number(sizesState[sz].price),
    }));

    const basePrice =
      price.trim() !== ""
        ? Number(price)
        : activeSizes.length > 0
        ? activeSizes[0].price
        : NaN;

    if (isNaN(basePrice) || basePrice < 0) {
      setError("يرجى إدخال السعر الحالي للوجبة");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        category,
        price: basePrice,
        oldPrice: oldPrice.trim() !== "" ? Number(oldPrice) : null,
        description: description.trim(),
        image: imagePreview,
        sizes: activeSizes,
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "حدث خطأ أثناء حفظ الوجبة"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. صندوق سحب وإفلات ورفع صورة الوجبة إلى Cloudinary */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleFileSelect(file);
          }}
          className="border-2 border-dashed border-slate-200 hover:border-[#D55304] bg-slate-50/40 hover:bg-orange-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all relative"
        >
          {imagePreview ? (
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="معاينة الوجبة"
                  className="h-32 w-48 object-cover rounded-2xl border border-slate-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview("");
                  }}
                  className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs font-bold text-[#D55304]">
                اضغط لتغيير صورة الوجبة (تُرفع تلقائياً إلى Cloudinary)
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <div className="w-14 h-14 rounded-full bg-orange-50 text-[#D55304] flex items-center justify-center">
                <CloudUpload className="w-7 h-7" />
              </div>
              <p className="text-sm font-black text-slate-800">
                اسحب وأفلت صورة الوجبة هنا
              </p>
              <p className="text-xs text-slate-400 font-medium">
                أو اضغط لاختيار ملف من جهازك
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. اسم الوجبة + القسم */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
            اسم الوجبة <span className="text-[#D55304]">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="سندوتش كفتة مشوية"
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#D55304] transition"
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
            القسم <span className="text-[#D55304]">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-[#D55304] transition cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. السعر الحالي + السعر القديم */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
            السعر الحالي (ج.م) <span className="text-[#D55304]">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              step="1"
              min={0}
              max={999}
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="65"
              className="w-full pr-4 pl-12 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-[#D55304] transition"
            />
            <span className="absolute left-3 text-slate-500 text-xs font-bold">
              ج.م
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-slate-500 mb-1.5">
            السعر القديم (اختياري)
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              step="1"
              min={0}
              max={999}
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
              placeholder="80"
              className="w-full pr-4 pl-12 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-[#D55304] transition"
            />
            <span className="absolute left-3 text-slate-500 text-xs font-bold">
              ج.م
            </span>
          </div>
        </div>
      </div>

      {/* 4. صندوق أحجام الوجبة (صغير - وسط - كبير) مطابق للصورة */}
      <div className="bg-[#FFF7ED]/70 border border-orange-100 rounded-2xl p-4 space-y-3">
        <label className="block text-xs font-extrabold text-slate-800">
          أحجام الوجبة (اختياري)
        </label>

        <div className="grid grid-cols-3 gap-3">
          {AVAILABLE_SIZES.map((sz) => {
            const active = sizesState[sz].enabled;
            return (
              <div key={sz} className="space-y-2">
                <button
                  type="button"
                  onClick={() => toggleSize(sz)}
                  className={`w-full py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    active
                      ? "bg-[#D55304] text-white border-[#D55304] shadow-xs"
                      : "bg-white text-[#D55304] border-[#D55304]/40 hover:bg-orange-50"
                  }`}
                >
                  {active ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-[#D55304]" />
                  )}
                  <span>{sz}</span>
                </button>

                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="1"
                    min={0}
                    max={999}
                    value={sizesState[sz].price}
                    onChange={(e) => updateSizePrice(sz, e.target.value)}
                    placeholder={
                      sz === "صغير" ? "50" : sz === "وسط" ? "75" : "90"
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-[#D55304]"
                  />
                  <span className="absolute left-1.5 bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    ج.م
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. وصف الوجبة والمكونات */}
      <div>
        <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
          وصف الوجبة والمكونات{" "}
          <span className="text-slate-400 font-normal">(اختياري)</span>
        </label>
        <div className="relative">
          <textarea
            rows={3}
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="مثال: كفتة مشوية على الفحم مع الطحينة والخضار الطازجة..."
            className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#D55304] resize-none"
          />
          <span className="absolute bottom-2.5 left-3 text-[11px] font-mono text-slate-400">
            {description.length}/500
          </span>
        </div>
      </div>

      {/* 6. زر الإرسال */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#D55304] hover:bg-[#b84403] disabled:opacity-60 text-white font-black py-3.5 rounded-xl shadow-md shadow-[#D55304]/25 flex items-center justify-center gap-2 text-sm sm:text-base transition-all cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>جاري رفع الصورة وحفظ الوجبة...</span>
          </>
        ) : (
          <span>
            {initialData ? "حفظ تعديلات الوجبة" : "إضافة الوجبة لقائمة الطعام"}
          </span>
        )}
      </button>
    </form>
  );
}