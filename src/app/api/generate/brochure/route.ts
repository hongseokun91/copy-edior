// src/app/api/generate/brochure/route.ts

import { NextResponse } from "next/server";
import { generateBrochure, type LLMClient } from "@/lib/copy/brochure/engine";
import { BrochureInput } from "@/types/brochure";
import { safeGenerateText } from "@/lib/copy/provider";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const input: BrochureInput = body.inputs;
        const traceId = body.traceId || `tr_br_${Date.now()}`;

        if (!input.brandName || !input.kindId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        console.log(`[API_BROCHURE_START] Kind: ${input.kindId} Brand: ${input.brandName} Trace: ${traceId}`);

        // Standard LLM Client injection
        const llm: LLMClient = {
            generate: async ({ system, prompt, temperature }) => {
                const { text } = await safeGenerateText({
                    system,
                    prompt,
                    temperature: temperature ?? 0.3,
                    passName: "BROCHURE_GEN",
                }, traceId);
                return text;
            }
        };

        // The engine handles the pipeline
        const result = await generateBrochure(input, {
            llm,
            requestedBlocks: body.extra?.blocks, // Pass full blocks including guidance
            autoRepair: true,
            similarityThreshold: 0.78
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("[API_BROCHURE_ERROR]", error);
        return NextResponse.json(
            { message: (error as Error).message || "Failed to generate brochure" },
            { status: 500 }
        );
    }
}
