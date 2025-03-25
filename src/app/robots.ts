import { env } from "@/lib/env";
import { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.BASE_URL || "https://substatz.me";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/contact",
          "/features",
          "/faq",
          "/terms",
          "/privacy",
          "/api/og/*",
          "/api/twitter-image/*",
          "/api/favicon/*",
        ],
        disallow: [
          "/api/",
          "/dashboard/",
          "/settings/",
          "/auth/",
          "/_next/",
          "/login/",
          "/register/",
          "/forgot-password/",
          "/reset-password/",
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
