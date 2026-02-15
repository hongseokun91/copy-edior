
import { FlyerSlots } from "@/types/flyer";
import { SLOT_LIMITS } from "@/lib/templates/slots";

function cleanText(text: string): string {
    if (!text) return "";
    let cleaned = text;
    cleaned = cleaned.replace(/\.{2,}/g, "."); // ... -> .
    cleaned = cleaned.replace(/undefined/g, "");
    cleaned = cleaned.replace(/^["']|["']$/g, "");
    return cleaned.trim();
}

function normalizePhone(text: string): string {
    return text.replace(/(010)(\d{4})(\d{4})/, "$1-$2-$3");
}

function fixHashtag(tag: string): string {
    const cleaned = cleanText(tag).replace(/\s+/g, "");
    if (cleaned.startsWith("#")) return cleaned;
    return `#${cleaned}`;
}

export function fixContent(slots: FlyerSlots): FlyerSlots {
    const fixed: FlyerSlots = { ...slots };

    // Core V2
    fixed.HEADLINE = cleanText(slots.HEADLINE || "");
    fixed.SUBHEAD = cleanText(slots.SUBHEAD || "");
    fixed.CTA = cleanText(slots.CTA || "");
    fixed.INFO = normalizePhone(cleanText(slots.INFO || ""));
    fixed.DISCLAIMER = cleanText(slots.DISCLAIMER || "");
    fixed.BENEFIT_BULLETS = (slots.BENEFIT_BULLETS || []).map(b => cleanText(b));

    // Rich V3
    fixed.hookLine = cleanText(slots.hookLine || "");
    fixed.proofLine = cleanText(slots.proofLine || "");
    fixed.offerBlock = cleanText(slots.offerBlock || "");
    fixed.urgencyLine = cleanText(slots.urgencyLine || "");
    fixed.posterShort = cleanText(slots.posterShort || "");

    // Arrays
    fixed.valueProps = (slots.valueProps || []).map(t => cleanText(t));
    fixed.microCTA = (slots.microCTA || []).map(t => cleanText(t));
    fixed.bannerShort = (slots.bannerShort || []).map(t => cleanText(t));
    fixed.hashtags = (slots.hashtags || []).map(t => fixHashtag(t));
    fixed.altHeadlines = (slots.altHeadlines || []).map(t => cleanText(t));

    // Emergency Clamping
    if (fixed.HEADLINE.length > SLOT_LIMITS.HEADLINE * 1.5) {
        fixed.HEADLINE = fixed.HEADLINE.substring(0, SLOT_LIMITS.HEADLINE * 1.5);
    }

    return fixed;
}
