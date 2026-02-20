import { NextRequest, NextResponse } from "next/server";
import { runAnalysisPipeline } from "@/lib/analyze/pipeline";

export const maxDuration = 60; // Set to 60s as per OCR_TIMEOUT_MS

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { imageUrl } = body;

        if (!imageUrl) {
            return NextResponse.json(
                { message: "imageUrl is required" },
                { status: 400 }
            );
        }

        console.log(`[API] Analysis Request for: ${imageUrl}`);
        const result = await runAnalysisPipeline(imageUrl);

        return NextResponse.json(result);

    } catch (error) {
        console.error("[API] Analysis Failed:", error);
        return NextResponse.json(
            { message: "Internal Analysis Error" },
            { status: 500 }
        );
    }
}
