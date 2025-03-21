import { headers } from "next/headers";
export interface RateLimitResponse {
  success: boolean;
  limit: number;
  reset: number;
  remaining: number;
  headers: {
    "X-RateLimit-Limit": string;
    "X-RateLimit-Remaining": string;
    "X-RateLimit-Reset": string;
  };
}

export interface RateLimiter {
  limit: (identifier: string) => Promise<RateLimitResponse>;
}

export const getIp = async () => {
  const headersList = await headers();

  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  if (realIp) return realIp;

  return null;
};

export class MemoryRateLimiter implements RateLimiter {
  protected store: Map<string, { timestamps: number[] }>;
  protected windowMs: number;
  protected maxRequests: number;

  constructor(maxRequests: number, windowStr: string) {
    this.store = new Map();
    this.maxRequests = maxRequests;

    const [amount, unit] = windowStr.split(" ");
    const multiplier =
      unit === "s"
        ? 1000
        : unit === "m"
        ? 60 * 1000
        : unit === "h"
        ? 60 * 60 * 1000
        : 1000;
    this.windowMs = parseInt(amount) * multiplier;
  }

  async limit(identifier: string): Promise<RateLimitResponse> {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.store.has(identifier)) {
      this.store.set(identifier, { timestamps: [] });
    }

    const record = this.store.get(identifier)!;

    record.timestamps = record.timestamps.filter(
      (timestamp) => timestamp > windowStart
    );

    const isRateLimited = record.timestamps.length >= this.maxRequests;
    if (!isRateLimited) record.timestamps.push(now);

    const oldestTimestamp =
      record.timestamps.length > 0 ? Math.min(...record.timestamps) : now;
    const resetTime = Math.ceil((oldestTimestamp + this.windowMs - now) / 1000);
    const remaining = Math.max(0, this.maxRequests - record.timestamps.length);

    return {
      success: !isRateLimited,
      limit: this.maxRequests,
      reset: resetTime,
      remaining,
      headers: {
        "X-RateLimit-Limit": this.maxRequests.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": resetTime.toString(),
      },
    };
  }

  clear(): void {
    this.store.clear();
  }
}

export const authRateLimiter = new MemoryRateLimiter(5, "30 s");
export const publicApiRateLimiter = new MemoryRateLimiter(20, "10 s");
