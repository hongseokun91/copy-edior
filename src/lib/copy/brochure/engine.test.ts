// src/lib/copy/brochure/engine.test.ts

import { describe, it, expect } from "vitest";
import { generateBrochure, type LLMClient } from "./engine";
import { BrochureInput } from "../../../types/brochure";

const mockLLM = (): LLMClient => ({
    generate: async ({ prompt }) => {
        if (prompt.includes("[GOAL]\nCreate a Facts Registry")) {
            return "<JSON>" + JSON.stringify({
                brandName: "Seoul Youth Department",
                contactPhone: "010-1234-5678",
                claimPolicyMode: "official"
            }) + "</JSON>";
        }
        if (prompt.includes("[GOAL]\nCreate a 4-page block plan")) {
            return "<JSON>" + JSON.stringify({
                blocks: [
                    { type: "BLOCK_FRONT_IDENTITY" },
                    { type: "BLOCK_BACK_TRUST_CONTACT" }
                ]
            }) + "</JSON>";
        }
        return "<JSON>" + JSON.stringify({
            modules: [
                { moduleId: "MOD_TITLE", slots: { title: "Test Page" } }
            ]
        }) + "</JSON>";
    }
});

describe("Brochure Generation Engine", () => {
    it("should generate a complete brochure structure for a given input", async () => {
        const input: BrochureInput = {
            kindId: "KIND_PUBLIC_POLICY_GUIDE",
            brandName: "Seoul Youth Department",
            format: "A4",
            language: "ko",
            brandTone: "official",
        };

        const { output, gate } = await generateBrochure(input, {
            llm: mockLLM()
        });

        expect(output.facts).toBeDefined();
        expect(output.blocks).toBeDefined();
        expect(output.pages).toBeDefined();
        expect(output.meta.kindId).toBe(input.kindId);

        // Verify block expansion
        expect(output.blocks.length).toBeGreaterThanOrEqual(1);

        // Verify pages match blocks (4 pages per block)
        const pageCount = Object.keys(output.pages).length;
        expect(pageCount).toBe(output.blocks.length * 4);

        expect(gate.ok).toBe(true);
    });
});
