// src/lib/brochure-matcher.ts
import { INDUSTRY_TAXONOMY } from "./brochure-industry";
import { INDUSTRY_PROFILES } from "./brochure-profiles";
import { IndustryProfile, BrochureIntentId, IndustryL1 } from "@/types/brochure";

export interface MatchResult {
    profile: IndustryProfile;
    confidence: number;
    reasons: string[];
}

/**
 * Enterprise Semantic Matcher
 * Maps raw user query or selection to the most appropriate Industry x Intent profile.
 */
export function matchIndustryProfile(
    query: string,
    intentHint?: BrochureIntentId
): MatchResult[] {
    const normalizedQuery = query.toLowerCase().trim();
    const results: MatchResult[] = [];

    for (const profile of INDUSTRY_PROFILES) {
        let confidence = 0;
        const reasons: string[] = [];

        // 1. Intent Matching (High Weight)
        if (intentHint && profile.intent === intentHint) {
            confidence += 0.4;
            reasons.push(`문서 목적(${intentHint}) 일치`);
        }

        // 2. Keyword Matching in Industry Label/L2/L3
        const industryDef = INDUSTRY_TAXONOMY.find(d => d.l1 === profile.industry.l1);
        const l2Item = industryDef?.l2Items.find(i => i.id === profile.industry.l2);

        const searchPool = [
            industryDef?.label,
            l2Item?.label,
            profile.industry.l3,
            ...(l2Item?.l3Items || [])
        ].filter(Boolean).map(s => s!.toLowerCase());

        const hasKeywordMatch = searchPool.some(term => normalizedQuery.includes(term) || term.includes(normalizedQuery));

        if (hasKeywordMatch) {
            confidence += 0.5;
            reasons.push(`산업군 키워드('${normalizedQuery}') 매칭 성공`);
        }

        if (confidence > 0) {
            results.push({ profile, confidence, reasons });
        }
    }

    return results.sort((a, b) => b.confidence - a.confidence);
}
