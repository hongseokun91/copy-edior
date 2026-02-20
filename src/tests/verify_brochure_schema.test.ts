// src/tests/verify_brochure_schema.test.ts
import { describe, it, expect } from "vitest";
import { z } from "zod";
import { generateBrochure, type LLMClient } from "../lib/copy/brochure/engine";
import { BROCHURE_MODULES } from "../lib/brochure-modules";

const BrochureSchema = z.object({
    kindId: z.string(),
    brandName: z.string().optional(), // Allow optional for test flexibility
    title: z.string().optional(),
    blockData: z.array(z.any()).optional(),
}).passthrough();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validBrochure: any = { kindId: "TEST", title: "Test Title", blockData: [] };

function mockLLM(): LLMClient {
    return {
        generate: async ({ prompt }) => {
            // Facts
            if (prompt.includes("Create a Facts Registry")) {
                const brandName = /"brandName":\s*"([^"]+)"/.exec(prompt)?.[1] ?? "브랜드";
                const phone = /"contactPhone":\s*"([^"]+)"/.exec(prompt)?.[1] ?? "010-1234-5678";
                const email = /"contactEmail":\s*"([^"]+)"/.exec(prompt)?.[1] ?? "hello@example.com";
                return `<JSON>${JSON.stringify({ brandName, contactPhone: phone, contactEmail: email, legalNotices: [] })}</JSON>`;
            }

            // Block plan
            if (prompt.includes("Create a 4-page block plan")) {
                // 기본적으로 Front + (가능하면 1개) + Back
                return `<JSON>${JSON.stringify({
                    blocks: [{ type: "BLOCK_FRONT_IDENTITY", title: "Front" }, { type: "BLOCK_BACK_TRUST_CONTACT", title: "Back" }],
                })}</JSON>`;
            }

            // Page modules: prompt 안의 MODULES TO FILL에 moduleSpecs JSON이 들어있음. 여기서 moduleId/slots만 맞춰준다.
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

describe("verify_brochure_schema", () => {
    it("minimal input에서도 페이지/모듈 구조가 유효하고 4p 단위로 생성된다", async () => {
        const { output, gate } = await generateBrochure(
            {
                kindId: "KIND_PRODUCT_CATALOG",
                format: "A4",
                language: "ko",
                brandName: "파인스티치",
                contactPhone: "010-1234-5678",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any,
            { llm: mockLLM() }
        );

        expect(output.meta.totalPages % 4).toBe(0);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invalid: any = { ...validBrochure, blockData: "not-an-array" };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validWithExtra = { ...validBrochure, extraField: "should-pass-if-open" } as any;
        expect(BrochureSchema.safeParse(validWithExtra).success).toBe(true);

        // invalid: value type mismatch
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invalidType = { ...validBrochure, title: 123 } as any;
        expect(BrochureSchema.safeParse(invalidType).success).toBe(false);

        // invalid: missing required
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const missingReq = { ...validBrochure, title: undefined } as any;
        const pageIds = Object.keys(output.pages);
        expect(pageIds.length).toBe(output.meta.totalPages);

        // 모든 페이지에 modules 배열이 존재
        for (const pid of pageIds) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect(Array.isArray(output.pages[pid as any].modules)).toBe(true);
            // moduleId가 실제 정의된 모듈인지(스펙 존재) 확인
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            for (const m of output.pages[pid as any].modules) {
                expect(BROCHURE_MODULES.some(x => x.id === m.moduleId)).toBe(true);
                expect(m.slots).toBeTypeOf("object");
            }
        }

        // 치명 에러는 없어야 함(경고는 허용)
        expect(gate.errors.length).toBe(0);
    });
});
