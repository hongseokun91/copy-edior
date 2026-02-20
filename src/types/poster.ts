export type PosterIntentId =
    | "INT_PROMO_OFFER"
    | "INT_PRODUCT_LAUNCH"
    | "INT_EVENT_GUIDE"
    | "INT_RECRUITING"
    | "INT_PUBLIC_NOTICE"
    | "INT_BRAND_CAMPAIGN"
    | "INT_B2B_SEMINAR"
    | "INT_ADAPTIVE";

export type HeadlineType =
    | "HL_OFFER_FIRST"
    | "HL_AUDIENCE_FIRST"
    | "HL_PROBLEM_FIRST"
    | "HL_AUTHORITY_FIRST";

export type ChannelPack =
    | "PACK_PRINT_A2"
    | "PACK_SIGNAGE_16_9"
    | "PACK_SNS_1_1"
    | "PACK_SNS_9_16";

export type DensityProfileId = "DENSITY_MINIMAL" | "DENSITY_STANDARD" | "DENSITY_DETAILED";
export type DensityProfile = DensityProfileId;
export type ClaimPolicyMode = "standard" | "strict";

export type PosterSlotId =
    | "S_HEADLINE"
    | "S_SUBHEAD"
    | "S_CTA"
    | "S_CONTACT_MINI"
    | "S_QR"
    // Promo/Offer
    | "S_OFFER_MAIN"
    | "S_PERIOD"
    | "S_CONDITIONS"
    | "S_EXCLUSIONS"
    | "S_LOCATION_OR_CHANNEL"
    | "S_LIMITED_STOCK"
    | "S_MENU_OR_ITEMS"
    // Product
    | "S_PRODUCT_NAME"
    | "S_KEY_FEATURES_3"
    | "S_LAUNCH_PERIOD"
    | "S_PRICE_OR_TRIAL"
    | "S_CHANNEL"
    | "S_SPEC_MINI"
    | "S_GIFT_BONUS"
    // Event
    | "S_EVENT_TITLE"
    | "S_DATETIME"
    | "S_LOCATION"
    | "S_PROGRAM_HIGHLIGHTS"
    | "S_TICKET_OR_REGISTER"
    | "S_TIMETABLE_MINI"
    | "S_HOST_ORGANIZER"
    | "S_CAUTION_RULES"
    | "S_SPONSORS_LOGOS"
    // Recruiting
    | "S_ROLE_TITLE"
    | "S_ELIGIBILITY"
    | "S_DEADLINE"
    | "S_HOW_TO_APPLY"
    | "S_BENEFITS_TOP3"
    | "S_PROCESS_STEPS_MINI"
    | "S_TEAM_CULTURE_ONE"
    | "S_LOCATION_WORKMODE"
    | "S_FAQ_MINI"
    // Public
    | "S_NOTICE_TITLE"
    | "S_TARGET"
    | "S_PROCEDURE"
    | "S_CONTACT_OFFICIAL"
    | "S_LEGAL_OR_BASIS"
    | "S_DISCLAIMER"
    | "S_REQUIRED_DOCS_MINI"
    | "S_SELECTION_CRITERIA_MINI"
    // Brand
    | "S_SLOGAN"
    | "S_ONE_IDEA"
    | "S_BRAND_SIGNATURE"
    | "S_MANIFESTO_3LINES"
    | "S_HASH_TAGS"
    | "S_VISUAL_BRIEF"
    // B2B Seminar
    | "S_SEMINAR_TITLE"
    | "S_TARGET_AUDIENCE"
    | "S_AGENDA_3"
    | "S_SPEAKER_OR_HOST"
    | "S_REGISTER_LINK_OR_QR"
    | "S_BENEFIT_FOR_ATTENDEE"
    | "S_LIMITED_SEATS"
    | "S_COMPANY_LOGOS";

export type HeadlineBadge = {
    length: "short" | "medium" | "long";
    densityFit: DensityProfile;  // 후보가 최적으로 맞는 밀도
    tone: "friendly" | "premium" | "official" | "tech" | "investor";
    risk: "low" | "medium" | "high";
};

export type HeadlineCandidate = {
    id: string; // Added ID for UI selection since it was missing in spec but needed
    text: string;
    typeHint: HeadlineType;
    badges: HeadlineBadge;
    score: number; // 내부 점수(Top3 선정용)
};

export type PosterBlueprint = {
    intentId: PosterIntentId;
    requiredSlots: PosterSlotId[];
    recommendedSlots: PosterSlotId[];
    slotOrder: PosterSlotId[];
    slotInstructions?: Record<string, string>;
};

export type PosterFactSheet = {
    who: string;      // 타겟 (Target Audience)
    what: string;     // 핵심내용 (Key Content)
    why: string;      // 목적 (Purpose)
    tone: string;     // 분위기 (Tone & Manner)
    keywords: string[]; // 강조 키워드 (Mandatory Keywords)
};

export type PosterMeta = {
    intentId: PosterIntentId;
    headlineType: HeadlineType;
    channelPack: ChannelPack;
    densityProfile: DensityProfile;
    claimPolicyMode: ClaimPolicyMode;
    brief: string; // Added for context
    industryHint?: string; // 옵션
    facts?: PosterFactSheet; // [V5] Structured Input
    scrapedContext?: {
        url: string;
        text: string;
        vibe: string;
    };
    referenceUrl?: string; // User provided reference URL
};

export type PosterResult = {
    meta: PosterMeta;
    headlineCandidates: {
        setA: HeadlineCandidate[];
        setB: HeadlineCandidate[];
        setC: HeadlineCandidate[];
        recommendedTop3: HeadlineCandidate[];
    };
    blueprint: PosterBlueprint;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: Partial<Record<PosterSlotId, any>>;
    compliance: {
        warnings: string[];
        requiredDisclaimers: string[];
    };
};

// --- AI Analysis Types ---

export type ExtractedFacts = {
    dates: string[];
    prices: string[];
    locations: string[];
    contacts: string[];
    timeline: string[]; // e.g. "14:00 ~ 16:00"
};

export type PosterAnalysisResult = {
    meta: PosterMeta;
    extractedFacts: ExtractedFacts;
    rationale: string; // Strategy/Angle explanation
    suggestedSlots?: PosterSlotId[]; // Adaptive slots
};
