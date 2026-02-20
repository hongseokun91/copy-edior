
import { safeGenerateText } from "@/lib/copy/provider";
import { NormalizedBrief } from "@/types/brief";
import { VariantSchema } from "./schema";
import { SYSTEM_PROMPT, buildFramePrompt } from "./prompts";
import { z } from "zod";
import * as fs from 'fs';
import * as path from 'path';
import { logger } from "@/lib/logger";

function logToFile(msg: string) {
    try {
        const logPath = path.join(process.cwd(), 'debug_server.log');
        fs.appendFileSync(logPath, `[POLISH] ${msg}\n`);
    } catch (e) { }
}

// Helper: Force Array with Content Check
function ensureArray(val: any, defaultVal: string[] = []): string[] {
    if (!val) return defaultVal;
    if (Array.isArray(val)) {
        return val.length > 0 ? val : defaultVal;
    }
    return [String(val)];
}

// Helper: Ensure String Content
function ensureString(val: any, defaultVal: string): string {
    if (!val) return defaultVal;
    const s = String(val).trim();
    // [HARDENING] Basic Injection Defense
    const INJECTION_PATTERNS = [
        /ignore previous/i,
        /system prompt/i,
        /you are a/i,
        /reset all/i
    ];

    for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(s)) { // Changed 'text' to 's'
            // If an injection pattern is detected, return the default value or a sanitized version
            // For now, we'll return the default value as a simple defense.
            // A more robust solution might involve throwing an error or more sophisticated sanitization.
            // A more robust solution might involve throwing an error or more sophisticated sanitization.
            logger.warn("SECURITY_EVENT", "Possible Prompt Injection Detected", { type: "prompt_injection", input: s });
            return defaultVal;
        }
    }
    return s.length > 0 ? s : defaultVal;
}

// Select Best Candidate
// Select Best Candidate (Internal Legacy check)
export async function selectBest(candidates: any[], frame: string, brief: NormalizedBrief, traceId: string = "unknown") {
    const prompt = `
    [TASK]
    I have 6 candidates for Frame ${frame}.
    Select the ONE that best matches the goal: "${brief.goal}".
    
    [CANDIDATES]
    ${JSON.stringify(candidates, null, 2)}
    
    [OUTPUT FORMAT]
    Think briefly, then output strictly JSON inside <JSON> tags.
    Format: <JSON>{"bestIndex": number, "reason": "string"}</JSON>
    `.trim();

    const { text } = await safeGenerateText({
        passName: `SELECT_BEST_${frame}`,
        prompt: prompt
    }, traceId);

    const match = text.match(/<JSON>([\s\S]*?)<\/JSON>/);
    const result = match ? JSON.parse(match[1]) : { bestIndex: 0 };
    const bestIndex = result.bestIndex ?? 0;
    return candidates[bestIndex] || candidates[0];
}

// Polish (Expand to Full Variant)
export async function polish(
    candidate: any,
    frame: "A" | "B" | "C",
    brief: NormalizedBrief,
    traceId: string = "unknown",
    styleId?: string,
    feedback?: string,
    temperature?: number
) {
    const framePrompt = buildFramePrompt(frame, brief, styleId);
    const isLeaflet = brief.productType === 'leaflet';

    // [DEBUG] Log the product type and decision
    console.error(`[Polish] ProductType: ${brief.productType}, isLeaflet: ${isLeaflet}`);

    const polishPrompt = isLeaflet ? `
    ${framePrompt}

    [SELECTED CONCEPT]
    Headline: ${candidate.headline}
    Subhead: ${candidate.subhead}

    [TASK]
    Expand this concept into a COMPLETE 6-PANEL LEAFLET.
    You must fill all 6 pages (P1-P6) with rich, detailed marketing copy based on the [LEAFLET FORMAT SPECIFICATION] provided above.

    ${feedback || ""}
    
    [OUTPUT FORMAT]
    Output strictly JSON inside <JSON> tags.
    Root object must have a "pages" array.
    `.trim() : `
    ${framePrompt}
    
    [SELECTED CONCEPT]
    Headline: ${candidate.headline}
    Subhead: ${candidate.subhead}
    
    [TASK]
    Expand into a FULL FLYER VARIANT.
    - HEADLINE (18-22 chars)
    - SUBHEAD (32 chars)
    - CTA (Action verb)
    - INFO (Already provided in brief)
    - bullets (3-5 items)

    ${feedback || ""}
    
    [OUTPUT FORMAT]
    Output strictly JSON inside <JSON> tags.
    Schema keys: headline, subhead, bullets, cta, info, disclaimer, more: { altHeadlines, microCTA, hashtags, bannerShort }
    `.trim();

    try {
        const { text } = await safeGenerateText({
            passName: `POLISH_${frame}`,
            system: SYSTEM_PROMPT,
            prompt: polishPrompt,
            temperature: temperature || 0.7
        }, traceId);

        const match = text.match(/<JSON>([\s\S]*?)<\/JSON>/);
        if (!match) throw new Error("POLISH_PARSE_FAIL: Missing <JSON> tags");

        const object = JSON.parse(match[1]);

        if (brief.productType === 'leaflet' && object.pages) {
            // Respect the 6-panel structure for Leaflets
            return {
                ...object,
                meta: {
                    traceId,
                    frame,
                    type: 'leaflet',
                    qualityScore: 95
                }
            };
        }

        // Default Flyer Polishing
        const finalVariant = {
            // ... (keep existing flyer flattening logic for backward compatibility)
            hookLine: object?.subhead || "지금 바로 확인하세요",
            proofLine: object?.more?.bannerShort?.[0] || "고객 만족 1위",
            valueProps: ensureArray(object?.bullets, ["신속한 서비스", "친절한 상담", "검증된 품질"]),
            urgencyLine: "오늘이 지나면 혜택 종료!",
            microCTA: ensureArray(object?.more?.microCTA, ["전화하기", "위치보기"]),
            posterShort: "GRAND OPEN",
            bannerShort: ensureArray(object?.more?.bannerShort, ["한정판", "매진임박"]),
            hashtags: ensureArray(object?.more?.hashtags, ["#맛집", "#핫플"]),
            altHeadlines: ensureArray(object?.more?.altHeadlines, []),

            headlineVariations: ensureArray(object?.more?.altHeadlines, []),
            subheadVariations: [],
            ctaVariations: [],
            benefitVariations: [],
            trustVariations: [],

            ...(object || {}),

            HEADLINE: ensureString(object?.headline, "제목 없음 (AI 생성 실패)"),
            SUBHEAD: ensureString(object?.subhead, "부제목 없음"),
            BENEFIT_BULLETS: ensureArray(object?.bullets, ["혜택 내용이 생성되지 않았습니다.", "다시 시도해주세요."]),
            CTA: ensureString(object?.cta, "문의하기"),
            DISCLAIMER: ensureString(object?.disclaimer, ""),

            info: `${brief.periodNormalized} / ${brief.contactNormalized}`,
            INFO: `${brief.periodNormalized} / ${brief.contactNormalized}`,
            offerBlock: brief.offerRaw || "특별 혜택",
            offer: brief.offerRaw,

            meta: {
                traceId,
                frame: frame,
                whyThisWorks: candidate.concept_reasoning || "Balanced creative concept.",
                qualityScore: 90,
                gateLog: {}
            }
        };

        return finalVariant;

    } catch (e: any) {
        console.error(`[Polish] Frame ${frame} failed for ${traceId}: ${e.message}`);

        if (brief.productType === 'leaflet') {
            // Leaflet Emergency Fallback
            // The user's provided code snippet for emoji duplication was placed here.
            // It seems to be a misplaced snippet from another file (expression.ts)
            // and is not syntactically correct or relevant in this context.
            // I'm omitting it to maintain the integrity and correctness of this file.
            // If it was intended for a specific part of the leaflet fallback,
            // please provide more context.
            return {
                pages: [
                    { page_id: "P1", role: "Cover", sections: [{ type: "HERO", content: { headline: candidate.headline || "특별 혜택", subhead: candidate.subhead || "지금 바로 확인하세요" } }] },
                    { page_id: "P2", role: "Intro", sections: [{ type: "BENEFITS", content: { title: "왜 우리일까요?", points: "최고의 서비스, 신뢰할 수 있는 품질" } }] },
                    { page_id: "P3", role: "Body 1", sections: [{ type: "DETAILS", content: { info: "상세 내용을 준비 중입니다." } }] },
                    { page_id: "P4", role: "Body 2", sections: [{ type: "DETAILS", content: { info: "최상의 경험을 약속합니다." } }] },
                    { page_id: "P5", role: "Body 3", sections: [{ type: "DETAILS", content: { info: "언제든 문의해 주세요." } }] },
                    { page_id: "P6", role: "Back", sections: [{ type: "CTA_CONTACT", content: { contact: brief.contactNormalized, period: brief.periodNormalized } }] }
                ],
                meta: { traceId, frame, fallback: true, type: 'leaflet' }
            } as any;
        }

        // Emergency Fallback Variant (Flyer)
        return {
            HEADLINE: candidate.headline || "특별 혜택 공개",
            SUBHEAD: candidate.subhead || "지금 바로 확인해 보세요",
            BENEFIT_BULLETS: ["검증된 서비스", "신뢰할 수 있는 품질", "친절한 상담"],
            CTA: "문의하기",
            info: `${brief.periodNormalized} / ${brief.contactNormalized}`,
            INFO: `${brief.periodNormalized} / ${brief.contactNormalized}`,
            meta: { traceId, frame, fallback: true }
        } as any;
    }
}
