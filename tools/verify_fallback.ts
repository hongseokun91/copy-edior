
import { generateAndRefine } from "../src/lib/copy/engine";
import { CopyContentSchema } from "../src/lib/copy/schema";
import { generateObject } from "ai";

// Mocking generateObject to THROW error to test fallback
// In a real environment, we might use Jest, but here we just script it 
// by forcing a condition or checking if we can simulate failure.
// Since we can't easily mock imports in this simple script without jest, 
// we will assume valid AI key exists. 
// To TEST FALLBACK: We typically temporarily rename the API Key in .env or 
// pass an invalid model.

// Instead, let's verify that generateByTemplate works for a comprehensive case.
// If this script runs successfully with NO API KEY in ENV, it proves fallback works.

import { FlyerInputs } from "../src/types/flyer";

const TEST_CASE = {
    cat: "식당", tone: "friendly" as const,
    inputs: {
        category: "식당", name: "fallback test", offer: "fallback offer",
        contactType: "phone" as const, contactValue: "010-0000-0000",
        goal: "test", period: "now"
    }
};

async function verifyFallback() {
    console.log("Verifying Fallback Logic...");
    console.log("NOTE: This test expects to see 'GEN_FALLBACK' log info if AI fails.");

    // We can't force AI fail easily here unless we tamper with env.
    // So we will just run it. If AI works, great. If AI fails (e.g. no key), 
    // it SHOULD return a valid result via template.

    try {
        const result = await generateAndRefine(
            TEST_CASE.cat,
            TEST_CASE.tone,
            TEST_CASE.inputs,
            'A'
        );

        console.log("Result HEADLINE:", result.HEADLINE);

        if (result.HEADLINE) {
            console.log("SUCCESS: Pipeline returned Content (AI or Template)");
        } else {
            console.error("FAIL: No content returned");
            process.exit(1);
        }

    } catch (e) {
        console.error("CRITICAL FAIL: Pipeline threw error instead of fallback!", e);
        process.exit(1);
    }
}

verifyFallback();
