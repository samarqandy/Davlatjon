import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Личная учебная платформа: в поиск попадают только страницы для родителей — «о платформе» и конфиденциальность. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/about",
          "/privacy",
          // файлы подтверждения прав на сайт в Google Search Console и Яндекс Вебмастере
          "/google44d44289cf711a55.html",
          "/yandex_1acd9f855dbf75bc.html",
        ],
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
