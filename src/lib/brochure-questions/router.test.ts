import { describe, it, expect } from "vitest";
import { deriveModuleIdsForQuestions } from "./derive";
import { buildQuestionPacks } from "./router";

describe("Brochure Question Logic", () => {
    it("should derive correct modules for IR brochure", () => {
        const modules = deriveModuleIdsForQuestions({
            kindId: "KIND_IR_INVESTMENT_BRIEF" as any,
            selectedBlocks: ["BLOCK_PROBLEM_INSIGHT" as any, "BLOCK_BACK_TRUST_CONTACT" as any],
        });
        // Based on BROCHURE_BLOCK_TEMPLATES and mandatoryModuleIds
        expect(modules).toContain("MOD_TRACTION_METRICS");
        expect(modules).toContain("MOD_CONTACT_PANEL");
    });

    it("should filter questions based on kind and modules - IR case", () => {
        const packs = buildQuestionPacks({
            kindId: "KIND_IR_INVESTMENT_BRIEF" as any,
            claimPolicyMode: "strict", // IR questions usually require strict
            selectedBlocks: ["BLOCK_PROBLEM_INSIGHT" as any],
            derivedModuleIds: ["MOD_TRACTION_METRICS"],
        });

        const allQuestions = packs.flatMap(p => p.questions);
        const hasIRTraction = allQuestions.some(q => q.id === "Q_IR_TRACTION_METRICS");
        expect(hasIRTraction).toBe(true);

        const hasPublicPolicy = allQuestions.some(q => q.id === "Q_PUBLIC_ELIGIBILITY_DEFINITION");
        expect(hasPublicPolicy).toBe(false);
    });

    it("should include extra questions in strict mode", () => {
        const standardPacks = buildQuestionPacks({
            kindId: "KIND_PUBLIC_POLICY_GUIDE" as any,
            claimPolicyMode: "standard",
            selectedBlocks: ["BLOCK_PROBLEM_INSIGHT" as any],
            derivedModuleIds: ["MOD_VALUE_PROP"],
        });

        const strictPacks = buildQuestionPacks({
            kindId: "KIND_PUBLIC_POLICY_GUIDE" as any,
            claimPolicyMode: "strict",
            selectedBlocks: ["BLOCK_PROBLEM_INSIGHT" as any],
            derivedModuleIds: ["MOD_VALUE_PROP"],
        });

        // Strict mode should include more questions (like Q_PUBLIC_LEGAL_BASIS)
        expect(strictPacks.flatMap(p => p.questions).length).toBeGreaterThan(standardPacks.flatMap(p => p.questions).length);

        const hasLegalBasis = strictPacks.flatMap(p => p.questions).some(q => q.id === "Q_PUBLIC_LEGAL_BASIS");
        expect(hasLegalBasis).toBe(true);
    });

    it("should handle empty kindId gracefully", () => {
        const modules = deriveModuleIdsForQuestions({
            kindId: "" as any,
            selectedBlocks: [],
        });
        expect(modules).toEqual([]);

        const packs = buildQuestionPacks({
            kindId: "" as any,
            claimPolicyMode: "standard",
            selectedBlocks: [],
            derivedModuleIds: [],
        });

        // Should only contain universal questions (Q_BRAND_NAME, etc.)
        const questionIds = packs.flatMap(p => p.questions).map(q => q.id);
        expect(questionIds).toContain("Q_BRAND_NAME");
        expect(questionIds).not.toContain("Q_IR_TRACTION_METRICS");
    });
});
