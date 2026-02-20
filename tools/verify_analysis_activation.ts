import { runAnalysisPipeline } from "../src/lib/analyze/pipeline";
import { OCR_TIMEOUT_MS } from "../src/lib/env/copyfit";

async function verify() {
    console.log("Verifying Analysis Activation...");
    console.log(`OCR Timeout: ${OCR_TIMEOUT_MS}ms`);

    try {
        const result = await runAnalysisPipeline("http://example.com/test.jpg");
        console.log("Analysis Result:", result);
        if (result.id && result.meta.width === 800) {
            console.log("SUCCESS: Pipeline returned valid result.");
        } else {
            console.error("FAILURE: Invalid result structure.");
            process.exit(1);
        }
    } catch (e) {
        console.error("FAILURE: Pipeline threw error", e);
        process.exit(1);
    }
}

verify();
