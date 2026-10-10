import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Личная учебная платформа: в поиск попадают только страницы для родителей — «о платформе» и конфиденциальность. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: ["/about", "/privacy"], disallow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
