// src/tests/verify_brochure_kind_coverage.test.ts
import { describe, it, expect } from "vitest";
import { generateBrochure, type LLMClient } from "../lib/copy/brochure/engine";
import { BROCHURE_KINDS } from "../lib/brochure-kinds";

function mockLLM(): LLMClient {
    return {
        generate: async ({ prompt }) => {
            if (prompt.includes("Create a Facts Registry")) {
                const brandName = /"brandName":\s*"([^"]+)"/.exec(prompt)?.[1] ?? "브랜드";
                const phone = /"contactPhone":\s*"([^"]+)"/.exec(prompt)?.[1] ?? "010-1234-5678";
                const email = /"contactEmail":\s*"([^"]+)"/.exec(prompt)?.[1] ?? "hello@example.com";
                return `<JSON>${JSON.stringify({ brandName, contactPhone: phone, contactEmail: email, legalNotices: [] })}</JSON>`;
            }

            if (prompt.includes("Create a 4-page block plan")) {
                // 모든 kind에서 최소: Front + Back
                return `<JSON>${JSON.stringify({
                    blocks: [{ type: "BLOCK_FRONT_IDENTITY", title: "Front" }, { type: "BLOCK_BACK_TRUST_CONTACT", title: "Back" }],
                })}</JSON>`;
            }

            // page
            const moduleSpecsJsonMatch = prompt.match(/\[MODULES TO FILL\][\s\S]*?(\[\s*\{[\s\S]*\}\s*\])\s*(?:\[ADDITIONAL|\[OUTPUT)/);
            const moduleSpecsStr = moduleSpecsJsonMatch?.[1];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let moduleSpecs: any[] = [];
            try {
                moduleSpecs = moduleSpecsStr ? JSON.parse(moduleSpecsStr) : [];
            } catch {
                moduleSpecs = [];
            }

            const brandName = /"brandName":\s*"([^"]+)"/.exec(prompt)?.[1] ?? "브랜드";

            const modules = moduleSpecs.map(ms => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const slots: Record<string, any> = {};
                for (const s of ms.slots ?? []) {
                    if (s.type === "string") slots[s.key] = `${brandName} ${s.key}`.slice(0, s.maxChars ?? 60);
                    else if (s.type === "string[]") {
                        const maxItems = s.maxItems ?? 3;
                        slots[s.key] = Array.from({ length: Math.min(3, maxItems) }, (_, i) => `${s.key}-${i + 1}`.slice(0, s.maxChars ?? 60));
                    } else if (s.type === "kv_list") {
                        const maxItems = s.maxItems ?? 3;
                        slots[s.key] = Array.from({ length: Math.min(3, maxItems) }, (_, i) => ({ key: `항목${i + 1}`, value: `내용${i + 1}` }));
                    } else if (s.type === "metric_list") {
                        const maxItems = s.maxItems ?? 3;
                        slots[s.key] = Array.from({ length: Math.min(3, maxItems) }, (_, i) => ({ label: `지표${i + 1}`, value: `${i + 1}` }));
                    }
                }
                return { moduleId: ms.id, slots };
            });

            return `<JSON>${JSON.stringify({ modules })}</JSON>`;
        },
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function minimalInputForKind(kindId: any) {
    // Kind별 requiredFacts를 만족하도록 기본값을 넣는다.
    return {
        kindId,
        format: "A4" as const,
        language: "ko" as const,
        brandName: "테스트브랜드",
        contactPhone: "010-1234-5678",
        contactEmail: "hello@example.com",
        periodText: "2026년 상반기",
        eligibilityText: "자격 요건은 공고문 기준",
        requiredDocsText: "신청서/증빙서류",
        operatingHoursText: "평일 09:00~18:00",
        addressText: "서울시 어딘가",
        legalNotices: ["세부 내용은 상담 시 안내됩니다."],
    };
}

describe("verify_brochure_kind_coverage", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const kindCoverage: Record<string, any> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(kindCoverage).forEach(([kindId, data]: [string, any]) => {
        // This block seems to be an incomplete edit, leaving it as is based on the instruction.
    });

    it("12개 Kind가 최소 입력에서 치명 에러 없이 생성된다", async () => {
        const llm = mockLLM();

        for (const kind of BROCHURE_KINDS) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { gate } = await generateBrochure(minimalInputForKind(kind.id) as any, { llm });
            expect(gate.errors.length).toBe(0);
        }
    });
});
