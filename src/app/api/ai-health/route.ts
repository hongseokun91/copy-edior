import { NextResponse } from "next/server";

export async function GET() {
    // Logic: In v1.4+, we use AI_GATEWAY_BASE_URL and AI_GATEWAY_API_KEY
    const hasKey = !!process.env.AI_GATEWAY_API_KEY;
    const baseURL = process.env.AI_GATEWAY_BASE_URL;
    const vercelEnv = process.env.VERCEL_ENV || 'local';

    return NextResponse.json({
        ok: hasKey,
        env: {
            vercel: vercelEnv,
            isLocal: vercelEnv === 'local',
            hasKey: hasKey
        },
        provider: {
            mode: "gateway",
            baseURL: baseURL ? (baseURL.length > 20 ? baseURL.substring(0, 20) + "..." : baseURL) : null,
            ready: hasKey && !!baseURL
        },
        timestamp: new Date().toISOString()
    });
}
