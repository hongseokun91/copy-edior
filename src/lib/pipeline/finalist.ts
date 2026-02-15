
import { safeGenerateText } from "@/lib/copy/provider";
import { FlyerSlots } from "@/types/flyer";
import { CopyContentSchema } from "@/lib/copy/schema";

export async function finalizeDraft(draft: FlyerSlots, traceId: string = "unknown"): Promise<FlyerSlots> {
    const prompt = `
    [ROLE]
    You are the "Final Polish" Editor.
    
    [TASK]
    Review and polish this draft for maximum rhythmic flow.
    DRAFT:
    - HEADLINE: ${draft.HEADLINE}
    - SUBHEAD: ${draft.SUBHEAD}
    - BULLETS: ${draft.BENEFIT_BULLETS.join(", ")}
    - CTA: ${draft.CTA}
    
    [OUTPUT FORMAT]
    Think briefly, then output strictly JSON inside <JSON> tags.
    Schema keys: headline, subhead, bullets, cta
    `.trim();

    try {
        const { text } = await safeGenerateText({
            passName: "FINALIZE",
            prompt: prompt
        }, traceId);

        const match = text.match(/<JSON>([\s\S]*?)<\/JSON>/);
        if (!match) throw new Error("FINAL_PARSE_FAIL: Missing <JSON> tags");

        const object = JSON.parse(match[1]);

        return {
            ...draft,
            HEADLINE: object.headline || draft.HEADLINE,
            SUBHEAD: object.subhead || draft.SUBHEAD,
            BENEFIT_BULLETS: object.bullets || draft.BENEFIT_BULLETS,
            CTA: object.cta || draft.CTA
        };
    } catch (e: any) {
        console.warn(`[Finalist] Failed for ${traceId}: ${e.message}. Using refined draft.`);
        return draft;
    }
}
