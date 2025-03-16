import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.AUTH_URL || "https://subscript.it";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
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
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
