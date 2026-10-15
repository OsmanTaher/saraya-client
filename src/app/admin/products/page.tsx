"use client";

import { useState, useEffect, useMemo } from "react";
import ProductsHeader from "@/src/components/admin/products/ProductsHeader";
import ProductsTable, {
  AdminProduct,
} from "@/src/components/admin/products/ProductsTable";
import ProductFormModal from "@/src/components/admin/products/ProductFormModal";
import { getCookie } from "@/src/lib/cookies";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(
    null,
  );
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchProducts = async () => {
    try {
      const token = getCookie("toshka_admin_token");
      const res = await fetch(`${apiUrl}/products/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const token = getCookie("toshka_admin_token");
      const res = await fetch(`${apiUrl}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, isActive: !currentStatus } : p,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to toggle active status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    try {
      const token = getCookie("toshka_admin_token");
      const res = await fetch(`${apiUrl}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;
    return products.filter((p) => p.name.toLowerCase().includes(query));
  }, [products, searchQuery]);

  return (
    <div className="space-y-6">
      <ProductsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreate={() => {
          setEditingProduct(null);
          setIsModalOpen(true);
        }}
      />

      <ProductsTable
        products={filteredProducts}
        loading={loading}
        onToggleActive={handleToggleActive}
        onEdit={(prod) => {
          setEditingProduct(prod);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <ProductFormModal
        isOpen={isModalOpen}
        productToEdit={editingProduct}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchProducts();
        }}
      />
    </div>
  );
}
