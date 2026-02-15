export interface Recommendation {
    essential: string[]; // High priority, top of the list
    recommended: string[]; // Secondary priority
}

export const INDUSTRY_RECOMMENDATIONS: Record<string, Recommendation> = {
    "법률/변호사": {
        essential: ["team_profile", "ceo_message", "usp_highlight"],
        recommended: ["awards_certs", "media_report", "faq", "contact_channels"]
    },
    "노무/세무/회계": {
        essential: ["team_profile", "history", "service_process"],
        recommended: ["awards_certs", "pricing_table", "faq", "contact_channels"]
    },
    "치과/교정": {
        essential: ["before_after", "core_service", "team_profile"],
        recommended: ["awards_certs", "customer_review", "detailed_map"]
    },
    "성형/피부과": {
        essential: ["before_after", "usp_highlight", "customer_review"],
        recommended: ["pricing_table", "team_profile", "action_coupon"]
    },
    "안과/라식": {
        essential: ["awards_certs", "core_service", "history"],
        recommended: ["faq", "media_report", "detailed_map"]
    },
    "대입입시전문": {
        essential: ["history", "team_profile", "usp_highlight"],
        recommended: ["customer_review", "media_report", "faq", "contact_channels"]
    },
    "파인다이닝": {
        essential: ["core_service", "brand_story", "product_catalog"],
        recommended: ["media_report", "instagram_id", "detailed_map", "membership"]
    },
    "건축/인테리어": {
        essential: ["before_after", "core_service", "history"],
        recommended: ["partnerships", "usp_highlight", "contact_channels"]
    },
    "운동/헬스": {
        essential: ["usp_highlight", "before_after", "pricing_table"],
        recommended: ["customer_review", "membership", "action_coupon", "detailed_map"]
    }
};

export const DEFAULT_RECOMMENDATION: Recommendation = {
    essential: ["brand_story", "core_service", "contact_channels"],
    recommended: ["usp_highlight", "faq", "awards_certs"]
};

export function getRecommendationsForIndustry(industry: string): Recommendation {
    // Find the closest match or return default
    const matched = Object.entries(INDUSTRY_RECOMMENDATIONS).find(([key]) => industry.includes(key));
    return matched ? matched[1] : DEFAULT_RECOMMENDATION;
}
