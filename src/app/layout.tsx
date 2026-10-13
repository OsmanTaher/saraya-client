import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/src/context/CartContext";

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
  title: "بيعلي جملة",
  description: "طلب الأدوات المدرسية بسهولة بسعر الجملة",
  keywords: ["بيعلي جملة", "توشكى بالجملة", "أدوات مدرسية جملة", "مكتبة توشكى"],
  metadataBase: new URL("https://toshka-wholesale.vercel.app"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
  },
  verification: {
    google: "ROs8hDISKSQqGbLcIRkf2E-pjlYksnQd9faZ70DvAV0",
  }
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
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
