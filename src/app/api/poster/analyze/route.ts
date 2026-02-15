import { NextRequest, NextResponse } from "next/server";
import { analyzeBrief } from "@/lib/poster/poster-engine";
import { nanoid } from "nanoid";

export const maxDuration = 30; // 30 seconds max for Vercel Functions

export async function POST(req: NextRequest) {
    const traceId = `trace_${nanoid(8)}`;
    try {
        const body = await req.json();
        const { brief, industry } = body;

        if (!brief) {
            return NextResponse.json(
                { message: "Brief is required" },
                { status: 400 }
            );
        }

        const result = await analyzeBrief(brief, industry || "General", traceId);

        return NextResponse.json(result);

    } catch (error) {
        console.error(`[PosterAnalyze] Error (Trace: ${traceId}):`, error);
        return NextResponse.json(
            { message: (error as Error).message || "Failed to analyze poster brief" },
            { status: 500 }
        );
    }
}
