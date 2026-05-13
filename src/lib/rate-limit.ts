/**
 * Simple in-memory rate limiter for Next.js API routes.
 * Suitable for MVP / single-region serverless environments.
 * For true distributed edge environments, use Vercel KV or Upstash.
 */

interface RateLimitTracker {
    count: number;
    resetTime: number;
}

const rateLimits = new Map<string, RateLimitTracker>();

export function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const tracker = rateLimits.get(ip);

    // Clean up expired entries occasionally (basic garbage collection)
    if (rateLimits.size > 1000) {
        for (const [key, val] of rateLimits.entries()) {
            if (val.resetTime < now) {
                rateLimits.delete(key);
            }
        }
    }

    if (!tracker || tracker.resetTime < now) {
        // First request or window expired
        rateLimits.set(ip, {
            count: 1,
            resetTime: now + windowMs,
        });
        return true;
    }

    if (tracker.count >= limit) {
        // Rate limit exceeded
        return false;
    }

    // Increment count
    tracker.count += 1;
    rateLimits.set(ip, tracker);
    return true;
}
