import type { PosterBlueprint } from "@/types/poster";

export const BLUEPRINTS: Record<string, PosterBlueprint> = {
    INT_PROMO_OFFER: {
        intentId: "INT_PROMO_OFFER",
        requiredSlots: ["S_HEADLINE", "S_OFFER_MAIN", "S_PERIOD", "S_CONDITIONS", "S_CTA", "S_LOCATION_OR_CHANNEL"],
        recommendedSlots: ["S_QR", "S_LIMITED_STOCK", "S_MENU_OR_ITEMS", "S_CONTACT_MINI"],
        slotOrder: ["S_HEADLINE", "S_SUBHEAD", "S_OFFER_MAIN", "S_PERIOD", "S_CONDITIONS", "S_EXCLUSIONS", "S_CTA", "S_QR", "S_LOCATION_OR_CHANNEL", "S_CONTACT_MINI"],
        slotInstructions: {
            "S_HEADLINE": "Max 15 chars. Must mention the Key Benefit or Offer explicitly. No ambiguity.",
            "S_OFFER_MAIN": "Big typography. The number (e.g. 50%) or price must be the focal point.",
            "S_CONDITIONS": "Small text. Be honest but minimal.",
            "S_CTA": "Action-oriented. Use verbs like 'Get', 'Visit', 'Order'."
        }
    },
    INT_PRODUCT_LAUNCH: {
        intentId: "INT_PRODUCT_LAUNCH",
        requiredSlots: ["S_HEADLINE", "S_PRODUCT_NAME", "S_KEY_FEATURES_3", "S_LAUNCH_PERIOD", "S_CTA", "S_CHANNEL"],
        recommendedSlots: ["S_PRICE_OR_TRIAL", "S_SPEC_MINI", "S_GIFT_BONUS", "S_QR", "S_CONTACT_MINI"],
        slotOrder: ["S_HEADLINE", "S_SUBHEAD", "S_PRODUCT_NAME", "S_KEY_FEATURES_3", "S_SPEC_MINI", "S_LAUNCH_PERIOD", "S_PRICE_OR_TRIAL", "S_GIFT_BONUS", "S_CTA", "S_QR", "S_CHANNEL", "S_CONTACT_MINI"],
        slotInstructions: {
            "S_HEADLINE": "Problem-Solution hook. 'Finally, X is here' or 'Why suffer from Y?'.",
            "S_KEY_FEATURES_3": "3 bullet points. Focus on 'New capabilities' or 'Quality difference'.",
            "S_LAUNCH_PERIOD": "Create urgency. 'Launch Special' or 'Pre-order Now'."
        }
    },
    INT_EVENT_GUIDE: {
        intentId: "INT_EVENT_GUIDE",
        requiredSlots: ["S_HEADLINE", "S_EVENT_TITLE", "S_DATETIME", "S_LOCATION", "S_PROGRAM_HIGHLIGHTS", "S_TICKET_OR_REGISTER", "S_CTA"],
        recommendedSlots: ["S_TIMETABLE_MINI", "S_HOST_ORGANIZER", "S_CAUTION_RULES", "S_SPONSORS_LOGOS", "S_QR"],
        slotOrder: ["S_HEADLINE", "S_SUBHEAD", "S_EVENT_TITLE", "S_DATETIME", "S_LOCATION", "S_PROGRAM_HIGHLIGHTS", "S_TIMETABLE_MINI", "S_TICKET_OR_REGISTER", "S_CAUTION_RULES", "S_CTA", "S_QR", "S_HOST_ORGANIZER", "S_SPONSORS_LOGOS"],
        slotInstructions: {
            "S_HEADLINE": "Clear and Inviting. Project the vibe of the event (Fun vs Serious).",
            "S_DATETIME": "Must be absolutely clear. Use standard format (YYYY.MM.DD).",
            "S_LOCATION": "Include landmark if possible (e.g. 'Near Gangnam Station').",
            "S_PROGRAM_HIGHLIGHTS": "Brief summary of what attendees will experience."
        }
    },
    INT_RECRUITING: {
        intentId: "INT_RECRUITING",
        requiredSlots: ["S_HEADLINE", "S_ROLE_TITLE", "S_ELIGIBILITY", "S_DEADLINE", "S_HOW_TO_APPLY", "S_CTA"],
        recommendedSlots: ["S_BENEFITS_TOP3", "S_PROCESS_STEPS_MINI", "S_LOCATION_WORKMODE", "S_FAQ_MINI", "S_QR"],
        slotOrder: ["S_HEADLINE", "S_SUBHEAD", "S_ROLE_TITLE", "S_ELIGIBILITY", "S_BENEFITS_TOP3", "S_LOCATION_WORKMODE", "S_PROCESS_STEPS_MINI", "S_DEADLINE", "S_HOW_TO_APPLY", "S_CTA", "S_QR", "S_FAQ_MINI"],
        slotInstructions: {
            "S_HEADLINE": "Attract the right talent. Focus on 'Growth', 'Vision', or 'Benefits'.",
            "S_ROLE_TITLE": "Standard job title. Avoid jargon.",
            "S_BENEFITS_TOP3": "Why work here? (e.g. Flexible hours, Meals, Bonus).",
            "S_HOW_TO_APPLY": "Simple steps. URL or Email."
        }
    },
    INT_PUBLIC_NOTICE: {
        intentId: "INT_PUBLIC_NOTICE",
        requiredSlots: ["S_HEADLINE", "S_NOTICE_TITLE", "S_TARGET", "S_PERIOD", "S_PROCEDURE", "S_CONTACT_OFFICIAL", "S_LEGAL_OR_BASIS", "S_DISCLAIMER"],
        recommendedSlots: ["S_REQUIRED_DOCS_MINI", "S_SELECTION_CRITERIA_MINI", "S_FAQ_MINI", "S_QR"],
        slotOrder: ["S_HEADLINE", "S_NOTICE_TITLE", "S_TARGET", "S_PERIOD", "S_PROCEDURE", "S_REQUIRED_DOCS_MINI", "S_SELECTION_CRITERIA_MINI", "S_DISCLAIMER", "S_CONTACT_OFFICIAL", "S_LEGAL_OR_BASIS", "S_QR", "S_FAQ_MINI"],
        slotInstructions: {
            "S_HEADLINE": "Formal and authoritative. No exclamation marks.",
            "S_TARGET": "Who is eligible? Be precise.",
            "S_PROCEDURE": "Step-by-step guide. Numbered list.",
            "S_DISCLAIMER": "Official warning or legal note. Use small font logic."
        }
    },
    INT_BRAND_CAMPAIGN: {
        intentId: "INT_BRAND_CAMPAIGN",
        requiredSlots: ["S_HEADLINE", "S_SLOGAN", "S_ONE_IDEA", "S_BRAND_SIGNATURE"],
        recommendedSlots: ["S_MANIFESTO_3LINES", "S_VISUAL_BRIEF", "S_HASH_TAGS", "S_CTA"],
        slotOrder: ["S_HEADLINE", "S_SLOGAN", "S_ONE_IDEA", "S_MANIFESTO_3LINES", "S_VISUAL_BRIEF", "S_HASH_TAGS", "S_CTA", "S_BRAND_SIGNATURE"],
        slotInstructions: {
            "S_HEADLINE": "Abstract and emotional. Connect with values.",
            "S_SLOGAN": "Short, punchy, memorable phrase.",
            "S_ONE_IDEA": "The single thought you want to leave with the audience.",
            "S_MANIFESTO_3LINES": "Short poetic description of the brand philosophy."
        }
    },
    INT_B2B_SEMINAR: {
        intentId: "INT_B2B_SEMINAR",
        requiredSlots: ["S_HEADLINE", "S_SEMINAR_TITLE", "S_DATETIME", "S_TARGET_AUDIENCE", "S_AGENDA_3", "S_SPEAKER_OR_HOST", "S_REGISTER_LINK_OR_QR", "S_CTA"],
        recommendedSlots: ["S_BENEFIT_FOR_ATTENDEE", "S_LIMITED_SEATS", "S_COMPANY_LOGOS", "S_FAQ_MINI"],
        slotOrder: ["S_HEADLINE", "S_SUBHEAD", "S_SEMINAR_TITLE", "S_DATETIME", "S_TARGET_AUDIENCE", "S_AGENDA_3", "S_BENEFIT_FOR_ATTENDEE", "S_SPEAKER_OR_HOST", "S_LIMITED_SEATS", "S_REGISTER_LINK_OR_QR", "S_CTA", "S_COMPANY_LOGOS", "S_FAQ_MINI"],
        slotInstructions: {
            "S_HEADLINE": "High-value proposition. Focus on 'ROI', 'Insight', 'Future'.",
            "S_SPEAKER_OR_HOST": "Establish authority. Title/Company.",
            "S_AGENDA_3": "3 key takeaways. Practical value.",
            "S_LIMITED_SEATS": "Scarcity. 'First come first serve' or 'Only 50 seats'."
        }
    },
    INT_ADAPTIVE: {
        intentId: "INT_ADAPTIVE",
        requiredSlots: ["S_HEADLINE", "S_SUBHEAD", "S_CTA"],
        recommendedSlots: ["S_VISUAL_BRIEF", "S_CONTACT_MINI"],
        slotOrder: ["S_HEADLINE", "S_SUBHEAD", "S_VISUAL_BRIEF", "S_CTA", "S_CONTACT_MINI"],
        slotInstructions: {
            "S_HEADLINE": "Determine the most impactful hook based on the vague brief.",
            "S_SUBHEAD": "Clarify the offer or message.",
            "S_VISUAL_BRIEF": "Suggest a layout or image that fits the inferred mood."
        }
    },
};
