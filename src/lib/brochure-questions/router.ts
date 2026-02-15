// src/lib/brochure-questions/router.ts
import type {
    QuestionContext,
    QuestionPack,
    QuestionSpec,
    QuestionStep,
    ClaimPolicyMode,
} from "@/types/brochure-questions";

import { QUESTION_BANK } from "@/lib/brochure-questions/bank";

const STEPS: QuestionStep[] = [
    { stepId: "IDENTITY", title: "기본 정보", description: "브랜드/기관의 기본 표기 정보" },
    { stepId: "STORY", title: "스토리", description: "존재 이유/문제/서사(필요한 경우만)" },
    { stepId: "VALUE", title: "가치/제안", description: "무엇을 제공하고 왜 선택해야 하는지" },
    { stepId: "PROOF", title: "근거/신뢰", description: "증거/지표/인증/출처(Kind에 따라 다르게)" },
    { stepId: "CONTACT", title: "문의/행동", description: "연락/신청/다음 단계" },
    { stepId: "COMPLIANCE", title: "주의/고지", description: "엄격 모드에서 필수" },
];

function matchRequiredIf(ctx: QuestionContext, cond?: any): boolean {
    if (!cond) return true;

    if (cond.claimPolicyMode && cond.claimPolicyMode !== ctx.claimPolicyMode) return false;

    if (cond.kindIds && !cond.kindIds.includes(ctx.kindId)) return false;

    if (cond.blockTypes) {
        const has = ctx.selectedBlocks.some(b => cond.blockTypes.includes(b));
        if (!has) return false;
    }

    if (cond.moduleIdsAny) {
        const hasAny = cond.moduleIdsAny.some((m: string) => ctx.derivedModuleIds.includes(m));
        if (!hasAny) return false;
    }

    if (cond.moduleIdsAll) {
        const hasAll = cond.moduleIdsAll.every((m: string) => ctx.derivedModuleIds.includes(m));
        if (!hasAll) return false;
    }

    return true;
}

function shouldInclude(q: QuestionSpec, ctx: QuestionContext): boolean {
    // includeIf가 있으면 그 조건을 만족할 때만 포함
    if (q.includeIf && !matchRequiredIf(ctx, q.includeIf)) return false;

    // requiredIf는 "포함 + required 승격" 의미로 사용 (조건 불만족이면 포함은 가능하지만 required 아님)
    // 단, requiredIf만 있고 includeIf가 없으면 "조건 만족 시에만 포함"으로 처리하는 게 UX적으로 깔끔함
    if (q.requiredIf && !q.includeIf) {
        return matchRequiredIf(ctx, q.requiredIf);
    }

    return true;
}

function computeRequired(q: QuestionSpec, ctx: QuestionContext): boolean {
    const base = !!q.requiredBase;

    if (q.requiredIf && matchRequiredIf(ctx, q.requiredIf)) return true;

    // IndustryProfile의 requiredEvidence 강제
    if (ctx.requiredEvidence && ctx.requiredEvidence.length > 0) {
        const hasEvidenceMatch = ctx.requiredEvidence.some(ev =>
            q.title.includes(ev) ||
            q.tags.some(tag => ev.toLowerCase().includes(tag))
        );
        if (hasEvidenceMatch) return true;
    }

    // strict 모드에서는 compliance/proof 계열을 더 빡세게
    if (ctx.claimPolicyMode === "strict") {
        const strictBoost = q.tags.includes("compliance") || q.tags.includes("proof");
        if (strictBoost && q.depth >= 3) return true;
    }

    return base;
}

function stepForQuestion(q: QuestionSpec): QuestionStep["stepId"] {
    if (q.tags.includes("identity") || q.tags.includes("core")) return "IDENTITY";
    if (q.tags.includes("story")) return "STORY";
    if (q.tags.includes("value") || q.tags.includes("pricing") || q.tags.includes("process")) return "VALUE";
    if (q.tags.includes("proof") || q.tags.includes("market") || q.tags.includes("traction") || q.tags.includes("team")) return "PROOF";
    if (q.tags.includes("compliance")) return "COMPLIANCE";
    return "CONTACT";
}

function sortQuestions(a: QuestionSpec, b: QuestionSpec): number {
    // depth 우선, 그 다음 title
    if (a.depth !== b.depth) return a.depth - b.depth;
    return a.title.localeCompare(b.title);
}

export function buildQuestionPacks(ctx: QuestionContext): QuestionPack[] {
    const selected = QUESTION_BANK
        .filter(q => shouldInclude(q, ctx))
        .map(q => ({ ...q, requiredBase: computeRequired(q, ctx) })) // requiredBase를 최종 required로 사용
        .sort(sortQuestions);

    // step grouping
    const stepMap: Record<string, QuestionSpec[]> = {};
    for (const q of selected) {
        const sid = stepForQuestion(q);
        if (!stepMap[sid]) stepMap[sid] = [];
        stepMap[sid].push(q);
    }

    // pack 만들기(빈 step 제거)
    const packs: QuestionPack[] = [];
    for (const step of STEPS) {
        const questions = stepMap[step.stepId] ?? [];
        if (!questions.length) continue;
        packs.push({ step, questions });
    }

    // strict면 COMPLIANCE를 CONTACT 앞에 두는게 보통 더 안전
    if (ctx.claimPolicyMode === "strict") {
        packs.sort((a, b) => {
            const order = ["IDENTITY", "STORY", "VALUE", "PROOF", "COMPLIANCE", "CONTACT"];
            return order.indexOf(a.step.stepId) - order.indexOf(b.step.stepId);
        });
    }

    return packs;
}

/**
 * 라우터를 쓸 때 "기본 blocks"가 없을 수 있어 안정적으로 채움
 */
export function normalizePolicyMode(mode?: ClaimPolicyMode): ClaimPolicyMode {
    return mode === "strict" ? "strict" : "standard";
}
