export type FlyerType = 'flyer' | 'leaflet' | 'brochure';
export type FlyerTone = 'friendly' | 'premium' | 'direct';

export interface FlyerInputs {
  category: string;
  goal: string;
  name: string;
  offer: string;
  period: string; // "Standardized" text or chip value
  contactType: 'phone' | 'kakao' | 'naver';
  contactValue: string;
  // Optional fields (folded in UI)
  location?: string;
  hours?: string;
  usp?: string;
  target?: string;
  convenience?: string;
  disclaimerHint?: string;
}

export interface FlyerSlots {
  HEADLINE: string; // 18 chars
  SUBHEAD: string; // 32 chars
  BENEFIT_BULLETS: string[]; // 3-5 items, 18 chars each
  CTA: string; // 16 chars
  INFO: string; // Addr/Time/Contact (3 lines)
  DISCLAIMER?: string; // 40 chars
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
    A: FlyerSlots;
    B: FlyerSlots;
    C: FlyerSlots;
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
  };
}
