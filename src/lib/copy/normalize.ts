
import { FlyerInputs, FlyerType } from "@/types/flyer";
import { NormalizedBrief } from "@/types/brief";

// M1: Normalizer Module implementation

// Regex Constants
const PHONE_REGEX = /(01[016789])[-.]?(\d{3,4})[-.]?(\d{4})/;
const DATE_REGEX = /(\d{1,2})월\s*(\d{1,2})일/;

// Helper: Normalize Phone
function normalizeContactValue(val: string): string {
    const match = val.match(PHONE_REGEX);
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return val; // Return raw if not a mobile number
}

// Helper: Normalize Period
function normalizePeriodText(val: string): string {
    if (!val) return "";
    // If user typed "오늘", "이번주" -> keep.
    // If "2/1" -> "2월 1일". 
    // For now, strict cleanup.
    return val.trim();
}

// Helper: Extract Offer Tokens from raw string
function parseOfferTokens(raw: string) {
    const tokens: any = {};
    if (raw.includes("%")) tokens.discountRate = raw.match(/(\d+)%/)?.[0];
    if (raw.includes("1+1") || raw.includes("원라스원")) tokens.bogo = true;
    if (raw.includes("무료") || raw.includes("증정") || raw.includes("서비스")) tokens.gift = "freebie";
    if (raw.includes("선착순") || raw.includes("한정")) tokens.limited = true;
    return tokens;
}

// Helper: Extract detailed requests
function extractMustInclude(req?: string): string[] {
    if (!req) return [];
    // Split by newlines or commas, filter empty
    return req.split(/[\n,]/)
        .map(s => s.trim())
        .filter(s => s.length > 0 && s.length < 20); // Limit length to avoid long sentences
}

// Helper: Constraints Builder
function buildConstraints(goal: string) {
    const isPromo = ["discount", "open", "new_menu", "season", "event"].includes(goal);
    return {
        noEllipsis: true,
        banPhrases: ["최고의", "맛있는", "친절한", "행복한", "특별한"], // C2 Standard Ban List
        noPlaceholders: true,
        requireOfferPeriodContactByGoal: isPromo
    };
}

export function normalizeInput(input: FlyerInputs, productType: FlyerType = 'flyer'): NormalizedBrief {
    // 1. Basic Mapping
    const contactNormalized = normalizeContactValue(input.contactValue || "");
    const periodNormalized = normalizePeriodText(input.period || "");

    // 2. Token Parsing
    const offerTokens = parseOfferTokens(input.offer || "");

    // 3. Extract Hints from Details
    const mustInclude = extractMustInclude(input.additionalBrief);

    // 4. Inferred Audience Hint (Simple logic for now)
    const audienceHint: string[] = [];
    if (input.category === "식당/카페") audienceHint.push("맛집 탐방러", "직장인 점심");
    if (input.category === "학원/교육") audienceHint.push("학부모", "수험생");
    if (input.offer?.includes("할인")) audienceHint.push("가성비 추구");

    // 5. Inferred Proof Hint
    const proofHint: string[] = [];
    if (offerTokens.limited) proofHint.push("재고가 빠르게 소진됨");
    if (input.goal === "open") proofHint.push("새로 오픈하여 깨끗함");

    // 6. Constraints
    const constraints = buildConstraints(input.goal || "default");

    const normalized: NormalizedBrief = {
        productType,
        style: "default",
        industry: input.category,
        goal: input.goal || "default",
        storeName: input.name,
        offerRaw: input.offer || "",
        brandSubject: input.brandSubject,
        targetAudience: input.targetAudience,
        coreBenefit: input.coreBenefit,
        periodRaw: input.period || "",
        contactChannel: input.contactType,
        contactValueRaw: input.contactValue || "",
        referenceUrl: input.referenceUrl,

        offerTokens,
        periodNormalized,
        contactNormalized,

        mustInclude,
        audienceHint,
        proofHint,

        v09_extra: {
            extraNotes: input.extraNotes,
            // V3.3 Enterprise Leaflet Strategic Fields
            brandStory: input.brandStory,
            serviceDetails: input.serviceDetails,
            trustPoints: input.trustPoints,
            locationTip: input.locationTip,
            textVolume: input.textVolume, // [CRITICAL FIX] Map Text Volume

            // V5.1 Semantic Modular Fields
            selectedModules: input.selectedModules,
            moduleData: input.moduleData,
            websiteUrl: input.websiteUrl,
            instagramId: input.instagramId,
            businessAddress: input.businessAddress,
            officePhone: input.officePhone,
            disclaimerHint: input.disclaimerHint,

            // Generate semantic orchestration prompt for AI (Level 3 Engine)
            orchestrationPrompt: productType === 'leaflet' ? `
    [LEVEL 3 BRAND ORCHESTRATION ENGINE: ACTIVATED]
    
    [ROLE DEFINITION]
    You are an elite Editor-in-Chief. The client has sent you very poor, rough notes.
    Your task is to IGNORE their phrasing and rewrite everything into professional, persuasive marketing copy.
    
    [THE PROHIBITED LIST]
    - Do NOT output the text inside "ROUGH_DRAFT" as is.
    - Do NOT use the word "Unique" unless you prove it.
    - Do NOT make a list if a story is better.

    [CLIENT'S ROUGH DRAFT (DO NOT COPY - REWRITE!)]
    <ROUGH_DRAFT>
    ${Object.entries(input.moduleData || {}).map(([k, v]: [string, any]) => `- [Context: ${k}]: ${JSON.stringify(v)}`).join("\n")}
    </ROUGH_DRAFT>

    [INSTRUCTIONS]
    1. Read the "Context" above.
    2. Think: "How would a luxury brand say this?" or "How would a top consultant say this?"
    3. Output ONLY the upgraded version.
    
    [PHASE 3: MODULE PERSONAS]
    - Brand Story: Emotional, Authentic, Visionary. (Rewrite the input!)
    - Service: Professional, Benefit-focused. (Expand the input!)
    - Review: Credible, Specific. (Polish the input!)
    ` : "",
        },

        constraints,
        original_input: input
    };

    return normalized;
}

// PII Masking (Legacy Support for logging, if needed)
export function maskPII(inputs: any) {
    // Basic passthrough for now to satisfy imports elsewhere if any
    return { maskedInputs: inputs, tokenMap: {} };
}
export function restorePIIStruct(obj: any, map: any) {
    return obj;
}
