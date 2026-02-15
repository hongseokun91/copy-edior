import type { ChannelPack, DensityProfileId } from "@/types/poster";

export type CharBudget = {
    headlineMax: number;
    subheadMax: number;
    blockLineMax: number;   // 한 블록당 권장 줄 수
    blockCharsMax: number;  // 한 블록당 권장 글자수
};

export const CHAR_BUDGETS: Record<ChannelPack, Record<DensityProfileId, CharBudget>> = {
    PACK_PRINT_A2: {
        DENSITY_MINIMAL: { headlineMax: 16, subheadMax: 26, blockLineMax: 2, blockCharsMax: 34 },
        DENSITY_STANDARD: { headlineMax: 22, subheadMax: 40, blockLineMax: 3, blockCharsMax: 54 },
        DENSITY_DETAILED: { headlineMax: 30, subheadMax: 60, blockLineMax: 4, blockCharsMax: 80 },
    },
    PACK_SIGNAGE_16_9: {
        DENSITY_MINIMAL: { headlineMax: 14, subheadMax: 22, blockLineMax: 2, blockCharsMax: 30 },
        DENSITY_STANDARD: { headlineMax: 18, subheadMax: 34, blockLineMax: 2, blockCharsMax: 40 },
        DENSITY_DETAILED: { headlineMax: 24, subheadMax: 44, blockLineMax: 3, blockCharsMax: 60 },
    },
    PACK_SNS_1_1: {
        DENSITY_MINIMAL: { headlineMax: 16, subheadMax: 24, blockLineMax: 2, blockCharsMax: 34 },
        DENSITY_STANDARD: { headlineMax: 20, subheadMax: 34, blockLineMax: 3, blockCharsMax: 50 },
        DENSITY_DETAILED: { headlineMax: 24, subheadMax: 44, blockLineMax: 3, blockCharsMax: 60 },
    },
    PACK_SNS_9_16: {
        DENSITY_MINIMAL: { headlineMax: 14, subheadMax: 22, blockLineMax: 2, blockCharsMax: 32 },
        DENSITY_STANDARD: { headlineMax: 18, subheadMax: 34, blockLineMax: 3, blockCharsMax: 48 },
        DENSITY_DETAILED: { headlineMax: 22, subheadMax: 44, blockLineMax: 4, blockCharsMax: 70 },
    },
};
