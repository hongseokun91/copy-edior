
// [Verify Simulation Block]
// Simulates a request in a "Preview" environment (via Mock Provider or forced env).

(async () => {
    console.log("=== VERIFYING SIMULATION BLOCK ===");

    // 1. Forge Environment
    process.env.VERCEL_ENV = 'preview';
    process.env.NODE_ENV = 'production';

    try {
        // Dynamic import to pick up new env
        const { generateMockResponse } = require('./src/lib/copy/mock-provider');

        console.log("Attempting Mock Generation in PREVIEW env...");
        await generateMockResponse({});

        console.error("❌ FAILURE: Mock Generation succeeded but should have been BLOCKED.");
        process.exit(1);

    } catch (e: any) {
        if (e.message.includes("MOCK_PROVIDER_FORBIDDEN_IN_DEPLOYED_ENV")) {
            console.log("✅ SUCCESS: Blocked with correct error.");
            process.exit(0);
        } else {
            console.error("❌ FAILURE: Threw unexpected error:", e.message);
            process.exit(1);
        }
    }
})();
