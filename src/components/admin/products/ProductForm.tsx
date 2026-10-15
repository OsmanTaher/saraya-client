"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useRef } from "react";
import { UploadCloud, Loader2, AlertCircle } from "lucide-react";
import { getCookie } from "@/src/lib/cookies";

interface Product {
  _id?: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  description?: string;
  maxQty?: number | null;
  image: string;
  isActive?: boolean;
}

interface ProductFormProps {
  productToEdit?: Product | null;
  onSuccess: () => void;
}

const CATEGORIES = [
  "أدوات الرسم",
  "أقلام و أدوات مكتبية",
  "كشاكيل و كراسات",
  "لانشبوك و زمزمية",
  "مقالم و شنط",
];

export default function ProductForm({
  productToEdit,
  onSuccess,
}: ProductFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState<number | "">("");
  const [oldPrice, setOldPrice] = useState<number | "">("");
  const [maxQty, setMaxQty] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Initializes or resets form inputs when switching between Add and Edit modes.
   */
  useEffect(() => {
    if (productToEdit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(productToEdit.name || "");
      setCategory(productToEdit.category || CATEGORIES[0]);
      setPrice(productToEdit.price || "");
      setOldPrice(productToEdit.oldPrice || "");
      setMaxQty(productToEdit.maxQty ?? "");
      setDescription(productToEdit.description || "");
      setImagePreview(productToEdit.image || "");
      setImageFile(null);
    } else {
      setName("");
      setCategory(CATEGORIES[0]);
      setPrice("");
      setOldPrice("");
      setMaxQty("");
      setDescription("");
      setImagePreview("");
      setImageFile(null);
    }
  }, [productToEdit]);

  /**
   * Handles local image selection and updates the temporary preview URL.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  /**
   * Handles drag-and-drop file assignment for the product image.
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  /**
   * Uploads the selected image file to Cloudinary under a category-specific folder.
   */
  const uploadToCloudinary = async (
    file: File,
    selectedCategory: string,
  ): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset =
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "toshka_products";

    if (!cloudName) {
      throw new Error(
        "Cloudinary cloud name is not configured in environment variables",
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", `toshka/${selectedCategory}`);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        data.error?.message || "Failed to upload image to Cloudinary",
      );
    }

    return data.secure_url;
  };

  /**
   * Validates input values and submits product data to the Express backend.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("يرجى إدخال اسم المنتج");
      return;
    }

    if (price === "" || Number(price) <= 0) {
      setError("يرجى إدخال سعر صحيح للمنتج");
      return;
    }

    if (maxQty !== "" && Number(maxQty) <= 0) {
      setError("يرجى إدخال كمية صحيحة أو ترك الحقل فارغاً لكونها غير محدودة");
      return;
    }

    if (!imagePreview && !imageFile) {
      setError("يرجى اختيار صورة للمنتج");
      return;
    }

    setLoading(true);

    try {
      let finalImageUrl = imagePreview;

      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile, category);
      }

      const payload = {
        name: name.trim(),
        category,
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : undefined,
        maxQty: maxQty === "" ? null : Number(maxQty),
        description: description.trim(),
        image: finalImageUrl,
      };

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const url = productToEdit
        ? `${apiUrl}/products/${productToEdit._id}`
        : `${apiUrl}/products`;
      const method = productToEdit ? "PUT" : "POST";
      const token = getCookie("toshka_admin_token");

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        const errorMessage =
          typeof result.error === "string"
            ? result.error
            : result.error?.message || result.message;
        throw new Error(errorMessage || "تعذر حفظ بيانات المنتج");
      }

      onSuccess();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "حدث خطأ أثناء معالجة الطلب",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-right" dir="rtl">
      <div>
        <h2 className="text-lg font-black text-slate-900">
          {productToEdit ? "تعديل بيانات المنتج" : "إضافة منتج جديد"}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {productToEdit
            ? "تحديث الأسعار وتفاصيل الصنف"
            : "إضافة صنف جديد لقائمة بضائع المتجر"}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 font-bold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          صورة المنتج *
        </label>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-4 text-center cursor-pointer bg-slate-50 hover:bg-indigo-50/40 transition-colors flex flex-col items-center justify-center min-h-35"
        >
          {imagePreview ? (
            <div className="relative w-28 h-28 rounded-xl overflow-hidden shadow-sm border border-slate-200">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-600">
                اسحب وأفلت الصورة هنا
              </span>
              <span className="text-[10px] text-slate-400">
                أو اضغط لاختيار ملف من جهازك
              </span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            اسم المنتج *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: كشكول سلك 80 ورقة"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            القسم *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-indigo-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            السعر الحالي (ج.م) *
          </label>
          <input
            type="number"
            required
            min={0}
            step="0.5"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="مثال: 20"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-indigo-500 font-mono text-left dir-ltr"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            السعر القديم (اختياري)
          </label>
          <input
            type="number"
            min={0}
            step="0.5"
            value={oldPrice}
            onChange={(e) =>
              setOldPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="يترك فارغاً إذا لم يوجد تخفيض"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-indigo-500 font-mono text-left dir-ltr"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            الكمية القصوى (اختياري)
          </label>
          <input
            type="number"
            min={1}
            step={1}
            value={maxQty}
            onChange={(e) =>
              setMaxQty(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="فارغ = غير محدود"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-indigo-500 font-mono text-left dir-ltr"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          وصف المنتج (اختياري)
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="تفاصيل المقاس، خامة الورق، أو عدد القطع..."
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-indigo-500 resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>جاري حفظ المنتج ورفع الصورة...</span>
          </>
        ) : (
          <span>
            {productToEdit ? "تحديث بيانات المنتج" : "إضافة المنتج للمتجر"}
          </span>
        )}
      </button>
    </form>
  );
}
