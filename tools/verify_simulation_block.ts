async function run() {
    console.log("=== REPRODUCING SIMULATION BLOCK ===");

    // 1. Mock Environment: Vercel Preview (should be treated like Prod)
    process.env.VERCEL_ENV = 'preview';
    process.env.NODE_ENV = 'production';
    process.env.AI_GATEWAY_BASE_URL = "https://fake-gateway.com";
    process.env.AI_GATEWAY_API_KEY = "invalid-key"; // Force Auth Error in Gateway Mode

    // Dynamic Import to pick up new Env Vars
    const { safeGenerateObject } = await import("../src/lib/copy/provider");
    const z = (await import("zod")).z;

    const schema = z.object({
        headline: z.string()
    });

    try {
        const result = await safeGenerateObject({
            schema: schema,
            prompt: "Test prompt",
            system: "Test system"
        });

        console.log("[RESULT]", result);

        if (result.object && result.object.headline) {
            console.error("[FAIL] Simulation Data Returned in PREVIEW Environment!");
            console.error("Values:", result.object);
            process.exit(1);
        }

    } catch (e: any) {
        if ((e.message || "").includes("MOCK_PROVIDER_FORBIDDEN_IN_DEPLOYED_ENV")) {
            console.log("[PASS] Correctly blocked with Hard Guard Error:", e.message);
        } else if ((e.message || "").includes("Service Unavailable")) {
            console.log("[PASS] Correctly blocked with 502:", e.message);
        } else {
            console.log("[WARN] Blocked, but unexpected error message:", e.message);
        }
    }
}

run();
