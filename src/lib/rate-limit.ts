import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { env } from "./env";

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export const getIp = async () => {
  const headersList = await headers();

  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  if (realIp) return realIp;

  return null;
};

export const authRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "30 s"),
  analytics: true,
});

export const publicApiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "10 s"),
  analytics: true,
});

export async function rateLimit(
  identifier: string,
  limiter: Ratelimit = publicApiRateLimiter
) {
  const { success, limit, reset, remaining } = await limiter.limit(identifier);

  return {
    success,
    limit,
    reset,
    remaining,
    headers: {
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": reset.toString(),
    },
  };
}
