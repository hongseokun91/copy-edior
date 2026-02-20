
// Simulated AI Provider for when API Keys are missing (Safety Fallback)

const MOCK_DATA = {
    ideate: [
        { headline: "Simulation A: Taste the Future", subhead: "Delicious Mockup Food for testing. AI Key Missing Mode.", concept_reasoning: "Performance Test" },
        { headline: "Simulation B: Premium Experience", subhead: "Luxury layout placeholder.", concept_reasoning: "Brand Test" },
        { headline: "Simulation C: Hurry Up", subhead: "Limited time simulation offer.", concept_reasoning: "Urgency Test" },
        { headline: "Simulation D: Healthy Choice", subhead: "Fresh data flow.", concept_reasoning: "Health Test" },
        { headline: "Simulation E: Family Feast", subhead: "Big data for everyone.", concept_reasoning: "Volume Test" },
        { headline: "Simulation F: Midnight Snack", subhead: "Late night coding.", concept_reasoning: "Time Test" }
    ],
    full_variant: {
        headline: "(SIMULATION MODE) AI Request Failed",
        subhead: "This is a simulated response. Please check your API Quota or Key configuration.",
        bullets: [
            "Benefit: System fallback active.",
            "Proof: You are seeing this text.",
            "Trust: Check OpenAI billing or .env keys."
        ],
        cta: "Check Status",
        info: "System Info: Offline Mode",
        disclaimer: "Simulation Data Only",

        // V3 Mock Data
        hookLine: "Simulation Hook",
        posterShort: "SIMULATION",
        valueProps: ["Simulated Value 1", "Simulated Value 2", "Simulated Value 3"],
        altHeadlines: ["Simulated Alt 1", "Simulated Alt 2", "Simulated Alt 3"],
        hashtags: ["#Simulation", "#System", "#Test"],

        more: {
            altHeadlines: ["Simulated Alt 1", "Simulated Alt 2", "Simulated Alt 3"],
            bannerShort: ["Offline", "Safe Mode"],
            microCTA: ["Check API", "Retry"],
            hashtags: ["#Simulation", "#System", "#Test", "#Dev", "#SafeMode", "#Fallback", "#Offline"]
        }
    }
};

export const mockModel = {
    id: "mock-model",
    provider: "mock"
};

// [P0] Updated to consider Provider Mode
export function isMockMode() {
    // If we are in "openai" mode, we check OPENAI_KEY
    // If "gateway" mode, we check GATEWAY_KEY (+ URL)
    //provider.ts handles this logic mostly, but this helper is useful for UI checks or other components.

    // However, provider.ts dictates the truth. 
    // This function is kept for backward compatibility but should rely on env.

    // Simplest Check: Just check if keys are currently set in Process.
    const mode = (process.env.AI_PROVIDER_MODE || 'gateway').toLowerCase();
    if (mode === 'openai') return !process.env.OPENAI_API_KEY;
    return !process.env.AI_GATEWAY_API_KEY;
}

export async function generateMockResponse(input: any) {
    // [P1] Hard Guard: Zero-Tolerance for Simulation in Deploy
    const isDeployed = process.env.VERCEL === '1' ||
        process.env.VERCEL_ENV === 'production' ||
        process.env.VERCEL_ENV === 'preview' ||
        process.env.NODE_ENV === 'production';

    // Log Guard State
    console.log(`[ENV_GUARD] Check: Deployed=${isDeployed}, Env=${process.env.VERCEL_ENV}, Node=${process.env.NODE_ENV}, AllowMock=${!isDeployed}`);

    if (isDeployed) {
        throw new Error("MOCK_PROVIDER_FORBIDDEN_IN_DEPLOYED_ENV");
    }

    // Extract meaningful string from input (which might be params object or direct schema)
    const inputStr = (typeof input === 'string' ? input : JSON.stringify(input)) || "";
    // Check params.passName if available
    const passName = input?.passName || "";

    try {
        const fs = require('fs');
        const path = require('path');
        const keys = typeof input === 'object' ? Object.keys(input).join(',') : 'not-object';
        fs.appendFileSync(path.join(process.cwd(), 'debug_mock.log'), `[MOCK] Pass: '${passName}', Keys: ${keys}, HasFrameB: ${inputStr.includes("FRAME B")}, Snippet: ${inputStr.substring(0, 200)}\n`);
    } catch (e) {
        // Ignore file errors
    }

    console.log(`[MOCK DEBUG] Pass: ${passName}, InputLen: ${inputStr.length}`);

    if (inputStr.includes("candidates")) {
        return { candidates: MOCK_DATA.ideate };
    }
    if (inputStr.includes("weaknesses")) {
        return { weaknesses: ["Simulated weakness 1", "Simulated weakness 2"], instruction: "Fix the simulation." };
    }
    if (inputStr.includes("bestIndex")) {
        return { bestIndex: 0, reason: "Simulation selected first option." };
    }

    const fs = require('fs');
    const path = require('path');

    // [NEW] Leaflet Mock
    if (passName === "LEAFLET_EXPANSION" || inputStr.includes("LEAFLET STRUCTURE")) {
        return {
            pages: [
                { page_id: "P1", role: "Front", sections: [{ type: "HERO", content: { headline: "Mock P1" } }] },
                { page_id: "P2", role: "Inside", sections: [{ type: "STORY", content: { text: "Mock P2" } }] },
                { page_id: "P3", role: "Main", sections: [{ type: "SERVICE", content: { details: "Mock P3" } }] },
                { page_id: "P4", role: "Main", sections: [{ type: "SERVICE", content: { details: "Mock P4" } }] },
                { page_id: "P5", role: "Trust", sections: [{ type: "REVIEW", content: { text: "Mock P5" } }] },
                { page_id: "P6", role: "Back", sections: [{ type: "CONTACT", content: { tel: "Mock P6" } }] }
            ]
        };
    }

    // [NEW] Brochure Mock
    if (passName === "BROCHURE_GEN" || inputStr.includes("BROCHURE STRUCTURE")) {
        return {
            pages: [
                { page_id: "P1", role: "Cover", sections: [] },
                { page_id: "P2", role: "Story", sections: [] },
                { page_id: "P3", role: "Service", sections: [] },
                { page_id: "P4", role: "Contact", sections: [] }
            ]
        };
    }

    // [NEW] Poster Mocks
    if (passName === "POSTER_ANALYZE") {
        return {
            intentId: "INT_PROMO_OFFER",
            headlineType: "HL_OFFER_FIRST",
            channelPack: "PACK_SNS_1_1",
            densityProfile: "DENSITY_STANDARD",
            claimPolicyMode: "standard",
            facts: {
                who: "Everyone", what: "Sale", why: "Promotion", tone: "Exciting", keywords: ["Sale"]
            }
        };
    }
    if (passName === "POSTER_HEADLINES") {
        return {
            setA: [{ text: "Poster Headline A", badges: { length: "short", densityFit: "DENSITY_STANDARD", tone: "friendly", risk: "low" }, typeHint: "HL_OFFER_FIRST", score: 90 }],
            setB: [{ text: "Poster Headline B", badges: { length: "medium", densityFit: "DENSITY_STANDARD", tone: "friendly", risk: "low" }, typeHint: "HL_PROBLEM_FIRST", score: 80 }],
            setC: [{ text: "Poster Headline C", badges: { length: "long", densityFit: "DENSITY_STANDARD", tone: "official", risk: "low" }, typeHint: "HL_AUTHORITY_FIRST", score: 85 }]
        };
    }
    if (passName === "POSTER_BODY") {
        return {
            S_HEADLINE: "Poster Headline A",
            S_SUBHEAD: "Generated Subhead",
            S_CTA: "Call Now"
        };
    }

    // [EXISTING] Frame Logic
    if (passName.includes("_A") || inputStr.includes("Frame A") || inputStr.includes("Frame: A") || inputStr.includes("FRAME A")) {
        try { fs.appendFileSync(path.join(process.cwd(), 'debug_mock.log'), `[MOCK] DECISION: FRAME A\n`); } catch (e) { }
        return {
            ...MOCK_DATA.full_variant,
            headline: "(SIMULATION MODE) Frame A Variant: Performance & Speed",
            SUBHEAD: "Get results fast with our Frame A proven system.",
            subhead: "Get results fast with our Frame A proven system.",
            BENEFIT_BULLETS: ["Benefit A1: Immediate Results", "Benefit A2: High Efficiency", "Benefit A3: Best Support"],
            bullets: ["Benefit A1: Immediate Results", "Benefit A2: High Efficiency", "Benefit A3: Best Support"],
            CTA: "Start Now (Frame A)",
            cta: "Start Now (Frame A)",
            hookLine: "Simulation Hook A: Speed",
            posterShort: "FAST A",
            valueProps: ["Value A1", "Value A2", "Value A3"],
            altHeadlines: ["Alt A1", "Alt A2", "Alt A3"],
            HEADLINE: "(SIMULATION MODE) Frame A Variant: Performance & Speed"
        };
    }
    if (passName.includes("_B") || inputStr.includes("Frame B") || inputStr.includes("Frame: B") || inputStr.includes("FRAME B")) {
        try { fs.appendFileSync(path.join(process.cwd(), 'debug_mock.log'), `[MOCK] DECISION: FRAME B\n`); } catch (e) { }
        return {
            ...MOCK_DATA.full_variant,
            headline: "(SIMULATION MODE) Frame B Variant: Premium Quality & Trust",
            SUBHEAD: "Experience the difference with our Frame B exclusive methodology.",
            subhead: "Experience the difference with our Frame B exclusive methodology.",
            BENEFIT_BULLETS: ["Benefit B1: Superior Quality", "Benefit B2: Certified Experts", "Benefit B3: 100% Satisfaction"],
            bullets: ["Benefit B1: Superior Quality", "Benefit B2: Certified Experts", "Benefit B3: 100% Satisfaction"],
            CTA: "Consult Now (Frame B)",
            cta: "Consult Now (Frame B)",
            hookLine: "Simulation Hook B: Distinction",
            posterShort: "PREMIUM B",
            valueProps: ["Value B1", "Value B2", "Value B3"],
            altHeadlines: ["Alt B1", "Alt B2", "Alt B3"],
            HEADLINE: "(SIMULATION MODE) Frame B Variant: Premium Quality & Trust"
        };
    }
    if (passName.includes("_C") || inputStr.includes("Frame C") || inputStr.includes("Frame: C") || inputStr.includes("FRAME C")) {
        try { fs.appendFileSync(path.join(process.cwd(), 'debug_mock.log'), `[MOCK] DECISION: FRAME C\n`); } catch (e) { }
        return {
            ...MOCK_DATA.full_variant,
            headline: "(SIMULATION MODE) Frame C Variant: Urgent & Emotional",
            SUBHEAD: "Don't miss out on this Frame C limited time opportunity.",
            subhead: "Don't miss out on this Frame C limited time opportunity.",
            BENEFIT_BULLETS: ["Benefit C1: Time is running out", "Benefit C2: Emotional Satisfaction", "Benefit C3: Join the community"],
            bullets: ["Benefit C1: Time is running out", "Benefit C2: Emotional Satisfaction", "Benefit C3: Join the community"],
            CTA: "Join Today (Frame C)",
            cta: "Join Today (Frame C)",
            hookLine: "Simulation Hook C: Urgency",
            posterShort: "URGENT C",
            valueProps: ["Value C1", "Value C2", "Value C3"],
            altHeadlines: ["Alt C1", "Alt C2", "Alt C3"],
            HEADLINE: "(SIMULATION MODE) Frame C Variant: Urgent & Emotional"
        };
    }

    return MOCK_DATA.full_variant;
}
