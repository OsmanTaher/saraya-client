import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://saraya.aswany.me";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/"], // منع جوجل من فهرسة لوحة الإدارة
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}