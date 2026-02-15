
import { safeGenerateText } from "@/lib/copy/provider";
import { FlyerSlots } from "@/types/flyer";
import { CopyContentSchema } from "@/lib/copy/schema";
import { Critique } from "./evaluator";

export async function refineDraft(draft: FlyerSlots, critique: Critique, traceId: string = "unknown"): Promise<FlyerSlots> {
    const prompt = `
    [ROLE]
    You are an Expert Rewriter.
    
    [INPUT]
    Draft:
    - HEADLINE: ${draft.HEADLINE}
    - SUBHEAD: ${draft.SUBHEAD}
    - BULLETS: ${draft.BENEFIT_BULLETS.join(", ")}
    - CTA: ${draft.CTA}
    
    [EDITOR FEEDBACK]
    - Weaknesses: ${critique.weaknesses.join(", ")}
    - Instruction: "${critique.instruction}"
    
    [TASK]
    Rewrite the draft. Output valid JSON inside <JSON> tags.
    Schema keys: headline, subhead, bullets, cta
    `.trim();

    try {
        const { text } = await safeGenerateText({
            passName: "REFINE",
            prompt: prompt
        }, traceId);

        const match = text.match(/<JSON>([\s\S]*?)<\/JSON>/);
        if (!match) throw new Error("REFINE_PARSE_FAIL: Missing <JSON> tags");

        const object = JSON.parse(match[1]);

        return {
            ...draft,
            HEADLINE: object.headline || draft.HEADLINE,
            SUBHEAD: object.subhead || draft.SUBHEAD,
            BENEFIT_BULLETS: object.bullets || draft.BENEFIT_BULLETS,
            CTA: object.cta || draft.CTA
        };
    } catch (e: any) {
        console.warn(`[Refiner] Failed for ${traceId}: ${e.message}. Using original draft.`);
        return draft;
    }
}
