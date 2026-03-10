import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.BASE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/contact", "/terms", "/privacy", "/api/favicon/*"],
        disallow: [
          "/api/",
          "/dashboard/",
          "/settings/",
          "/auth/",
          "/_next/",
          "/*.json$",
          "/*?*",
          "/admin",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/settings/", "/auth/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/settings/", "/auth/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
