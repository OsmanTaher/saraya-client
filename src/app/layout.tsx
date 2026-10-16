import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/src/context/CartContext";
import Footer from "../components/layout/Footer";

const tajawal = localFont({
  src: [
    {
      path: "./fonts/Tajawal-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Tajawal-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Tajawal-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Tajawal-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "مطعم السرايا | أشهى المأكولات والمشويات",
  description:
    "مطعم السرايا - أشهى المأكولات والمشويات الطازجة. اطلب وجبتك المفضلة بسهولة",
  keywords: [
    "مطعم السرايا",
    "مشويات",
    "وجبات",
    "سندوتشات",
    "مأكولات",
    "توصيل طعام",
  ],
  metadataBase: new URL("https://saraya-restaurant.vercel.app"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${tajawal.className} bg-lightBg text-gray-800 min-h-screen flex flex-col`}
      >
        <CartProvider>
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
