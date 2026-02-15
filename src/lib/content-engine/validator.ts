
import { FlyerSlots } from "@/types/flyer";
import { SLOT_LIMITS } from "@/lib/templates/slots";

export interface ValidationResult {
    isValid: boolean;
    violations: string[];
}

// ANTIGRAVITY SPEC R2: STRICT BANNED LIST
const BANNED_WORDS = [
    "100% 보장", "무조건", "완치", // Exaggeration (Legal)
    "최고의", "환영합니다", "아늑한", // Old Clichés
    "신선한", "엄선된", "정성", "맛있는", // Generic Adjectives (Lazy Copy)
    "다양한", "저렴한", "친절한" // Generic Adjectives
];

export function validateSlots(
    slots: FlyerSlots,
    mandatoryInputs: { offer?: string, contact?: string }
): ValidationResult {
    const violations: string[] = [];
    const allText = [
        slots.HEADLINE,
        slots.SUBHEAD,
        ...slots.BENEFIT_BULLETS,
        slots.CTA,
        slots.INFO,
        slots.DISCLAIMER || ""
    ].join(" ");

    // 1. Critical Rules (Structure)
    // R2: No Ellipsis (Regex for 2 or more dots)
    const ellipsisRegex = /\.{2,}/;
    if (ellipsisRegex.test(allText)) violations.push("Contains ellipsis (..)");

    if (allText.includes("{{") || allText.includes("}}")) violations.push("Contains placeholders {{}}");
    if (allText.includes("undefined") || allText.includes("null")) violations.push("Contains undefined/null literal");

    // 2. Limit Check (Lenient + 10%)
    if (slots.HEADLINE.length > SLOT_LIMITS.HEADLINE * 1.5) violations.push(`HEADLINE too long (${slots.HEADLINE.length}/${SLOT_LIMITS.HEADLINE})`);

    // 3. Mandatory Input Check (Offer)
    if (mandatoryInputs.offer) {
        // Offer must be in PROMINENT slots (Head, Subhead, Bullets)
        const prominentText = [slots.HEADLINE, slots.SUBHEAD, ...slots.BENEFIT_BULLETS].join(" ");
        // Fuzzy inclusion check (simple string include for now)
        if (!prominentText.includes(mandatoryInputs.offer)) {
            violations.push(`Offer '${mandatoryInputs.offer}' missing from Headline/Subhead/Bullets`);
        }
    }

    // 4. Mandatory Input Check (Contact)
    if (mandatoryInputs.contact) {
        // Contact must be in INFO or CTA
        const contactVisible = (slots.INFO || "").includes(mandatoryInputs.contact) || (slots.CTA || "").includes(mandatoryInputs.contact);
        if (!contactVisible) {
            violations.push(`Contact '${mandatoryInputs.contact}' missing from INFO`);
        }
    }

    // 5. Banned Words (Gatekeeper)
    for (const banned of BANNED_WORDS) {
        if (allText.includes(banned)) {
            violations.push(`Contains banned word: ${banned}`);
        }
    }

    // 6. Empty Slots (Critical)
    if (!slots.HEADLINE.trim()) violations.push("Missing HEADLINE");
    if (!slots.CTA.trim()) violations.push("Missing CTA");
    if (slots.BENEFIT_BULLETS.length < 3) violations.push("Bullets < 3");

    return {
        isValid: violations.length === 0,
        violations
    };
}
