import { env } from "@/lib/env";
import { withSentryConfig } from "@sentry/nextjs";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              env.NODE_ENV === "production"
                ? "default-src 'self'; " +
                  "script-src 'self' 'unsafe-eval' https://js.stripe.com https://umami.substatz.me; " +
                  "script-src-elem 'self' 'unsafe-inline' https://js.stripe.com https://umami.substatz.me; " +
                  "style-src 'self'; " +
                  "img-src 'self' data: https://substatz.me https://umami.substatz.me https://*.stripe.com; " +
                  "font-src 'self' data:; " +
                  "connect-src 'self' https://api.stripe.com https://umami.substatz.me https://*.ingest.sentry.io; " +
                  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com; " +
                  "object-src 'none'; " +
                  "worker-src 'self' blob:; " +
                  "base-uri 'self'; " +
                  "form-action 'self' https://api.stripe.com; " +
                  "frame-ancestors 'self'; " +
                  "upgrade-insecure-requests"
                : "",
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "jakub-v0",
  project: "substatz",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
