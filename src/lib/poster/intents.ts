import type { PosterIntentId } from "@/types/poster";

export interface PosterIntent {
    id: PosterIntentId;
    label: string;
    defaultHeadlineType: any;
    role: string;
    objective: string;
    tone_guidance: string;
}

export const POSTER_INTENTS: PosterIntent[] = [
    {
        id: "INT_PROMO_OFFER",
        label: "할인/오퍼",
        defaultHeadlineType: "HL_OFFER_FIRST",
        role: "Energetic Sales Manager",
        objective: "Maximize immediate conversion by emphasizing the value of the deal.",
        tone_guidance: "Urgent, Exciting, but Clear about the conditions."
    },
    {
        id: "INT_PRODUCT_LAUNCH",
        label: "신제품/런칭",
        defaultHeadlineType: "HL_PROBLEM_FIRST",
        role: "Innovative Product Designer",
        objective: "Create curiosity and desire for the new item.",
        tone_guidance: "Sophisticated, Proud, Focusing on 'Newness' and 'Quality'."
    },
    {
        id: "INT_EVENT_GUIDE",
        label: "행사 안내",
        defaultHeadlineType: "HL_AUTHORITY_FIRST",
        role: "Friendly Event Host",
        objective: "Ensure attendees feel welcome and know exactly when/where to go.",
        tone_guidance: "Welcoming, Informative, Organized."
    },
    {
        id: "INT_RECRUITING",
        label: "채용/모집",
        defaultHeadlineType: "HL_AUDIENCE_FIRST",
        role: "Respectful HR Manager",
        objective: "Attract high-quality candidates by showing respect and benefits.",
        tone_guidance: "Professional, Encouraging, Sincere."
    },
    {
        id: "INT_PUBLIC_NOTICE",
        label: "공공 공지/정책",
        defaultHeadlineType: "HL_AUTHORITY_FIRST",
        role: "Reliable Public Official",
        objective: "Deliver critical information without ambiguity or confusion.",
        tone_guidance: "Formal, Trustworthy, Concise. No exaggeration."
    },
    {
        id: "INT_BRAND_CAMPAIGN",
        label: "브랜딩/캠페인",
        defaultHeadlineType: "HL_AUTHORITY_FIRST",
        role: "Visionary Brand Strategist",
        objective: "Imprint the brand's core philosophy into the customer's mind.",
        tone_guidance: "Emotional, Resonant, Inspiring."
    },
    {
        id: "INT_B2B_SEMINAR",
        label: "B2B 세미나",
        defaultHeadlineType: "HL_AUTHORITY_FIRST",
        role: "Professional Industry Expert",
        objective: "Demonstrate authority and the high value of the knowledge shared.",
        tone_guidance: "Intellectual, Premium, Business-focused."
    },
    {
        id: "INT_ADAPTIVE",
        label: "자동 맞춤 (AI)",
        defaultHeadlineType: "HL_OFFER_FIRST",
        role: "Versatile Creative Director",
        objective: "Analyze the ambiguous input and determine the most effective angle dynamically.",
        tone_guidance: "Adaptive, Insightful, Solution-oriented."
    },
];
