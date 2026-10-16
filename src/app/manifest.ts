import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "مطعم السرايا | أشهى المأكولات والمشويات",
    short_name: "السرايا",
    description: "أشهى المأكولات والمشويات الطازجة. اطلب وجبتك المفضلة أونلاين بسهولة.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ea580c",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable", // تجعل الصورة تملأ مساحة الأيقونة بالكامل
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable", // تملأ المساحة لشاشات العرض العالية
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any", // للتوافق مع الأنظمة التي لا تدعم maskable
      },
    ],
  };
}