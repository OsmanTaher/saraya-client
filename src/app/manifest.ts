import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "مطعم السرايا | أشهى المأكولات والمشويات",
    short_name: "مطعم السرايا",
    description: "مطعم السرايا - أشهى المأكولات والمشويات الطازجة",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#D55304",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}