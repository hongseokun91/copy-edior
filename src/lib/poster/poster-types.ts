import {
    POSTER_INTENTS,
    HEADLINE_TYPES,
    CHANNEL_PACKS,
    DENSITY_PROFILES,
    SLOT_IDS
} from "./poster-constants";

// Extract Union Types from Constants
export type PosterIntentId = typeof POSTER_INTENTS[number]["id"];
export type HeadlineTypeId = typeof HEADLINE_TYPES[number]["id"];
export type ChannelPackId = typeof CHANNEL_PACKS[number]["id"];
export type DensityProfileId = typeof DENSITY_PROFILES[number]["id"];
export type SlotId = typeof SLOT_IDS[keyof typeof SLOT_IDS];
export type ClaimPolicy = "standard" | "strict";

// Core Enums Interfaced
export interface PosterIntent {
    id: PosterIntentId;
    label: string;
    description: string;
}

export interface HeadlineType {
    id: HeadlineTypeId;
    label: string;
    description: string;
}

export interface ChannelPack {
    id: ChannelPackId;
    label: string;
    ratio: string;
}

// State & Form Types
export interface PosterMetaState {
    intentId?: PosterIntentId;
    headlineType?: HeadlineTypeId;
    channelPack?: ChannelPackId;
    densityProfile?: DensityProfileId;
    claimPolicyMode: ClaimPolicy;
    industryHint?: string;
    facts?: {
        who: string;
        what: string;
        why: string;
        tone: string;
        keywords: string[];
    };
    referenceUrl?: string;
}

export type PosterFactSheet = PosterMetaState;

export interface HeadlineCandidate {
    id: string; // unique
    text: string;
    type: HeadlineTypeId;
    set: "A" | "B" | "C"; // Strategy Set A, B, C
    badges: string[]; // e.g. ["짧음", "공식톤"]
}

export interface PosterBlueprintValidations {
    requiredSlots: SlotId[];
    recommendedSlots: SlotId[];
    prohibitedClaims?: string[]; // e.g., ["최고", "유일"]
}

export interface PosterGeneratorState {
    step: "ENTRY" | "META_CONFIRM" | "HEADLINE" | "BLUEPRINT" | "PREVIEW";
    brief: string;
    meta: PosterMetaState;
    selectedHeadlineId?: string;
    candidates?: Record<"setA" | "setB" | "setC", HeadlineCandidate[]>;
    contentMap: Partial<Record<SlotId, any>>;
}
