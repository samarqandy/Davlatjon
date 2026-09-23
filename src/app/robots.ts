import type { MetadataRoute } from "next";

/** Личная учебная платформа ребёнка — индексировать её не нужно. */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
