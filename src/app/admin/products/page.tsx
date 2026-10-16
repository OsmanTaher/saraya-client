"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Product } from "@/src/types";
import { getAdminToken } from "@/src/lib/cookies";
import { CATEGORY_TABS } from "@/src/constants/categories";
import ProductsHeader from "@/src/components/admin/products/ProductsHeader";
import ProductsTable from "@/src/components/admin/products/ProductsTable";
import ProductFormModal from "@/src/components/admin/products/ProductFormModal";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import { Search, Loader2 } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/products?all=true`);
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const handleSaveProduct = async (payload: Record<string, unknown>) => {
    const token = getAdminToken();
    const isEditing = Boolean(editingProduct);
    const url = isEditing
      ? `${apiUrl}/products/${editingProduct!._id}`
      : `${apiUrl}/products`;
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "تعذر حفظ الوجبة");
    }

    if (isEditing) {
      setProducts((prev) =>
        prev.map((p) => (p._id === editingProduct!._id ? data : p)),
      );
      toast.success("تم تعديل الوجبة بنجاح");
    } else {
      setProducts((prev) => [data, ...prev]);
      toast.success("تمت إضافة الوجبة الجديدة للمنيو");
    }

    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleToggleAvailability = async (product: Product) => {
    setTogglingId(product._id);
    try {
      const token = getAdminToken();
      const newStatus = product.isActive === false ? true : false;

      const res = await fetch(`${apiUrl}/products/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? updated : p)),
        );
      }
    } catch (err) {
      console.error("Failed to toggle availability:", err);
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!deletingProductId) return;
    setIsDeleting(true);

    try {
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/products/${deletingProductId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== deletingProductId));
        toast.success("تم حذف الوجبة نهائياً من المنيو");
        setDeletingProductId(null);
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
      toast.error("حدث خطأ أثناء حذف الوجبة");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "all"
          ? true
          : (product.category || "").trim() === activeCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      return (
        product.name.toLowerCase().includes(q) ||
        (product.description || "").toLowerCase().includes(q) ||
        (product.category || "").toLowerCase().includes(q)
      );
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <div className="space-y-6" dir="rtl">
      <ProductsHeader
        onAddClick={() => {
          setEditingProduct(null);
          setModalOpen(true);
        }}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold border transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#D55304] text-white border-[#D55304] shadow-xs"
                    : "bg-white text-slate-700 border-slate-200/90 hover:border-[#D55304]/40"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72 shrink-0">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن وجبة أو صنف..."
            className="w-full bg-white border border-slate-200/90 rounded-2xl py-2.5 pr-10 pl-4 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#D55304] transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="w-7 h-7 animate-spin text-[#D55304]" />
          <span className="text-sm font-bold">جاري تحميل قائمة الطعام...</span>
        </div>
      ) : (
        <ProductsTable
          products={filteredProducts}
          onEdit={(product) => {
            setEditingProduct(product);
            setModalOpen(true);
          }}
          onDelete={(productId) => setDeletingProductId(productId)}
          onToggleAvailability={handleToggleAvailability}
          togglingId={togglingId}
        />
      )}

      <ProductFormModal
        isOpen={modalOpen}
        editingProduct={editingProduct}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSaveProduct}
      />

      <ConfirmModal
        isOpen={Boolean(deletingProductId)}
        title="حذف الوجبة من المنيو"
        message="هل أنت متأكد من حذف هذه الوجبة نهائياً من قائمة طعام مطعم السرايا؟"
        confirmText="نعم، احذف الوجبة"
        cancelText="إلغاء"
        variant="danger"
        loading={isDeleting}
        onConfirm={confirmDeleteProduct}
        onCancel={() => setDeletingProductId(null)}
      />
    </div>
  );
}
