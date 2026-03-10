import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.BASE_URL;

  const mainPages = [
    {
      url: baseUrl,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  ];

  const authPages = [
    {
      url: `${baseUrl}/login`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/register`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/forgot-password`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  const infoPages = [
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  return [...mainPages, ...authPages, ...infoPages];
}
