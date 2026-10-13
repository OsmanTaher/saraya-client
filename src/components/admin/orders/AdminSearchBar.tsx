"use client";

import { Search, X } from "lucide-react";

interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function AdminSearchBar({
  value,
  onChange,
  placeholder = "بحث...",
  className = "max-w-sm",
}: AdminSearchBarProps) {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={`relative w-full ${className}`}>
      <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pr-10 pl-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 shadow-sm transition-colors"
      />

      {value.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="مسح نص البحث"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
