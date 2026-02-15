import { safeGenerateText } from "@/lib/copy/provider";
import { NormalizedBrief } from "@/types/brief";
import { z } from "zod";

const SelectionSchema = z.object({
    scores: z.array(z.object({
        index: z.number(),
        relevance: z.number().describe("1-10: Fits the goal"),
        creativity: z.number().describe("1-10: Not cliche"),
        clarity: z.number().describe("1-10: Easy to understand"),
        total: z.number()
    })),
    bestIndex: z.number(),
    reason: z.string()
});

export async function selectBestCandidate(candidates: any[], frame: string, brief: NormalizedBrief, traceId: string = "unknown") {
    if (candidates.length === 0) return null;
    if (candidates.length === 1) return candidates[0];

    const prompt = `
    [TASK]
    Evaluate these 6 copy concepts for a Flyer (Frame: ${frame}).
    Goal: ${brief.goal}
    Target: ${brief.audienceHint.join(", ")}
    
    [RUBRIC]
    1. Relevance: Does it highlight the Offer (${brief.offerRaw}) and Goal?
    2. Creativity: Is it catchy and not boring?
    3. Clarity: Is the benefit obvious?

    [CANDIDATES]
    ${candidates.map((c, i) => `[ID:${i}] HL: ${c.headline} / SUB: ${c.subhead}`).join("\n")}

    [OUTPUT FORMAT]
    Think briefly, then output valid JSON inside <JSON> tags.
    Format: <JSON>{"bestIndex": number, "reason": "string"}</JSON>
    `.trim();

    try {
        const { text } = await safeGenerateText({
            passName: `SELECT_${frame}`,
            system: "You are a Senior Copy Editor. Output ONLY JSON inside <JSON> tags.",
            prompt: prompt
        }, traceId);

        const match = text.match(/<JSON>([\s\S]*?)<\/JSON>/);
        if (!match) throw new Error("No JSON tags found in selector output");

        const result = JSON.parse(match[1]);
        const idx = result.bestIndex;

        // Verify index is valid
        if (typeof idx === 'number' && candidates[idx]) {
            return {
                ...candidates[idx],
                selection_reason: result.reason || "Selected by Editor"
            };
        }
    } catch (e: any) {
        console.warn(`[Selector] Selection failed for ${traceId}: ${e.message}. Using first candidate.`);
    }

    return candidates[0];
}
