import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Лаборатория Давлатжона",
    short_name: "Лаборатория",
    description: "Математика, логика и алгоритмы для детей от 7 лет: ежедневные занятия, подсказки и печать листов.",
    lang: "ru",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#4f46e5",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
