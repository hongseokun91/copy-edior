
import { FlyerType } from "./flyer";

export type FactStatus = "yes" | "no" | "paid" | "unknown";
export type OfferType = "free_test" | "free_trial" | "discount" | "coupon" | "event" | "none";

// C2: Server Internal NormalizedBrief (Strict)
export interface NormalizedBrief {
    // 1. Raw Inputs (Preserved)
    productType: FlyerType;
    style: string;
    industry: string;
    goal: string;
    storeName: string;
    offerRaw: string;
    brandSubject?: string;
    targetAudience?: string;
    coreBenefit?: string;
    periodRaw: string;
    contactChannel: string;
    contactValueRaw: string;

    // 2. Parsed / Normalized
    offerTokens: {
        discountRate?: string;
        bogo?: boolean;
        gift?: string;
        limited?: boolean;
        targetTime?: string;
        condition?: string;
    };
    periodNormalized: string; // e.g. "2/1 ~ 2/14"
    contactNormalized: string; // e.g. "010-1234-5678"

    // 3. Extracted hints
    mustInclude: string[];   // From detailRequest
    audienceHint: string[];  // Inferred from industry/goal
    proofHint: string[];     // extracted reasons

    // 4. Constraints
    constraints: {
        noEllipsis: boolean;
        banPhrases: string[];
        noPlaceholders: boolean;
        requireOfferPeriodContactByGoal: boolean;
    };

    // 5. Verification
    facts?: Record<string, 'yes' | 'no' | 'paid' | 'unknown' | string>;

    // 6. v0.9 Extras
    v09_extra?: {
        extraNotes?: string;
        extraModules?: string[];
        // V3.3 Enterprise Leaflet Strategic Fields
        brandStory?: string;
        serviceDetails?: string;
        trustPoints?: string;
        locationTip?: string;
        orchestrationPrompt?: string;
        selectedModules?: string[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        moduleData?: Record<string, any>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata?: Record<string, any>;
        websiteUrl?: string;
        instagramId?: string;
        businessAddress?: string;
        officePhone?: string;
        disclaimerHint?: string;
    };

    // Legacy (Optional compatibility)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raw_analysis?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    original_input?: any;
}
