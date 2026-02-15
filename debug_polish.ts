
import { polish } from "./src/lib/copy/polish";
import { NormalizedBrief } from "./src/types/brief";

const brief: NormalizedBrief = {
    productType: 'flyer',
    style: 'standard',
    industry: '식당/카페',
    goal: '단골 유치',
    storeName: 'Test Store',
    offerRaw: 'Free Drink',
    periodNormalized: 'Limited',
    contactNormalized: 'Call us',
    contactChannel: 'phone',
    contactValueRaw: '010-1234-5678',
    mustInclude: [],
    tone: 'friendly',
    background: 'bg'
};

const candidate = {
    headline: "Test Headline",
    subhead: "Test Subhead",
    concept_reasoning: "Reason"
};

async function run() {
    console.log("Running Polish B...");
    const res = await polish(candidate, "B", brief, "trace-123");
    console.log("Result Headline:", res.HEADLINE);
    console.log("Result HookLine:", res.hookLine);
}

run();
