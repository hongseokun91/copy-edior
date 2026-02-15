// src/tests/verify_brochure_density.test.ts
import { describe, it, expect } from "vitest";
import { runQualityGates } from "../lib/copy/brochure/quality-gates";
import { BROCHURE_KINDS } from "../lib/brochure-kinds";
import type { BrochureOutput } from "../types/brochure";

describe("verify_brochure_density", () => {
    it("내러티브 페이지에 불릿이 과다하면 밀도 경고가 발생한다", () => {
        const kind = BROCHURE_KINDS.find(k => k.id === "KIND_BRAND_STORYBOOK_LITE")!;
        const output: BrochureOutput = {
            meta: { kindId: kind.id, format: "A4", language: "ko", totalPages: 4, totalBlocks: 1 },
            facts: { brandName: "브랜드", legalNotices: [], claimPolicyMode: kind.claimPolicyMode },
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
                P1: { role: "ROLE_COVER", modules: [{ moduleId: "MOD_COVER_HERO", slots: { headline: "브랜드", subhead: "소개", tagline: "" } }] },
                P2: {
                    role: "ROLE_NARRATIVE",
                    modules: [
                        {
                            moduleId: "MOD_POLICY_SUMMARY",
                            slots: {
                                sectionTitle: "요약",
                                summaryBullets: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], // 과다
                                eligibility: "",
                            },
                        },
                    ],
                },
                P3: { role: "ROLE_VALUE", modules: [{ moduleId: "MOD_VALUE_PILLARS", slots: { sectionTitle: "가치", pillars: ["A", "B"], supportingLine: "" } }] },
                P4: { role: "ROLE_ACTION", modules: [{ moduleId: "MOD_CONTACT_PANEL", slots: { ctaHeadline: "문의", ctaLine: "상담", contactLines: ["연락처"] } }] },
            },
        };

        const gate = runQualityGates({ output, kind });
        expect(gate.errors.length).toBe(0);
        expect(gate.warnings.some(w => w.code === "DENSITY_TOO_MANY_BULLETS" || w.code === "NARRATIVE_BULLET_SPAM")).toBe(true);
    });
});
