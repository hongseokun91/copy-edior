import { NextRequest, NextResponse } from "next/server";
import { generatePosterBody } from "@/lib/poster/poster-engine";
import { PosterMeta } from "@/types/poster";
import { nanoid } from "nanoid";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    const traceId = `trace_${nanoid(8)}`;
    try {
        const body = await req.json();
        const { meta, selectedHeadline, blueprint } = body;

        if (!meta || !selectedHeadline || !blueprint) {
            return NextResponse.json(
                { message: "Missing required parameters: meta, selectedHeadline, or blueprint" },
                { status: 400 }
            );
        }

        const result = await generatePosterBody(meta as PosterMeta, selectedHeadline, blueprint, traceId);

        return NextResponse.json(result);

    } catch (error) {
        console.error(`[PosterBody] Error (Trace: ${traceId}):`, error);
        return NextResponse.json(
            { message: (error as Error).message || "Failed to generate poster body" },
            { status: 500 }
        );
    }
}
