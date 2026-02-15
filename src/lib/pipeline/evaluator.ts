
import { safeGenerateText } from "@/lib/copy/provider";
import { FlyerSlots } from "@/types/flyer";
import { z } from "zod";

const CritiqueSchema = z.object({
    weaknesses: z.array(z.string()).describe("3 specific things that are weak/boring"),
    specific_instruction: z.string().describe("Exact instruction for the next writer (e.g. 'Change the headline to emphasize 20% off')")
});

export interface Critique {
    weaknesses: string[];
    instruction: string;
}

export async function evaluateDraft(draft: FlyerSlots, traceId: string = "unknown"): Promise<Critique> {
    const prompt = `
    [ROLE]
    You are a Senior Copy Chief. You hate boring, generic copy.
    
    [TASK]
    Review this draft. Find 3 SPECIFIC flaws.
    - HEADLINE: ${draft.HEADLINE}
    - SUBHEAD: ${draft.SUBHEAD}
    - BULLETS: ${draft.BENEFIT_BULLETS.join(", ")}
    - CTA: ${draft.CTA}
    
    [OUTPUT FORMAT]
    Think briefly, then output strictly JSON inside <JSON> tags.
    Format: <JSON>{"weaknesses": ["..."], "specific_instruction": "..."}</JSON>
    `.trim();

    try {
        const { text } = await safeGenerateText({
            passName: "EVALUATE",
            prompt: prompt
        }, traceId);

        const match = text.match(/<JSON>([\s\S]*?)<\/JSON>/);
        if (!match) throw new Error("EVALUATE_PARSE_FAIL: Missing <JSON> tags");

        const object = JSON.parse(match[1]);

        return {
            weaknesses: object.weaknesses || ["Generic tone"],
            instruction: object.specific_instruction || "Focus on more concrete benefits."
        };
    } catch (e: any) {
        console.warn(`[Evaluator] Failed for ${traceId}: ${e.message}`);
        return {
            weaknesses: ["Parsing issue"],
            instruction: "Ensure the next pass focuses on clarity."
        };
    }
}
