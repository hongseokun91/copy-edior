import { NextRequest } from "next/server";
import { createHash } from "crypto";

export function getClientIp(req: NextRequest): string {
    // In Vercel/Next.js, x-forwarded-for contains the client IP
    // If multiple, the first one is the client
    const forwardedFor = req.headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }
    return "127.0.0.1"; // Fallback for local
}

export async function hashIp(ip: string): Promise<string> {
    const salt = process.env.IP_HASH_SALT || "default-salt";
    const raw = `${ip}:${salt}`;
    // Use Node crypto for standard SHA-256
    return createHash("sha256").update(raw).digest("hex");
}
