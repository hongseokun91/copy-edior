import { describe, it, expect } from "vitest";
import { QualityEngine } from "./engine";

describe("QualityEngine", () => {
    it("should detect overclaims and return hard fail", () => {
        const text = "우리는 100% 무조건 보장합니다. 실패는 절대 없습니다.";
        const result = QualityEngine.evaluate(text, "GENERAL");
        expect(result.hardFail).toBe(true);
        expect(result.totalScore).toBe(0); // Floored to 0
        expect(result.triggeredRuleIds).toContain("HF-001");
    });

    it("should detect rank claims without evidence", () => {
        const text = "우리는 업계 1위 유일한 브랜드입니다.";
        const result = QualityEngine.evaluate(text, "GENERAL");
        expect(result.hardFail).toBe(true);
        expect(result.triggeredRuleIds).toContain("HF-002");
    });

    it("should enforce pricing policies", () => {
        const text = "가격은 10만원입니다.";
        const result = QualityEngine.evaluate(text, "PRICING");
        expect(result.hardFail).toBe(true);
        expect(result.triggeredRuleIds).toContain("HF-PR-001");
    });

    it("should detect clichés", () => {
        const text = "저희는 고객 만족을 위해 최선을 다하는 프리미엄 브랜드입니다.";
        const result = QualityEngine.evaluate(text, "GENERAL");
        expect(result.triggeredRuleIds).toContain("ST-201");
        expect(result.dimensionScores.voice_fit).toBeLessThan(5);
    });

    it("should handle abbreviations in sentence splitting", () => {
        const text = "삼성 No.1 브랜드입니다. Dr. Kim 추천 제품입니다.";
        const result = QualityEngine.evaluate(text, "GENERAL");
        expect(result.triggeredRuleIds).not.toContain("RD-301");
    });

    it("should add quality notices for hard fails in safe fixes", () => {
        const text = "가격은 10만원입니다.";
        const result = QualityEngine.evaluate(text, "PRICING");
        const fixed = QualityEngine.applySafeFixes(text, result);
        expect(fixed).toContain("[품질 확인 필수:");
    });
});
