"use client";

 

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Product } from "@/src/types";

function normalizeSearchText(value: string) {
  return value
    .toLocaleLowerCase("ar")
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .trim();
}

interface SearchBarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SearchBar({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}: SearchBarProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;

  const handleClose = useCallback(() => {
    if (isControlled) {
      externalOnClose?.();
    } else {
      setInternalIsOpen(false);
    }
    setQuery("");
  }, [isControlled, externalOnClose]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/products`);
        if (res.ok) {
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : data.products || []);
        }
      } catch (err) {
        console.error("Failed to load products in SearchBar:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  const filteredProducts = query.trim()
    ? products
        .filter((item) =>
          normalizeSearchText(item.name).includes(normalizeSearchText(query)),
        )
        .slice(0, 6)
    : [];

  const handleSelectProduct = (product: Product) => {
    handleClose();

    const targetElement = document.getElementById(`product-${product._id}`);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });

      targetElement.classList.add("ring-4", "ring-orange-500", "ring-offset-2");
      setTimeout(() => {
        targetElement.classList.remove(
          "ring-4",
          "ring-orange-500",
          "ring-offset-2",
        );
      }, 2000);
    }
  };

  
  const searchDropdown = isOpen && (
    <div className="absolute top-14 left-0 z-50 w-72 sm:w-84 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 text-slate-800 animate-in fade-in zoom-in duration-150">
      <div className="relative flex items-center border-2 border-orange-500/80 rounded-2xl px-3 py-2 bg-white">
        <Search size={18} className="text-orange-600 shrink-0 ml-2" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="w-full text-right text-sm text-slate-800 outline-none bg-transparent"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {filteredProducts.length > 0 && (
        <div className="mt-3 space-y-1 divide-y divide-slate-100 max-h-64 overflow-y-auto">
          {filteredProducts.map((product) => (
            <button
              key={product._id}
              type="button"
              onClick={() => handleSelectProduct(product)}
              className="w-full text-right flex items-center gap-3 p-2 rounded-xl hover:bg-orange-50/70 transition-colors group"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200/60"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/80x80/e2e8f0/475569?text=صورة";
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-800 group-hover:text-orange-600 truncate transition-colors">
                  {product.name}
                </p>
                <span className="text-[10px] text-slate-400 block">
                  {product.price.toFixed(2)} ج.م
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {query && filteredProducts.length === 0 && (
        <p className="text-center text-xs text-slate-400 py-4">
          لا توجد منتجات مطابقة لهذا البحث
        </p>
      )}
    </div>
  );

  
  if (isControlled) {
    if (!isOpen) return null;

    return (
      <div
        className="fixed top-0 inset-x-0 z-50 pointer-events-none print:hidden"
        dir="rtl"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-end">
          
          <div
            ref={wrapperRef}
            className="relative ml-12 w-10 h-10 pointer-events-auto"
          >
            {searchDropdown}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setInternalIsOpen((prev) => !prev);
          setQuery("");
        }}
        className={`p-2.5 rounded-xl transition ${
          isOpen ? "bg-white/30" : "bg-white/20 hover:bg-white/30"
        }`}
        aria-label="Search"
      >
        <Search size={20} className="text-white" />
      </button>

      {searchDropdown}
    </div>
  );
}