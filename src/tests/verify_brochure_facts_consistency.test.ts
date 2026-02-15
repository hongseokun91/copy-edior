// src/tests/verify_brochure_facts_consistency.test.ts
import { describe, it, expect } from "vitest";
import { runQualityGates } from "../lib/copy/brochure/quality-gates";
import { BROCHURE_KINDS } from "../lib/brochure-kinds";
import type { BrochureOutput } from "../types/brochure";

describe("verify_brochure_facts_consistency", () => {
    it("FactsRegistry.contactPhone과 다른 전화번호가 페이지에 섞이면 경고가 발생한다", () => {
        const kind = BROCHURE_KINDS.find(k => k.id === "KIND_PRODUCT_CATALOG")!;
        const output: BrochureOutput = {
            meta: { kindId: kind.id, format: "A4", language: "ko", totalPages: 4, totalBlocks: 1 },
            facts: { brandName: "파인스티치", contactPhone: "010-1234-5678", legalNotices: [], claimPolicyMode: kind.claimPolicyMode },
            blocks: [
                {
                    blockId: "blk1",
                    type: "BLOCK_FRONT_IDENTITY",
                    title: "Front",
                    pages: [
                        { pageId: "P1", role: "ROLE_COVER", recommendedModuleIds: [] },
                        { pageId: "P2", role: "ROLE_NARRATIVE", recommendedModuleIds: [] },
                        { pageId: "P3", role: "ROLE_VALUE", recommendedModuleIds: [] },
                        { pageId: "P4", role: "ROLE_ACTION", recommendedModuleIds: [] },
                    ],
                },
            ],
            pages: {
                P1: { role: "ROLE_COVER", modules: [{ moduleId: "MOD_COVER_HERO", slots: { headline: "파인스티치", subhead: "소개", tagline: "" } }] },
                P2: { role: "ROLE_NARRATIVE", modules: [{ moduleId: "MOD_BRAND_STORY_LONG", slots: { sectionTitle: "이야기", paragraphs: ["문장1", "문장2"] } }] },
                P3: { role: "ROLE_VALUE", modules: [{ moduleId: "MOD_VALUE_PILLARS", slots: { sectionTitle: "가치", pillars: ["A", "B"], supportingLine: "" } }] },
                P4: {
                    role: "ROLE_ACTION",
                    modules: [
                        {
                            moduleId: "MOD_CONTACT_PANEL",
                            slots: { ctaHeadline: "문의", ctaLine: "상담", contactLines: ["문의: 010-0000-0000"] }, // 의도적 불일치
                        },
                    ],
                },
            },
        };

        const gate = runQualityGates({ output, kind });
        expect(gate.errors.length).toBe(0);
        expect(gate.warnings.some(w => w.code === "PHONE_INCONSISTENT")).toBe(true);
    });
});
