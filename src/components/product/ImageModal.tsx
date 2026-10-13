"use client";

/* The modal displays arbitrary external product image URLs. */
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute left-0 z-10 bg-white hover:bg-gray-200 text-slate-800 rounded-full p-2 transition-colors"
          onClick={onClose}
          aria-label="Close image modal"
        >
          <X size={16} />
        </button>
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
        />
      </div>
    </div>
  );
}
