
import { safeGenerateText } from "@/lib/copy/provider";
import { polish } from "@/lib/copy/polish";
import { NormalizedBrief } from "@/types/brief";
import { logger } from "@/lib/logger";

// Mock Brief
const mockBrief: NormalizedBrief = {
    productType: "leaflet",
    industry: "Academy",
    goal: "Curriculum",
    storeName: "Test Academy",
    offerRaw: "Free Trial Class",
    periodNormalized: "Until March",
    contactNormalized: "010-1234-5678",
    contactChannel: "Phone",
    contactValueRaw: "010-1234-5678",
    mustInclude: ["Math", "English"],
    v09_extra: {
        textVolume: "standard"
    }
} as any;

// Mock Candidate (from Ideation)
const mockCandidate = {
    headline: "Transform your grades",
    subhead: "Expert teachers, proven results",
    concept_reasoning: "Focus on academic success"
};

async function runTest() {
    console.log("Starting Leaflet Generation Test...");

    try {
        const result = await polish(mockCandidate, "A", mockBrief, "test_trace_id");

        console.log("Generation Complete!");

        // Assertions
        if (result.pages && Array.isArray(result.pages) && result.pages.length === 6) {
            console.log("PASS: Use 6-Page Structure");

            const p1 = result.pages.find((p: any) => p.page_id === "P1");
            if (p1) console.log("PASS: P1 (Cover) Exists");

            const p6 = result.pages.find((p: any) => p.page_id === "P6");
            if (p6) console.log("PASS: P6 (Back) Exists");

            // Check for Flyer keys leaking
            if ((result as any).HEADLINE || (result as any).SUBHEAD) {
                console.warn("WARNING: Flyer keys (HEADLINE/SUBHEAD) present. This might be okay if they are ignored, but ideal to clean them.");
            } else {
                console.log("PASS: Clean Output (No Flyer Keys)");
            }

        } else {
            console.error("FAIL: Result is not a 6-Page Leaflet Structure");
            console.log("Received Keys:", Object.keys(result));
        }

    } catch (e) {
        console.error("Test Failed with Error:", e);
    }
}

runTest();
