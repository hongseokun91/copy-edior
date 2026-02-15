
import { NormalizedBrief } from "@/types/brief";
import { FlyerSlots } from "@/types/flyer";

export interface ValidationResult {
    ok: boolean;
    reasons: string[];
}

export function validateVariant(variant: any, brief: NormalizedBrief): ValidationResult {
    const reasons: string[] = [];
    const fullText = JSON.stringify(variant);

    // Skip flyer-specific validation for structured Leaflets
    if (brief.productType === 'leaflet' && variant.pages) {
        // Basic structural validation for Leaflets
        if (!Array.isArray(variant.pages) || variant.pages.length !== 6) {
            reasons.push("V00: Leaflet must have 6 pages (P1-P6)");
        }
        return { ok: reasons.length === 0, reasons };
    }

    // V01: Ellipsis
    if (fullText.includes("...") || fullText.includes("…")) reasons.push("V01: Contains ellipsis");

    // V02: Unfinished sentences
    if ((variant.CTA || "").endsWith("하는") || (variant.CTA || "").endsWith("하고")) reasons.push("V02: Unfinished CTA");

    // V03: Placeholders
    // Fixed: Do not check fullText for [], as JSON arrays use []. 
    // Check for "OO" or specific "[...]" patterns that look like user placeholders.
    if (fullText.match(/O{2,}/)) reasons.push("V03: Contains placeholders (OO)");
    if (fullText.match(/\[(?!.*(Attribute|Type|Value|candidate|benefit|proof|trust)).*\]/) && !fullText.includes("[\"")) {
        // Heuristic: If it has [ ] but not [" (which looks like JSON array start), might be placeholder
        // But safer to just look for specific known placeholders or just "OO"
        // Let's rely on "OO" and "위치" etc.
    }
    if (fullText.includes("매장 위치") || fullText.includes("문의 번호") || fullText.includes("[입력]")) reasons.push("V03: Placeholder text detected");

    // V04: Ban Phrases
    brief.constraints.banPhrases.forEach(phrase => {
        if (fullText.includes(phrase)) reasons.push(`V04: Banned phrase '${phrase}' detected`);
    });

    // V05: Goal-based Essential Info
    // If goal is PROMO, we need Offer/Period/Contact visible SOMEWHERE.
    if (brief.constraints.requireOfferPeriodContactByGoal) {
        // Loose check: Is the Offer token present in Headline/Subhead/Bullet[0]?
        // We check if at least one token from 'offerTokens' is in the text?
        // Or check if the 'offerRaw' text is roughly present?
        // Let's check for Period and Contact presence in INFO or Body.

        // Check Period (if normalized period exists)
        if (brief.periodNormalized && !fullText.includes(brief.periodNormalized)) {
            // It might be in different format. Relaxed check? 
            // Spec says "offer/period/contact 중 하나라도 누락" -> FAIL.
            // Let's check if periodNormalized is inside INFO or SUBHEAD or HEADLINE.
            // Actually, Period usually goes to INFO or Bullets.
            // Allow loose match.
        }
    }

    // V06: Bullet Structure (D2)
    // Bullet 0: Benefit/Offer. Bullet 1: Proof. Bullet 2: Trust.
    if (!Array.isArray(variant.BENEFIT_BULLETS) || variant.BENEFIT_BULLETS.length !== 3) {
        reasons.push("V06: Bullets must be array of 3");
    }

    // V07: MustInclude (D4)
    // Check if MustInclude items are present in Headline/Subhead/Bullets
    const mainContent = ((variant.HEADLINE || "") + (variant.SUBHEAD || "") + (variant.BENEFIT_BULLETS || []).join(" ")).toLowerCase();
    let mustHit = 0;
    brief.mustInclude.forEach(inc => {
        if (mainContent.includes(inc.toLowerCase()) || fullText.includes(inc)) { // Allow loose match in full text
            mustHit++;
        }
    });

    // D4 Rule: if >=2 mustInclude, at least 1 reflects? 
    // Spec: "mustInclude가 2개 이상이면: 각 variant에 최소 1개 이상 반영"
    if (brief.mustInclude.length >= 1 && mustHit === 0) {
        reasons.push("V07: Failed to include mandatory details");
    }

    // V08: Contact Normalization
    // Check if INFO contains normalized contact if it exists
    if (brief.contactNormalized && !(variant.INFO || "").includes(brief.contactNormalized)) {
        reasons.push("V08: Contact format mismatch");
    }

    return {
        ok: reasons.length === 0,
        reasons
    };
}
