import { NextRequest, NextResponse } from "next/server";
import { generateHeadlines } from "@/lib/poster/poster-engine";

import { nanoid } from "nanoid";

export const maxDuration = 60; // Increased duration for multiple headline generation

export async function POST(req: NextRequest) {
    const traceId = `trace_${nanoid(8)}`;
    try {
        const body = await req.json();
        const { meta } = body;

        if (!meta || !meta.brief) {
            return NextResponse.json(
                { message: "Invalid PosterMeta: Brief is required" },
                { status: 400 }
            );
        }

        const result = await generateHeadlines(meta, traceId);

        return NextResponse.json(result);

    } catch (error) {
        console.error(`[PosterHeadlines] Error (Trace: ${traceId}):`, error);
        return NextResponse.json(
            { message: (error as Error).message || "Failed to generate headlines" },
            { status: 500 }
        );
    }
}
