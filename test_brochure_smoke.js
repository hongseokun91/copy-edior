// test_brochure_smoke.js
const fetch = require('node-fetch');

async function testBrochureGen() {
    const payload = {
        inputs: {
            kindId: "KIND_PUBLIC_POLICY_GUIDE",
            brandName: "서울시 청년행복국",
            format: "A4",
            language: "ko",
            brandTone: "official",
            brandStory: "청년들의 주거 안정을 위한 서울시의 새로운 정책을 소개하는 가이드북입니다."
        }
    };

    console.log("Starting Brochure Generation Smoke Test...");
    console.log("Endpoint: http://localhost:3000/api/generate/brochure");

    try {
        const res = await fetch("http://localhost:3000/api/generate/brochure", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("FAIL: Non-OK status", res.status, data);
            process.exit(1);
        }

        // Verify Structure
        const hasFacts = !!data.facts;
        const hasBlocks = Array.isArray(data.blocks) && data.blocks.length > 0;
        const hasPages = typeof data.pages === 'object';

        console.log("Response Facts extracted:", Object.keys(data.facts || {}).length);
        console.log("Response Blocks generated:", data.blocks?.length);
        console.log("Response Pages generated:", Object.keys(data.pages || {}).length);

        if (hasFacts && hasBlocks && hasPages) {
            console.log("SUCCESS: Brochure structure matches specification!");
        } else {
            console.error("FAIL: Missing core components in response", { hasFacts, hasBlocks, hasPages });
            process.exit(1);
        }

    } catch (error) {
        console.error("FAIL: Request error", error);
        process.exit(1);
    }
}

testBrochureGen();
