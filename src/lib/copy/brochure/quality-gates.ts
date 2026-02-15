// src/lib/copy/brochure/quality-gates.ts
import type {
    BrochureOutput,
    BrochurePageId,
    BrochureModuleSpec,
    BrochurePageRole,
    FactsRegistry,
} from "../../../types/brochure";
import { BROCHURE_MODULES } from "../../brochure-modules";
import { type BrochureKindSpec } from "../../brochure-kinds";
import { scrubPlaceholders } from "./sanitizer";

export type GateSeverity = "error" | "warn";

export interface QualityWarning {
    severity: GateSeverity;
    code: string;
    message: string;
    pageId?: BrochurePageId;
    moduleId?: string;
    slotKey?: string;
    detail?: any;
}

export interface QualityGateResult {
    ok: boolean;
    errors: QualityWarning[];
    warnings: QualityWarning[];
}

const DEFAULT_BANNED_STRICT = [
    "100%",
    "무조건",
    "완벽",
    "절대",
    "보장",
    "전부",
    "항상",
    "즉시 효과",
    "단번에",
    "무해",
    "부작용 없음",
];

const DEFAULT_PLACEHOLDER_PATTERNS = [
    /\.\.\./g,
    /\bTODO\b/gi,
    /\bTBD\b/gi,
    /\[.*?\]/g, // [입력] 등
    /미정/g,
];

function moduleSpecMap() {
    const map = new Map<string, BrochureModuleSpec>();
    for (const m of BROCHURE_MODULES) map.set(m.id, m);
    return map;
}

function normalizeText(s: string): string {
    return s
        .replace(/\s+/g, " ")
        .replace(/[“”"'’]/g, "")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .toLowerCase()
        .trim();
}

// 간단한 문자 기반 유사도(0~1). 브로슈어 중복 감지용.
export function trigramSimilarity(a: string, b: string): number {
    const A = normalizeText(a);
    const B = normalizeText(b);
    if (!A || !B) return 0;

    const grams = (t: string) => {
        const g: string[] = [];
        const s = t.replace(/\s+/g, "");
        for (let i = 0; i < Math.max(0, s.length - 2); i++) g.push(s.slice(i, i + 3));
        return g;
    };

    const ga = grams(A);
    const gb = grams(B);
    if (ga.length === 0 || gb.length === 0) return 0;

    const setA = new Map<string, number>();
    for (const x of ga) setA.set(x, (setA.get(x) ?? 0) + 1);

    let inter = 0;
    const setB = new Map<string, number>();
    for (const x of gb) setB.set(x, (setB.get(x) ?? 0) + 1);

    for (const [k, va] of setA.entries()) {
        const vb = setB.get(k) ?? 0;
        inter += Math.min(va, vb);
    }
    return (2 * inter) / (ga.length + gb.length);
}

function collectPageText(output: BrochureOutput, pageId: BrochurePageId): string {
    const page = output.pages[pageId];
    if (!page) return "";
    let out = "";
    for (const m of page.modules) {
        const slots = m.slots ?? {};
        for (const v of Object.values(slots)) {
            if (typeof v === "string") out += v + "\n";
            else if (Array.isArray(v)) out += v.filter(x => typeof x === "string").join("\n") + "\n";
            else if (v && typeof v === "object") out += JSON.stringify(v) + "\n";
        }
    }
    return out.trim();
}

function findPhoneCandidates(text: string): string[] {
    // 한국 전화번호 대략 패턴
    const matches = text.match(/\b(0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4})\b/g);
    return matches ? Array.from(new Set(matches.map(x => x.replace(/\s+/g, "").trim()))) : [];
}

function factsPhoneNormalized(facts: FactsRegistry): string | null {
    if (!facts.contactPhone) return null;
    return facts.contactPhone.replace(/\s+/g, "").trim();
}

function containsPlaceholder(text: string): boolean {
    return DEFAULT_PLACEHOLDER_PATTERNS.some(r => r.test(text));
}

function getAllPageIds(output: BrochureOutput): BrochurePageId[] {
    return Object.keys(output.pages).sort((a, b) => {
        const na = parseInt(a.replace("P", ""), 10);
        const nb = parseInt(b.replace("P", ""), 10);
        return na - nb;
    }) as BrochurePageId[];
}

export function runQualityGates(args: {
    output: BrochureOutput;
    kind: BrochureKindSpec;
    similarityThreshold?: number; // 중복 경고 기준(권장 0.78)
}): QualityGateResult {
    const { output, kind, similarityThreshold = 0.78 } = args;

    const errors: QualityWarning[] = [];
    const warnings: QualityWarning[] = [];

    const specById = moduleSpecMap();
    const pageIds = getAllPageIds(output);

    // 1) 구조/모듈 스펙 검증
    for (const pageId of pageIds) {
        const page = output.pages[pageId];
        if (!page) continue;

        for (const mod of page.modules) {
            const spec = specById.get(mod.moduleId);
            if (!spec) {
                warnings.push({
                    severity: "warn",
                    code: "MODULE_UNKNOWN",
                    message: `정의되지 않은 모듈이 사용됨: ${mod.moduleId}`,
                    pageId,
                    moduleId: mod.moduleId,
                });
                continue;
            }

            const slots = mod.slots ?? {};
            for (const slotSpec of spec.slots) {
                const v = slots[slotSpec.key];

                if (slotSpec.required && (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0))) {
                    warnings.push({
                        severity: "warn",
                        code: "SLOT_REQUIRED_MISSING",
                        message: `필수 슬롯 누락: ${slotSpec.key}`,
                        pageId,
                        moduleId: mod.moduleId,
                        slotKey: slotSpec.key,
                    });
                }

                if (typeof v === "string") {
                    if (slotSpec.maxChars && v.length > slotSpec.maxChars) {
                        warnings.push({
                            severity: "warn",
                            code: "SLOT_CHAR_LIMIT_EXCEEDED",
                            message: `글자수 초과(${slotSpec.maxChars}) 슬롯: ${slotSpec.key}`,
                            pageId,
                            moduleId: mod.moduleId,
                            slotKey: slotSpec.key,
                            detail: { len: v.length, max: slotSpec.maxChars },
                        });
                    }
                    if (containsPlaceholder(v)) {
                        errors.push({
                            severity: "error",
                            code: "PLACEHOLDER_FOUND",
                            message: `플레이스홀더/금지 패턴 발견: ${slotSpec.key}`,
                            pageId,
                            moduleId: mod.moduleId,
                            slotKey: slotSpec.key,
                            detail: v,
                        });
                    }
                } else if (Array.isArray(v)) {
                    if (slotSpec.maxItems && v.length > slotSpec.maxItems) {
                        warnings.push({
                            severity: "warn",
                            code: "SLOT_ITEMS_EXCEEDED",
                            message: `아이템 수 초과(${slotSpec.maxItems}) 슬롯: ${slotSpec.key}`,
                            pageId,
                            moduleId: mod.moduleId,
                            slotKey: slotSpec.key,
                            detail: { len: v.length, max: slotSpec.maxItems },
                        });
                    }
                    if (slotSpec.type === "string[]" && slotSpec.maxChars) {
                        v.forEach((it, idx) => {
                            if (typeof it === "string" && it.length > slotSpec.maxChars!) {
                                warnings.push({
                                    severity: "warn",
                                    code: "SLOT_ITEM_CHAR_LIMIT_EXCEEDED",
                                    message: `배열 아이템 글자수 초과(${slotSpec.maxChars}) 슬롯: ${slotSpec.key}[${idx}]`,
                                    pageId,
                                    moduleId: mod.moduleId,
                                    slotKey: slotSpec.key,
                                    detail: { idx, len: it.length, max: slotSpec.maxChars },
                                });
                            }
                            if (typeof it === "string" && containsPlaceholder(it)) {
                                errors.push({
                                    severity: "error",
                                    code: "PLACEHOLDER_FOUND",
                                    message: `플레이스홀더/금지 패턴 발견: ${slotSpec.key}[${idx}]`,
                                    pageId,
                                    moduleId: mod.moduleId,
                                    slotKey: slotSpec.key,
                                    detail: it,
                                });
                            }
                        });
                    }
                }
            }
        }
    }

    // 2) 과장/금칙어
    const banned = DEFAULT_BANNED_STRICT;
    for (const pageId of pageIds) {
        const t = collectPageText(output, pageId);
        if (!t) continue;

        for (const w of banned) {
            if (t.includes(w)) {
                const finding: QualityWarning = {
                    severity: kind.claimPolicyMode === "strict" ? "error" : "warn",
                    code: "BANNED_CLAIM",
                    message: `과장/금칙 표현 감지: "${w}"`,
                    pageId,
                    detail: { word: w },
                };
                (finding.severity === "error" ? errors : warnings).push(finding);
            }
        }
    }

    // 3) Facts 일관성
    const brand = output.facts?.brandName?.trim();
    if (!brand) {
        errors.push({
            severity: "error",
            code: "FACTS_MISSING_BRAND",
            message: "FactsRegistry.brandName 누락",
        });
    } else {
        for (const pageId of pageIds) {
            const t = collectPageText(output, pageId);
            const role = output.pages[pageId]?.role as BrochurePageRole | undefined;
            if (role === "ROLE_COVER" && t && !t.includes(brand)) {
                warnings.push({
                    severity: "warn",
                    code: "BRAND_NOT_ON_COVER",
                    message: "표지 페이지에 브랜드명(brandName)이 명시되지 않음",
                    pageId,
                    detail: { brandName: brand },
                });
            }
        }
    }

    const factsPhone = factsPhoneNormalized(output.facts);
    if (factsPhone) {
        for (const pageId of pageIds) {
            const t = collectPageText(output, pageId);
            const phones = findPhoneCandidates(t);
            for (const p of phones) {
                if (p && !factsPhone.includes(p) && !p.includes(factsPhone)) {
                    warnings.push({
                        severity: "warn",
                        code: "PHONE_INCONSISTENT",
                        message: `FactsRegistry와 다른 전화번호가 감지됨: ${p}`,
                        pageId,
                        detail: { factsPhone, found: p },
                    });
                }
            }
        }
    }

    // 4) 중복/단조
    const texts = pageIds.map(pid => ({ pid, text: collectPageText(output, pid) }));
    for (let i = 0; i < texts.length; i++) {
        for (let j = i + 1; j < texts.length; j++) {
            const a = texts[i];
            const b = texts[j];
            if (!a.text || !b.text) continue;

            const sim = trigramSimilarity(a.text, b.text);
            if (sim >= similarityThreshold) {
                warnings.push({
                    severity: "warn",
                    code: "PAGE_DUPLICATION",
                    message: `페이지 내용이 유사합니다(유사도 ${sim.toFixed(2)}): ${a.pid} ↔ ${b.pid}`,
                    pageId: a.pid,
                    detail: { otherPageId: b.pid, similarity: sim },
                });
            }
        }
    }

    // 5) 텍스트 밀도
    for (const pageId of pageIds) {
        const page = output.pages[pageId];
        if (!page) continue;

        let bulletCount = 0;
        let longSentenceStreak = 0;

        for (const mod of page.modules) {
            const slots = mod.slots ?? {};
            for (const v of Object.values(slots)) {
                if (Array.isArray(v)) {
                    bulletCount += v.filter(x => typeof x === "string" && x.trim().length > 0).length;
                } else if (typeof v === "string") {
                    const parts = v.split(/[.!?。\n]/).map(s => s.trim()).filter(Boolean);
                    for (const p of parts) {
                        if (p.length >= 45) longSentenceStreak++;
                        else longSentenceStreak = 0;
                        if (longSentenceStreak >= 3) {
                            warnings.push({
                                severity: "warn",
                                code: "DENSITY_LONG_SENTENCES",
                                message: "긴 문장이 연속 3개 이상입니다(브로슈어 가독성 저하)",
                                pageId,
                                detail: { example: p.slice(0, 80) },
                            });
                            longSentenceStreak = 0;
                            break;
                        }
                    }
                }
            }
        }

        if (bulletCount > 9) {
            warnings.push({
                severity: "warn",
                code: "DENSITY_TOO_MANY_BULLETS",
                message: `불릿이 과다합니다(${bulletCount}개). 브로슈어는 서술/계층을 우선하세요.`,
                pageId,
                detail: { bulletCount },
            });
        }

        if (page.role === "ROLE_NARRATIVE" && bulletCount > 6) {
            warnings.push({
                severity: "warn",
                code: "NARRATIVE_BULLET_SPAM",
                message: `내러티브 페이지에 불릿이 과다합니다(${bulletCount}개). 문단형으로 전환 권장.`,
                pageId,
                detail: { bulletCount },
            });
        }
    }

    const ok = errors.length === 0;
    return { ok, errors, warnings };
}
