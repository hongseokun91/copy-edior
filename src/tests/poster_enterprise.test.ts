import { describe, it, expect } from 'vitest';
import { enforceDensityBudget, findForbidden, missingRequiredSlots } from '@/lib/poster/gates';
import { guessIntentFromBrief, guessClaimPolicyMode } from '@/lib/poster/router';
import { BLUEPRINTS } from '@/lib/poster/blueprints.registry';
import { PosterMeta } from '@/types/poster';

describe('Poster Generator Enterprise Logic', () => {

    it('should enforces density budget', () => {
        const meta: PosterMeta = {
            intentId: 'INT_PROMO_OFFER',
            headlineType: 'HL_OFFER_FIRST',
            channelPack: 'PACK_PRINT_A2',
            densityProfile: 'DENSITY_MINIMAL', // Headline Max 16
            claimPolicyMode: 'standard',
            brief: "Test brief",
        };

        const longText = "This headline is way too long for the density profile";
        const trimmed = enforceDensityBudget(meta, 'S_HEADLINE', longText);
        expect(trimmed.length).toBeLessThanOrEqual(16);
    });

    it('should detect forbidden phrases in strict mode', () => {
        const meta: PosterMeta = {
            intentId: 'INT_PUBLIC_NOTICE',
            headlineType: 'HL_AUTHORITY_FIRST',
            channelPack: 'PACK_PRINT_A2',
            densityProfile: 'DENSITY_STANDARD',
            claimPolicyMode: 'strict',
            brief: "Strict notice",
        };

        const riskyText = "이 약을 먹으면 100% 완치됩니다. 수익 보장합니다.";
        const detected = findForbidden(riskyText, meta);

        expect(detected).toContain('100%');
        expect(detected).toContain('완치');
        expect(detected).toContain('수익 보장');
    });

    it('should lock required slots based on blueprint', () => {
        const blueprint = BLUEPRINTS['INT_RECRUITING'];
        const content = {
            S_HEADLINE: "We are hiring",
            // Missing S_ROLE_TITLE, S_ELIGIBILITY, etc.
        };

        const missing = missingRequiredSlots(blueprint, content);
        expect(missing).toContain('S_ROLE_TITLE');
        expect(missing).toContain('S_DEADLINE');
    });

    it('should guess intent and policy correctly', () => {
        const publicBrief = "시청에서 주관하는 청년 지원사업 공고입니다.";
        const publicIntent = guessIntentFromBrief(publicBrief);
        const publicPolicy = guessClaimPolicyMode(publicBrief, publicIntent);

        expect(publicIntent).toBe('INT_PUBLIC_NOTICE');
        expect(publicPolicy).toBe('strict');

        const cesBrief = "2026 CES Poster";
        const cesIntent = guessIntentFromBrief(cesBrief);
        expect(cesIntent).toBe('INT_EVENT_GUIDE');
    });
});
