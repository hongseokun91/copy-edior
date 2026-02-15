
import { buildFramePrompt } from "./src/lib/copy/prompts";
import { NormalizedBrief } from "./src/types/brief";
import { FlyerType } from "./src/types/flyer";

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

const promptB = buildFramePrompt("B", brief);
console.log("----- PROMPT B -----");
console.log(promptB.includes("FRAME B"));
console.log(promptB.includes("Frame B"));
console.log(promptB.substring(0, 500));
