
// Force Mock Mode by clearing env vars BEFORE imports
delete process.env.AI_GATEWAY_API_KEY;
delete process.env.AI_GATEWAY_BASE_URL;
process.env.NODE_ENV = 'development';

console.log("Environment cleared. Loading engines...");

async function runTests() {
    const traceId = "test-trace-id";

    // Dynamic imports to ensure env is read after clearing
    const { generateLeaflet } = await import("@/lib/engines/leaflet-engine");
    const { generateBrochure } = await import("@/lib/engines/brochure-engine");
    const { generatePoster } = await import("@/lib/poster/poster-engine");

    // 1. Test Leaflet Engine
    console.log("--- Testing Leaflet Engine ---");
    const leafletInputs = {
        productType: 'leaflet',
        storeName: "Test Cafe",
        industry: "Cafe",
        offer: "Americano 1+1",
        contactValue: "010-1234-5678"
    };
    try {
        const leafletResult = await generateLeaflet(leafletInputs, traceId);
        // Cast to any to access pages
        const pageCount = (leafletResult.variants.A as any).pages?.length;
        console.log(`Leaflet Pages: ${pageCount} (Expected: 6)`);

        if (pageCount === 6) console.log("PASS: Leaflet structure correct");
        else console.error("FAIL: Leaflet page count mismatch");
    } catch (e) {
        console.error("Leaflet Engine Failed:", e);
    }

    // 2. Test Brochure Engine
    console.log("\n--- Testing Brochure Engine ---");
    const brochureInputs = {
        productType: 'brochure',
        storeName: "Tech Corp",
        industry: "IT",
        offer: "Consulting Service",
        brandStory: "We are the best."
    };
    try {
        const brochureResult = await generateBrochure(brochureInputs, traceId);
        const pages = (brochureResult.variants.A as any).pages;
        console.log(`Brochure Pages: ${pages?.length} (Expected: >=4)`);

        if (pages && pages.length >= 4) console.log("PASS: Brochure structure correct");
        else console.error("FAIL: Brochure page count mismatch");
    } catch (e) {
        console.error("Brochure Engine Failed:", e);
    }

    // 3. Test Poster Engine
    console.log("\n--- Testing Poster Engine ---");
    const posterInputs = {
        productType: 'poster',
        category: "Retail",
        offer: "Summer Sale 50%",
        additionalBrief: "Make it pop!"
    };
    try {
        const posterResult = await generatePoster(posterInputs, traceId);
        const blueprint = (posterResult.variants.A as any).blueprint;
        const candidates = (posterResult.variants.A as any).headlineCandidates;

        if (blueprint && candidates) console.log("PASS: Poster structure correct (Blueprint + Headlines)");
        else console.error("FAIL: Poster missing blueprint or headlines");
    } catch (e) {
        console.error("Poster Engine Failed:", e);
    }
}

runTests().catch(e => console.error(e));
