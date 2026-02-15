/**
 * System Sanitizer (Level 3 Integrity Layer)
 * 
 * Purpose: 
 * The Level 3 AI naturally produces structured, nested JSON (e.g., Objects for contacts, Arrays for details).
 * The current V0.9 Frontend strictly expects flat Strings.
 * This sanitizer acts as a compatibility bridge, recklessly flattening any non-string values into strings.
 */

// Flatten any value into a robust string representation
export function flattenToText(input: any): string {
    if (input === null || input === undefined) return "";
    if (typeof input === "string") return input;
    if (typeof input === "number" || typeof input === "boolean") return String(input);

    // Arrays: Join with newlines or commas
    if (Array.isArray(input)) {
        return input.map(i => flattenToText(i)).join("\n");
    }

    // Objects: Key-Value pairs
    if (typeof input === "object") {
        return Object.entries(input)
            .map(([k, v]) => {
                // Ignore keys that are metadata-like or redundant
                if (["id", "key", "type"].includes(k)) return flattenToText(v);
                const val = flattenToText(v);
                return val ? `${k}: ${val}` : "";
            })
            .filter(Boolean)
            .join(" | ");
    }

    return String(input);
}

import { FlyerType } from "@/types/flyer";

// Deeply walk input and enforce Schema strings
export function sanitizeVariant(variant: any, type: FlyerType): any {
    const clone = JSON.parse(JSON.stringify(variant));

    // LEAFLET Logic
    if (type === 'leaflet' && clone.pages) {
        if (Array.isArray(clone.pages)) {
            clone.pages.forEach((page: any) => {
                if (page.sections && Array.isArray(page.sections)) {
                    page.sections.forEach((sec: any) => {
                        if (sec.content) {
                            Object.keys(sec.content).forEach(k => {
                                // FORCE FLATTEN everything inside content
                                sec.content[k] = flattenToText(sec.content[k]);
                            });
                        }
                    });
                }
            });
        }
    } else {
        // FLYER / BROCHURE / POSTER Logic (Flat Structure)
        const textKeys = ['HEADLINE', 'SUBHEAD', 'CTA', 'INFO', 'DISCLAIMER'];
        textKeys.forEach(k => {
            if (clone[k]) clone[k] = flattenToText(clone[k]);
        });

        // Ensure Bullets are strictly string[]
        if (clone.BENEFIT_BULLETS) {
            if (Array.isArray(clone.BENEFIT_BULLETS)) {
                // [HARDENING] Procrustes Truncation: Force max 5
                clone.BENEFIT_BULLETS = clone.BENEFIT_BULLETS.slice(0, 5).map((b: any) => flattenToText(b));
            } else {
                clone.BENEFIT_BULLETS = [flattenToText(clone.BENEFIT_BULLETS)];
            }
        }
    }

    return clone;
}
