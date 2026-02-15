import type { PosterIntentId } from "@/types/poster";

export const POSTER_INTENTS: { id: PosterIntentId; label: string; defaultHeadlineType: any }[] = [
    { id: "INT_PROMO_OFFER", label: "할인/오퍼", defaultHeadlineType: "HL_OFFER_FIRST" },
    { id: "INT_PRODUCT_LAUNCH", label: "신제품/런칭", defaultHeadlineType: "HL_PROBLEM_FIRST" },
    { id: "INT_EVENT_GUIDE", label: "행사 안내", defaultHeadlineType: "HL_AUTHORITY_FIRST" },
    { id: "INT_RECRUITING", label: "채용/모집", defaultHeadlineType: "HL_AUDIENCE_FIRST" },
    { id: "INT_PUBLIC_NOTICE", label: "공공 공지/정책", defaultHeadlineType: "HL_AUTHORITY_FIRST" },
    { id: "INT_BRAND_CAMPAIGN", label: "브랜딩/캠페인", defaultHeadlineType: "HL_AUTHORITY_FIRST" },
    { id: "INT_B2B_SEMINAR", label: "B2B 세미나", defaultHeadlineType: "HL_AUTHORITY_FIRST" },
];
