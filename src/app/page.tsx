import ProductCard from "@/src/components/product/ProductCard";
import Header from "@/src/components/layout/Header";
import CheckoutForm from "@/src/components/cart/CheckoutForm";
import { Product } from "@/src/types";
import Link from "next/link";
import Footer from "../components/layout/Footer";
import QuickServicesBar from "../components/home/QuickServicesBar";
import { Flame, UtensilsCrossed } from "lucide-react";

const CATEGORY_ORDER = [
  "مشويات",
  "سندوتشات",
  "وجبات",
  "مقبلات وسلطات",
  "مشروبات",
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${apiUrl}/products`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("فشل في جلب قائمة الطعام");
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; table?: string }>;
}) {
  const params = await searchParams;
  const allProducts = await getProducts();
  const currentCategory = params.category?.trim();
  const currentTable = params.table?.trim();

  const displayedProducts = currentCategory
    ? allProducts.filter((p) => (p.category ?? "").trim() === currentCategory)
    : allProducts;

  const categoriesWithProducts = Array.from(
    new Set([
      ...CATEGORY_ORDER,
      ...displayedProducts.map((product) => product.category?.trim()),
    ])
  )
    .filter((category): category is string => Boolean(category))
    .map((category) => ({
      name: category,
      products: displayedProducts.filter(
        (product) => product.category?.trim() === category
      ),
    }))
    .filter((group) => group.products.length > 0);

  const clearFilterHref = currentTable ? `/?table=${currentTable}` : "/";

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-4">
        {/* لافتة الترحيب بطلبات الصالة عند مسح الـ QR Code */}
        {currentTable && (
          <div className="mb-5 flex items-center justify-between rounded-2xl bg-orange-50 border border-[#D55304]/30 px-4 py-3 text-[#D55304] shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D55304] text-white shadow-xs">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900">
                  طلب داخل الصالة — ترابيزة رقم ({currentTable})
                </p>
                <p className="text-xs text-slate-600">
                  اختر وجباتك المفضلة وسيتم تحضيرها وتقديمها لترابيزتك مباشرة
                </p>
              </div>
            </div>
            <span className="rounded-full bg-[#D55304] px-3.5 py-1 text-xs font-extrabold text-white">
              ترابيزة #{currentTable}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* قسم الوجبات (يمين في شاشات اللاب توب) */}
          <div className="lg:col-span-7 w-full">
            <div className="mb-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-[#D55304] fill-[#D55304]/15" />
                  <h2 className="text-lg md:text-xl font-extrabold text-slate-900">
                    {currentCategory
                      ? `وجبات وسندوتشات - ${currentCategory}`
                      : "وجبات وسندوتشات - المشويات"}
                  </h2>
                </div>
                <span className="text-xs md:text-sm text-slate-500 font-medium block mt-0.5">
                  اختر وجبتك المفضلة وأضفها لطلبك
                </span>
              </div>

              {currentCategory && (
                <Link
                  href={clearFilterHref}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#D55304] bg-orange-50 hover:bg-orange-100 border border-[#D55304]/25 rounded-full transition-all duration-150 active:scale-95 shadow-xs"
                >
                  <span>إلغاء التصفية</span>
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-[#D55304]/15 text-[#D55304] text-[10px] leading-none">
                    ✕
                  </span>
                </Link>
              )}
            </div>

            {displayedProducts.length === 0 ? (
              <div className="text-center text-slate-400 py-16 bg-white rounded-2xl border border-slate-100">
                لا توجد وجبات متاحة في هذا القسم حالياً.
              </div>
            ) : (
              <div className="space-y-8">
                {categoriesWithProducts.map((group) => (
                  <section key={group.name}>
                    {categoriesWithProducts.length > 1 && (
                      <h3 className="mb-3 border-r-4 border-[#D55304] pr-3 text-base font-extrabold text-slate-800">
                        {group.name}
                      </h3>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 w-full">
                      {group.products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>

          {/* قسم ملخص الطلب والحساب (يسار في شاشات اللاب توب) */}
          <div className="sticky top-20 lg:col-span-5 w-full">
            <CheckoutForm />
          </div>
        </div>
      </main>
      <QuickServicesBar />
      <Footer />
    </>
  );
}