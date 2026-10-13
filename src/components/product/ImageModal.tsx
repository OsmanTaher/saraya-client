"use client";

/* eslint-disable @next/next/no-img-element */

import { X } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  imageSrc: string;
  imageAlt: string;
  onClose: () => void;
}

export default function ImageModal({
  isOpen,
  imageSrc,
  imageAlt,
  onClose,
}: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-3 left-3 z-10 bg-white/90 hover:bg-[#D55304] hover:text-white text-slate-800 rounded-full p-2 transition-colors shadow-md cursor-pointer"
          onClick={onClose}
          aria-label="إغلاق الصورة"
        >
          <X size={18} />
        </button>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-auto max-h-[75vh] object-contain rounded-xl bg-white"
        />
      </div>
    </div>
  );
}