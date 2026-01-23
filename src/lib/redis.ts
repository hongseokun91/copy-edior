import { Redis } from "@upstash/redis";

// Fail-safe initialization
let redis: Redis | null = null;

try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    } else {
        console.warn("Redis credentials not found. Caching will be disabled.");
    }
} catch (e) {
    console.error("Failed to initialize Redis client:", e);
}

export async function getCachedResult(key: string): Promise<unknown | null> {
    if (!redis) return null;
    try {
        return await redis.get(key);
    } catch (error) {
        console.warn("Redis GET failed (fail-open):", error);
        return null;
    }
}

export async function setCachedResult(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    if (!redis) return;
    try {
        await redis.set(key, value, { ex: ttlSeconds });
    } catch (error) {
        console.warn("Redis SET failed:", error);
    }
}

// Rate Limit Config
const DAILY_LIMIT = 20;

export async function checkRateLimit(key: string): Promise<{ allowed: boolean; remaining: number; resetTime?: string }> {
    if (!redis) return { allowed: true, remaining: 19 };
    try {
        const dateKey = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
        const limitKey = `rl:${dateKey}:${key}`;

        const count = await redis.incr(limitKey);
        if (count === 1) {
            await redis.expire(limitKey, 86400); // 24h safety
        }

        const remaining = Math.max(0, DAILY_LIMIT - count);
        return {
            allowed: count <= DAILY_LIMIT,
            remaining,
            resetTime: "00:00 KST"
        };

    } catch (error) {
        console.warn("Redis RateLimit failed (fail-open):", error);
        return { allowed: true, remaining: 19 };
    }
}

export async function checkCooldown(key: string, seconds: number): Promise<boolean> {
    if (!redis) return true; // Fail-open
    try {
        const cdKey = `cd:${key}`;
        const exists = await redis.exists(cdKey);
        if (exists) return false;

        await redis.set(cdKey, "1", { ex: seconds });
        return true;
    } catch (error) {
        console.warn("Redis Cooldown failed (fail-open):", error);
        return true;
    }
}
