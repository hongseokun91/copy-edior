
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateAndRefine } from '../lib/copy/engine';
import { generateLeaflet } from '../lib/engines/leaflet-engine';
import { generateBrochure } from '../lib/engines/brochure-engine';
import * as Scraper from '../lib/poster/scraper';

// Mock engine internals to avoid full generation flow
vi.mock('../lib/copy/ideate', () => ({
    ideate: vi.fn().mockResolvedValue({ candidates: [] })
}));
vi.mock('../lib/copy/selector', () => ({
    selectBestCandidate: vi.fn().mockResolvedValue({})
}));
vi.mock('../lib/copy/polish', () => ({
    polish: vi.fn().mockResolvedValue({ HEADLINE: "Mock", SUBHEAD: "Mock" })
}));
vi.mock('../lib/copy/sanitizer', () => ({
    sanitizeVariant: vi.fn().mockReturnValue({})
}));
vi.mock('../lib/copy/schemas', () => ({
    outputVariantSchema: { safeParse: () => ({ success: true, data: {} }) }
}));
vi.mock('../lib/quality/engine', () => ({
    QualityEngine: { evaluate: vi.fn().mockReturnValue({ totalScore: 100 }) }
}));

import * as Provider from '../lib/copy/provider';

// Mock dependencies
vi.mock('../lib/poster/scraper', () => ({
    scrapeUrl: vi.fn()
}));

vi.mock('../lib/copy/provider', () => ({
    safeGenerateText: vi.fn().mockImplementation(async (args) => {
        if (args.passName?.includes('ECO')) {
            return {
                text: JSON.stringify({
                    narrativeAnchor: "Mock Anchor",
                    emotionalArc: "Mock Arc",
                    pageBlueprints: { P1: {}, P2: {}, P3: {}, P4: {}, P5: {}, P6: {} },
                    pages: []
                })
            };
        }
        if (args.passName?.includes('BROCHURE') || args.system?.includes('BROCHURE')) {
            return {
                text: JSON.stringify({
                    pages: []
                })
            };
        }
        return {
            text: `[[CANDIDATE 1]]\nHeadline: Test Start\nSubhead: Sub\nReasoning: AI`
        };
    })
}));

// Mock logger to avoid clutter
vi.mock('../lib/logger', () => ({
    logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        log: vi.fn()
    }
}));

// Mock Redis to avoid connection issues during unit test
vi.mock('../lib/redis', () => ({
    checkRateLimit: vi.fn().mockResolvedValue({ allowed: true }),
    checkCooldown: vi.fn().mockResolvedValue(true),
    getCachedResult: vi.fn().mockResolvedValue(null),
    setCachedResult: vi.fn().mockResolvedValue(true)
}));

describe('Universal URL Backend Integration', () => {
    const mockScrapedData = {
        url: "https://example.com",
        extractedText: "Scraped Content",
        visualVibe: "Modern & Clean",
        screenshotBase64: "base64..."
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(Scraper, 'scrapeUrl').mockResolvedValue(mockScrapedData);
    });

    it('Flyer Engine should scrape referenceUrl', async () => {
        const inputs = {
            category: "Restaurant",
            goal: "Promotion",
            name: "Test Store",
            offer: "50% Off",
            contactType: "phone" as const,
            referenceUrl: "https://example.com/flyer"
        };

        await generateAndRefine("Restaurant", "friendly", inputs, 'flyer');

        expect(Scraper.scrapeUrl).toHaveBeenCalledWith("https://example.com/flyer");
    });

    it('Leaflet Engine should scrape referenceUrl', async () => {
        const inputs = {
            category: "Law Firm",
            name: "Test Law",
            contactType: "phone" as const,
            referenceUrl: "https://example.com/leaflet"
        };

        await generateLeaflet(inputs, "trace_leaflet");

        expect(Scraper.scrapeUrl).toHaveBeenCalledWith("https://example.com/leaflet");
    });

    it('Brochure Engine should scrape referenceUrl', async () => {
        const inputs = {
            category: "Hotel",
            name: "Grand Hotel",
            contactType: "phone" as const,
            referenceUrl: "https://example.com/brochure"
        };

        await generateBrochure(inputs, "trace_brochure");

        expect(Scraper.scrapeUrl).toHaveBeenCalledWith("https://example.com/brochure");
    });
});
