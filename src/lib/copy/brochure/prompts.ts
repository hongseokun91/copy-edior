// src/lib/copy/brochure/prompts.ts
import type {
    BrochureInput,
    FactsRegistry,
    BrochurePageRole,
    BrochurePageId,
    BrochureModuleSpec,
    BrochureBlockType,
} from "../../../types/brochure";
import { type BrochureKindSpec } from "../../brochure-kinds";

export const BROCHURE_SYSTEM_PROMPT = `
You are the Chief Copywriter at a top Korean Marketing Agency.
Your job is to generate PROFESSIONAL, PRINT-READY brochure copy.
STRICT RULES:
-[LANGUAGE] Output MUST be Korean (한국어). English only for proper nouns / brand names if necessary.
- No placeholders. No "..." ellipsis. No TODO. No brackets like [입력].
- Keep claims realistic. Avoid exaggerated guarantees.
- Output format: STRICT JSON wrapped with <JSON> ... </JSON>.
    - Follow slot char limits strictly. If too long, compress without losing meaning.
`.trim();

export function brochureFormatSpecification(format: "A4" | "A5") {
    const pageTextGuideline =
        format === "A4"
            ? "A4 기준: 페이지당 섹션 2~4개, 불릿은 섹션당 3~5개 이내 권장."
            : "A5 기준: 페이지당 섹션 1~3개, 불릿은 섹션당 2~4개 이내 권장.";

    return `
[PRINT SPEC]
- Format: ${format}
- Tone: brochure-grade (not flyer-grade)
- Do not overpack text. Use hierarchy (title -> short paragraphs / bullets).

[TEXT DENSITY]
- ${pageTextGuideline}
- Narrative pages must have 2~4 short paragraphs rather than many bullets.
- Value pages must have clear hierarchy and compact, factual phrasing.

[COMPLIANCE]
- Do NOT claim 100% / guaranteed / always / perfect.
- If numbers / periods are uncertain, label as "추정" or "예시" or omit.
`.trim();
}

export function buildFactsPrompt(input: BrochureInput, kind: BrochureKindSpec): string {
    return `
[GOAL]
Create a Facts Registry (SSOT) for a brochure. This must be stable and consistent across all pages.

[KIND]
- kindId: ${kind.id}
- label: ${kind.label}
- claimPolicyMode: ${kind.claimPolicyMode}

[INPUT JSON]
${JSON.stringify(input, null, 2)}

[REQUIREMENTS]
- Output MUST be a JSON object matching FactsRegistry fields.
- If a field is unknown, omit it or set empty array. Do NOT invent specific numbers, dates, certifications, client names.
- Keep language professional, concise.

[IMPORTANT]
- brandName must equal input.brandName.
- contact fields must reflect input (if present), never fabricate.

[OUTPUT]
Return ONLY:
<JSON>
{ ...FactsRegistry }
</JSON>
`.trim();
}

export function buildBlockPlanPrompt(params: {
    input: BrochureInput;
    kind: BrochureKindSpec;
    level?: number;
    requestedBlocks?: BrochureBlockType[];
}): string {
    const { input, kind, level, requestedBlocks } = params;

    const requested =
        requestedBlocks && requestedBlocks.length > 0
            ? `- 사용자가 직접 선택한 블록 우선: ${requestedBlocks.join(", ")}`
            : `- 시스템 기본 추천 블록 사용 (Kind: ${kind.id})`;

    const narrativeLevel = level || 1;
    const narrativeGuide = [
        "LEVEL 1 (4P - CORE): 핵심 가치와 존재 이유 중심의 압축적 서사 (표지-문제-솔루션-판촉)",
        "LEVEL 2 (8P - PROOF): 상세 스펙, 인증, 팀 프로필 등 신뢰 강화 서사 (1단계 + 디테일)",
        "LEVEL 3 (12P - CASES): 실제 사례, 에코시스템, 로드맵 등 깊이 있는 서사 (2단계 + 실적/미래)",
        "LEVEL 4 (16P - ENTERPRISE): 글로벌 비전, 지배구조, 기술 백서 등 엔터프라이즈 전문 서사"
    ][Math.min(narrativeLevel - 1, 3)];

    const audienceInfo = input.audience
        ? `타겟 독자: ${input.audience} (이에 맞춘 전문 용어와 톤앤매너 필수)`
        : `타겟 독자: 일반 (Kind 기본값 사용)`;

    const stageInfo = input.stage
        ? `비즈니스 단계: ${input.stage} (인지/고려/결정 단계 매핑)`
        : "";

    return `
# 브로슈어 구성 계획 (Block Planner)
당신은 기업용 고품질 브로슈어를 설계하는 수석 에디터입니다.
주어진 산업군/업종/독자 컨텍스트를 분석하여 최적의 블록(Block) 구성을 제안하세요.

## 1. 컨텍스트 분석
- 업종(Industry): ${JSON.stringify(input.industryContext || {})}
- 목적(Intent): ${input.intentId || kind.id}
- ${audienceInfo}
- ${stageInfo}
- 서사 레벨: ${narrativeGuide}

## 2. 필수 지침
- 총 페이지 수: ${input.totalPages || (narrativeLevel * 4)}P 에 맞춰 블록을 배치하세요.
- 각 페이지는 좌/우 펼침면(Spread)을 고려하여 논리적으로 연결되어야 합니다.
- ${requested}
- 각 블록의 ID는 'BLOCK_'으로 시작하는 유효한 ID여야 합니다. (BLOCK_FRONT_IDENTITY, BLOCK_BACK_TRUST_CONTACT 필수)

## 3. 출력 형식 (JSON)
Return ONLY:
<JSON>
{
  "plannedBlocks": [
    { "type": "BLOCK_FRONT_IDENTITY", "pageIndex": 0 },
    ...
    { "type": "BLOCK_BACK_TRUST_CONTACT", "pageIndex": n }
  ],
  "narrativeStrategy": "이 브로슈어의 전체적인 서사 흐름 요약"
}
</JSON>
`.trim();
}

export function roleMandates(role: BrochurePageRole, claimPolicyMode: "standard" | "strict") {
    const strictLine =
        claimPolicyMode === "strict"
            ? "- STRICT: Avoid absolutes (무조건/100%/완벽/절대). If uncertain, qualify or omit.\n"
            : "";

    switch (role) {
        case "ROLE_COVER":
            return `
[ROLE: COVER]
- One strong promise line + identity.
- Short, premium phrasing. No clutter.
${strictLine}`.trim();

        case "ROLE_NARRATIVE":
            return `
[ROLE: NARRATIVE]
- Prioritize narrative paragraphs over bullets.
- 2~4 short paragraphs recommended.
- No bullet spam (max 6 bullets across the page).
${strictLine}`.trim();

        case "ROLE_VALUE":
            return `
[ROLE: VALUE]
- Prioritize hierarchy and specificity.
- Use compact factual bullets; if specs exist, present as structured items.
- Avoid vague adjectives without proof.
${strictLine}`.trim();

        case "ROLE_PROOF":
            return `
[ROLE: PROOF]
- Focus on evidence: metrics, certifications, references, defined outcomes.
- If proof is missing, say it cautiously or omit; do NOT fabricate.
${strictLine}`.trim();

        case "ROLE_ACTION":
            return `
[ROLE: ACTION]
- Must include next-step guidance and contact lines.
- Include notices / disclaimers if relevant.
${strictLine}`.trim();

        default:
            return "";
    }
}

export function buildPagePrompt(args: {
    input: BrochureInput;
    kind: BrochureKindSpec;
    facts: FactsRegistry;
    pageId: string;
    role: BrochurePageRole;
    moduleSpecs: BrochureModuleSpec[];
    additionalGuidance?: string;
}): string {
    const { input, kind, facts, pageId, role, moduleSpecs, additionalGuidance } = args;

    return `
[GOAL]
Fill module slots for ONE brochure page.

[KIND]
- kindId: ${kind.id}
- label: ${kind.label}
- claimPolicyMode: ${kind.claimPolicyMode}

${brochureFormatSpecification(input.format)}

[PAGE]
- pageId: ${pageId}
- role: ${role}

[ROLE MANDATES]
${roleMandates(role, kind.claimPolicyMode)}

[FACTS REGISTRY (SSOT)]
You MUST keep these facts consistent. Do not alter numbers / contacts / brandName.
${JSON.stringify(facts, null, 2)}

[PAGE INPUT (context)]
${JSON.stringify(
        {
            industryContext: input.industryContext,
            intentId: input.intentId,
            audience: input.audience,
            stage: input.stage,
            brandTone: input.brandTone,
            problemStatement: input.problemStatement,
            brandStory: input.brandStory,
            productsOrServices: input.productsOrServices,
            caseStudies: input.caseStudies,
        },
        null,
        2
    )}

[MODULES TO FILL]
For each module, output slots respecting maxChars / maxItems. If unknown, output empty string or empty array (do NOT invent).
${JSON.stringify(moduleSpecs, null, 2)}

${additionalGuidance ? `[ADDITIONAL GUIDANCE]\n${additionalGuidance}\n` : ""}

[OUTPUT]
Return ONLY:
<JSON>
{
    "modules": [
        {
            "moduleId": "MOD_...",
            "slots": { ... }
        }
    ]
}
</JSON>
`.trim();
}
