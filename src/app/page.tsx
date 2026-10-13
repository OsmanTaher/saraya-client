import ProductCard from "@/src/components/product/ProductCard";
import Header from "@/src/components/layout/Header";
import CheckoutForm from "@/src/components/cart/CheckoutForm";
import { Product } from "@/src/types";
import Link from "next/link";
import Footer from "../components/layout/Footer";
import QuickServicesBar from "../components/home/QuickServicesBar";

const CATEGORY_ORDER = [
  "كشاكيل و كراسات",
  "أقلام و أدوات مكتبية",
  "أدوات الرسم",
  "لانشبوك و زمزمية",
  "مقالم و شنط",
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${apiUrl}/products`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("فشل في جلب المنتجات");
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const allProducts = await getProducts();
  const currentCategory = params.category?.trim();

  const displayedProducts = currentCategory
    ? allProducts.filter((p) => (p.category ?? "").trim() === currentCategory)
    : allProducts;

  const categoriesWithProducts = Array.from(
    new Set([
      ...CATEGORY_ORDER,
      ...displayedProducts.map((product) => product.category?.trim()),
    ]),
  )
    .filter((category): category is string => Boolean(category))
    .map((category) => ({
      name: category,
      products: displayedProducts.filter(
        (product) => product.category?.trim() === category,
      ),
    }))
    .filter((group) => group.products.length > 0);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className=" lg:col-span-7 w-full">
            <div className=" mb-2 flex justify-between items-end">
              <span className=" text-xs md:text-sm text-slate-500 font-medium block mb-0.5">
                حدد الكميات المناسبة لاحتياجاتك
              </span>

              {currentCategory && (
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 rounded-full transition-all duration-150 active:scale-95 shadow-sm"
                >
                  <span>إلغاء التصفية</span>
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-rose-200/60 text-rose-700 text-[10px] leading-none">
                    ✕
                  </span>
                </Link>
              )}
            </div>

            {displayedProducts.length === 0 ? (
              <div className="text-center text-slate-400 py-16 bg-white rounded-2xl border border-slate-100">
                لا توجد منتجات في هذا القسم حالياً.
              </div>
            ) : (
              <div className="space-y-8">
                {categoriesWithProducts.map((group) => (
                  <section key={group.name}>
                    <h3 className="mb-3 border-r-4 border-indigo-500 pr-3 text-base font-bold text-slate-800">
                      {group.name}
                    </h3>
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
