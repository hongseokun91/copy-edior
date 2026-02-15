import { FlyerTone } from "@/types/flyer";

export function refineTone(text: string, tone: FlyerTone): string {
    if (!text) return text;

    let refined = text;

    if (tone === 'friendly') {
        // Enforce soft endings
        // Example: "방문하십시오" -> "방문해보세요"
        refined = refined.replace(/하십시오/g, "해보세요");
        refined = refined.replace(/합니다/g, "해요");
        refined = refined.replace(/됩니다/g, "돼요");
        // "오세요" is inherently friendly/polite, keep it.
    } else if (tone === 'premium') {
        // Enforce formal/elegant endings
        // Example: "해봐" -> "권해드립니다"
        refined = refined.replace(/해봐/g, "제안합니다");
        refined = refined.replace(/에요/g, "입니다");
        refined = refined.replace(/돼요/g, "됩니다");
    } else if (tone === 'direct') {
        // Enforce concise endings
        // Example: "방문해주세요" -> "방문 요망" or just keep it short
        refined = refined.replace(/주세요/g, "바랍니다");
    }

    return refined;
}

export function applyStyleRules(slots: Record<string, any>, tone: FlyerTone): Record<string, any> {
    const newSlots = { ...slots };

    // Apply only to text fields
    if (typeof newSlots.HEADLINE === 'string') newSlots.HEADLINE = refineTone(newSlots.HEADLINE, tone);
    if (typeof newSlots.SUBHEAD === 'string') newSlots.SUBHEAD = refineTone(newSlots.SUBHEAD, tone);

    // Bullets (Array)
    if (Array.isArray(newSlots.BENEFIT_BULLETS)) {
        newSlots.BENEFIT_BULLETS = newSlots.BENEFIT_BULLETS.map((b: string) => refineTone(b, tone));
    }

    return newSlots;
}
