
import { FlyerSlots } from "@/types/flyer";

// Tokenizer (Supports FlyerSlots and LeafletVariant)
function getTokens(slots: any): Set<string> {
    let text = "";

    if (slots.pages && Array.isArray(slots.pages)) {
        // Leaflet: Extract from all page sections
        text = slots.pages.map((p: any) =>
            p.sections?.map((s: any) => JSON.stringify(s.content)).join(" ") || ""
        ).join(" ");
    } else {
        // Flyer: Standard slots
        text = `${slots.HEADLINE || ""} ${slots.SUBHEAD || ""} ${slots.CTA || ""} ${(slots.BENEFIT_BULLETS || []).join(" ")}`;
    }

    // Character-Bigram for Korean
    const tokens = new Set<string>();
    // Normalize spaces but keep them for bigrams like "는 "
    const cleanText = text.replace(/\s+/g, " ").trim();

    for (let i = 0; i < cleanText.length - 1; i++) {
        tokens.add(cleanText.substring(i, i + 2));
    }

    return tokens;
}

export function calculateOverlap(a: any, b: any): number {
    const tokensA = getTokens(a);
    const tokensB = getTokens(b);

    if (tokensA.size === 0 || tokensB.size === 0) return 0;

    const intersection = new Set([...tokensA].filter(x => tokensB.has(x)));
    const union = new Set([...tokensA, ...tokensB]);

    return intersection.size / union.size;
}

export function checkSimilarity(variants: { A: any; B: any; C: any }) {
    const pairs = [
        { id: "AB", v1: variants.A, v2: variants.B, k1: "A", k2: "B" },
        { id: "BC", v1: variants.B, v2: variants.C, k1: "B", k2: "C" },
        { id: "AC", v1: variants.A, v2: variants.C, k1: "A", k2: "C" }
    ];

    for (const p of pairs) {
        const score = calculateOverlap(p.v1, p.v2);
        if (score >= 0.45) {
            return {
                ok: false,
                failPair: [p.k1, p.k2],
                score
            };
        }
    }

    return { ok: true };
}
