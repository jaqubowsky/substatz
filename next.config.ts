import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import { env } from "@/lib/env";

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
  reactCompiler: true,
  cacheComponents: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  serverExternalPackages: ["mariadb"],
  output: "standalone",
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
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
                  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://accounts.google.com https://*.googleusercontent.com https://umami.jnalewajk.me; " +
                  "script-src-elem 'self' 'unsafe-inline' https://js.stripe.com https://accounts.google.com https://*.googleapis.com https://umami.jnalewajk.me; " +
                  "style-src 'self' 'unsafe-inline' https://substatz.jnalewajk.me https://accounts.google.com https://fonts.googleapis.com; " +
                  "img-src 'self' data: https://substatz.jnalewajk.me https://*.stripe.com https://*.googleusercontent.com https://lh3.googleusercontent.com; " +
                  "font-src 'self' data: https://fonts.gstatic.com; " +
                  "connect-src 'self' https://api.stripe.com https://*.ingest.sentry.io https://accounts.google.com https://*.googleapis.com https://umami.jnalewajk.me; " +
                  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://accounts.google.com https://*.googleusercontent.com; " +
                  "object-src 'none'; " +
                  "worker-src 'self' blob:; " +
                  "base-uri 'self'; " +
                  "form-action 'self' https://api.stripe.com https://accounts.google.com; " +
                  "frame-ancestors 'self'; " +
                  "upgrade-insecure-requests"
                : "",
          },
        ],
      },
    ];
  },
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

export default withSentryConfig(withBundleAnalyzer(nextConfig), {
  org: "jakub-v0",
  project: "substatz",
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
