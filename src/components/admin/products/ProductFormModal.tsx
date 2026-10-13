"use client";

import { X } from "lucide-react";
import ProductForm from "@/src/components/admin/products/ProductForm";
import { AdminProduct } from "./ProductsTable";

interface ProductFormModalProps {
  isOpen: boolean;
  productToEdit: AdminProduct | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductFormModal({
  isOpen,
  productToEdit,
  onClose,
  onSuccess,
}: ProductFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <ProductForm productToEdit={productToEdit} onSuccess={onSuccess} />
      </div>
    </div>
  );
}
