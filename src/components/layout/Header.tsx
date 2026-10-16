"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import MenuBar from "./MenuBar";
import SearchBar from "./SearchBar";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const clickCount = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll =
        window.scrollY || document.documentElement.scrollTop;

      if (totalScroll > 0) {
        const progress = (currentScroll / totalScroll) * 100;
        setScrollProgress(Math.min(progress, 100));
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    clickCount.current += 1;

    if (timerRef.current) clearTimeout(timerRef.current);

    if (clickCount.current === 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (clickCount.current >= 3) {
      clickCount.current = 0;
      router.push("/admin/orders");
      return;
    }

    timerRef.current = setTimeout(() => {
      clickCount.current = 0;
    }, 1500);
  };

  return (
    <header
      className="bg-primary text-white sticky top-0 z-40 shadow-md"
      dir="rtl"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 select-none group">
          <div
            className="relative w-10 h-10 shrink-0 active:scale-95 
            transition-transform duration-150 cursor-pointer"
            onClick={handleLogoClick}
          >
            <Image
              src="/logo.png"
              alt="شعار مطعم السرايا"
              width={40}
              height={40}
              priority
              className="w-10 h-10 rounded-xl object-contain bg-orange-50 p-0.5"
            />
          </div>

          <div className="text-right">
            <h1 className="text-lg md:text-xl font-bold leading-tight">
              مطعم السرايا
            </h1>
            <p className="text-xs text-white/80 font-normal">
              أشهى المأكولات والمشويات
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SearchBar />

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2.5 rounded-xl transition ${
              isMenuOpen ? "bg-white/20 " : "bg-white/20 hover:bg-white/30"
            }`}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className="absolute bottom-0 right-0 h-0.75 bg-[#FCD34D] transition-[width] duration-100 ease-out z-50"
        style={{ width: `${scrollProgress}%` }}
      />

      <MenuBar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
