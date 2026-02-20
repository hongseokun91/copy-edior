import { PosterIntentId } from "@/types/poster";

export type IntentSignal = {
    id: string;
    pattern: RegExp;
    weights: Partial<Record<PosterIntentId, number>>;
};

export const INTENT_SIGNALS: IntentSignal[] = [
    // --- 1. Strong Entities (Weight: 100+) ---
    // These define the *Format* of the event/content effectively.
    {
        id: "ENTITY_EXPO_EVENT",
        pattern: /(CES|MWC|IFA|G-STAR|코엑스|박람회|엑스포|페어|전시회|비엔날레|모터쇼|베이비페어|웨딩박람회)/i,
        weights: {
            INT_EVENT_GUIDE: 100,
            INT_PROMO_OFFER: -20, // Expis usually have promos, but are NOT "Sale Posters"
        }
    },
    {
        id: "ENTITY_CONFERENCE",
        pattern: /(컨퍼런스|세미나|웨비나|포럼|학회|심포지엄|서밋|해커톤|데모데이|설명회)/i,
        weights: {
            INT_B2B_SEMINAR: 90,
            INT_EVENT_GUIDE: 40, // Fallback if B2B is too specific/unavailable (though B2B exists)
            INT_PROMO_OFFER: -30
        }
    },
    {
        id: "ENTITY_PERFORMANCE",
        pattern: /(콘서트|공연|뮤지컬|연극|오페라|리사이틀|독주회|페스티벌)/i,
        weights: {
            INT_EVENT_GUIDE: 90,
            INT_PROMO_OFFER: 20 // Early bird tickets exist
        }
    },

    // --- 2. Strong Actions (Weight: 60-80) ---
    {
        id: "ACTION_RECRUIT",
        pattern: /(채용|모집|선발|공채|알바|구인|팀원|크루|서포터즈)/,
        weights: {
            INT_RECRUITING: 80,
            INT_PUBLIC_NOTICE: -10
        }
    },
    {
        id: "ACTION_LAUNCH",
        pattern: /(런칭|출시|오픈|개업|신규|New Arrival|Grand Open)/i,
        weights: {
            INT_PRODUCT_LAUNCH: 120, // Boosted to override concurrent Promo signals (e.g. "Open Sale")
            INT_PROMO_OFFER: 40 // Launches often have promos
        }
    },

    // --- 3. Promo Triggers (Weight: 50) ---
    // Common but easily overridden by Entities
    {
        id: "KEYWORD_DISCOUNT",
        pattern: /(할인|세일|특가|쿠폰|OFF|1\+1|증정|무료|반값)/i,
        weights: {
            INT_PROMO_OFFER: 50
        }
    },
    {
        id: "KEYWORD_SEASONAL",
        pattern: /(추석|설날|명절|크리스마스|여름|겨울|바캉스|블랙프라이데이)/,
        weights: {
            INT_PROMO_OFFER: 40,
            INT_EVENT_GUIDE: 10 // Christmas Party
        }
    },
    {
        id: "KEYWORD_EVENT_GENERIC",
        pattern: /(행사|이벤트|파티|모임|축제|전시|발표회)/,
        weights: {
            INT_EVENT_GUIDE: 40,
            INT_PROMO_OFFER: 10 // Events often have offers
        }
    },

    // --- 4. Public/Official Triggers (Weight: 50) ---
    {
        id: "KEYWORD_OFFICIAL",
        pattern: /(공지|안내문|휴무|점검|변경|중단|실시|시행|의무)/,
        weights: {
            INT_PUBLIC_NOTICE: 60
        }
    },
    {
        id: "KEYWORD_SUPPORT",
        pattern: /(지원사업|보조금|바우처|접수|공고)/,
        weights: {
            INT_PUBLIC_NOTICE: 70, // Usually 'Notice' style
            INT_RECRUITING: 20 // Could be recruiting beneficiaries
        }
    }
];
