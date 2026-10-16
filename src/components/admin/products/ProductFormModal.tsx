"use client";

import { Product } from "@/src/types";
import ProductForm from "./ProductForm";
import { X } from "lucide-react";

interface ProductFormModalProps {
  isOpen: boolean;
  editingProduct: Product | null;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (payload: Record<string, any>) => Promise<void>;
}

export default function ProductFormModal({
  isOpen,
  editingProduct,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div className="text-right">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {editingProduct ? "تعديل بيانات الوجبة" : "إضافة وجبة جديدة"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              {editingProduct
                ? "تعديل تفاصيل وأحجام وأسعار الوجبة في المنيو"
                : "إضافة صنف جديد لقائمة طعام مطعم السرايا"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ProductForm
          initialData={editingProduct}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}