import { VariantContent } from "./leaflet";

export type FlyerType = 'flyer' | 'leaflet' | 'brochure' | 'poster';
export type FlyerTone = 'friendly' | 'premium' | 'direct';

export interface FlyerInputs {
  category: string;
  goal?: string;
  name: string;
  offer?: string;
  brandSubject?: string; // New: Core subject (e.g. "Tax Consulting")
  targetAudience?: string; // New: Target (e.g. "CEO")
  coreBenefit?: string; // New: Benefit (e.g. "30M KRW Saving")
  period?: string; // "Standardized" text or chip value
  contactType: 'phone' | 'kakao' | 'naver';
  contactValue?: string;

  // V3.1 Extended Input
  styleId?: string; // V0.9 Integrated styleId
  subCategory?: string;
  additionalBrief?: string;

  // v0.9 Extra Modules (FF_EXTRA_MODULES)
  extraNotes?: string;
  extraModules?: string[]; // [coupon, price, parking, guide, faq, caution]

  // V3.3 Enterprise Leaflet Strategic Fields
  brandStory?: string;
  serviceDetails?: string;
  trustPoints?: string;
  locationTip?: string;

  // Optional fields (folded in UI)
  location?: string;
  hours?: string;
  usp?: string;
  target?: string;
  convenience?: string;
  disclaimerHint?: string;
  selectedModules?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moduleData?: Record<string, any>;
  websiteUrl?: string;
  instagramId?: string;
  businessAddress?: string;
  officePhone?: string;
  textVolume?: 'short' | 'standard' | 'detailed';
  referenceUrl?: string; // Unified Reference URL
}

export interface FlyerSlots {
  // --- CORE V2 ---
  HEADLINE: string; // 18-22 chars
  SUBHEAD: string; // 32 chars
  BENEFIT_BULLETS: string[]; // 3-5 items, min 3
  CTA: string; // 16 chars
  INFO: string; // Addr/Time/Contact
  DISCLAIMER?: string; // 40 chars

  // --- EXTENDED V3 (Rich) ---
  hookLine: string; // Emotional hook (1 line)
  proofLine: string; // Concrete evidence (1 line)
  valueProps: string[]; // 3-5 items (Benefit/Diff/Conv Mix)
  offerBlock: string; // Summary of Deal
  urgencyLine: string; // FOMO
  microCTA: string[]; // [Call, Book] (Short labels)
  posterShort: string; // 2 lines for poster top
  bannerShort: string[]; // [Ad1, Ad2] (<18 chars)
  hashtags: string[]; // 6-12 tags
  altHeadlines: string[]; // 3 alternatives

  // V3.2 P1-3: Copy Kit Extension
  headlineVariations?: string[]; // 5 items
  subheadVariations?: string[]; // 5 items
  ctaVariations?: string[]; // 8 items
  benefitVariations?: string[]; // 5 items
  trustVariations?: string[]; // 3 items (Trust/Anxiety relief)
}

export interface FlyerVariant {
  id: 'A' | 'B' | 'C';
  type: 'boss' | 'designer'; // Display mode
  data: FlyerSlots;
}

export interface GenerateRequest {
  type: FlyerType;
  tone: FlyerTone;
  styleId: string;
  inputs: FlyerInputs;
}

export interface GenerateResponse {
  variants: {
    A: VariantContent;
    B: VariantContent;
    C: VariantContent;
  };
  meta: {
    rateLimit: {
      remaining: number;
      resetAtKST: string;
    };
    cacheHit: boolean;
    normalized: {
      period: string;
      contact: string;
    };
    warnings: string[];
    warRoomLogs?: string; // v7: War Room Logs
    traceId?: string; // v1.4: Universal Trace ID
    engine_v?: string; // [ECO v3] Engine version tracking
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug?: any; // P0-3 Debug Payload
  };
}
