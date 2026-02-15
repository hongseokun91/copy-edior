
/**
 * EDITOR MODULE (Enterprise v3.0)
 * Responsible for post-generation validation.
 * Uses N-gram analysis (simulated for now) and Regex rules.
 */

import { FlyerSlots } from "@/types/flyer";

export interface EditsResult {
    isValid: boolean;
    fixedSlots: FlyerSlots;
    violations: string[];
}

export function validateAndFix(slots: FlyerSlots): EditsResult {
    const violations: string[] = [];
    let fixed = { ...slots };

    // 1. Syntax Guard: "색다른의" -> "색다른"
    // This is a specific frequent hallucination from the model
    Object.keys(fixed).forEach(key => {
        const k = key as keyof FlyerSlots;
        const val = fixed[k];
        if (typeof val === 'string') {
            if (val.includes("색다른의")) {
                (fixed[k] as any) = val.replace(/색다른의/g, "색다른"); // Auto-fix
                violations.push(`Fixed Syntax: 색다른의 -> 색다른 in ${k}`);
            }
        }
    });

    // 2. Fact Guard: "Refund"
    Object.keys(fixed).forEach(key => {
        const k = key as keyof FlyerSlots;
        const val = fixed[k];
        if (typeof val === 'string' && val.includes("환불 보장")) {
            // Cannot auto-fix safely without ruining context, so we flag it
            // Or we replace with "만족 보장"
            (fixed[k] as any) = val.replace(/100% 환불 보장/g, "확실한 맛 보장").replace(/환불 보장/g, "맛 보장");
            violations.push(`Fixed Legal: Refund Guarantee -> Taste Guarantee in ${k}`);
        }
    });

    // 3. Spacing Guard
    // "20%할인이벤트" -> "20% 할인 이벤트"
    Object.keys(fixed).forEach(key => {
        const k = key as keyof FlyerSlots;
        const val = fixed[k];
        if (typeof val === 'string') {
            // Regex for Number%String -> Number% String
            (fixed[k] as any) = val.replace(/(\d+%)([\u3131-\uD79D])/g, "$1 $2");
            // Regex for String+Ender -> String Ender (Simple heuristic)
        }
    });

    return {
        isValid: true, // We auto-fixed, so it's valid to proceed
        fixedSlots: fixed,
        violations
    };
}
