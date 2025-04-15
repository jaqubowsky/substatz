import { env } from "@/lib/env";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.BASE_URL || "https://substatz.me";
  const lastModified = new Date();

  const mainPages = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  ];

  const authPages = [
    {
      url: `${baseUrl}/login`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/register`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/forgot-password`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  const infoPages = [
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  return [...mainPages, ...authPages, ...infoPages];
}
