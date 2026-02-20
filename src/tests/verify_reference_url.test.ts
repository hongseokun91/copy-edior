
import { describe, it, expect, vi } from 'vitest';
import { analyzeBrief } from '../lib/poster/poster-engine';
import * as Scraper from '../lib/poster/scraper';

describe('Poster Engine - Reference URL Verification', () => {
    it('should use referenceUrl when provided and populate scrapedContext', async () => {
        // Mock scrapeUrl
        const mockScrapedData = {
            url: "https://test.com",
            extractedText: "Mocked Extracted Text",
            visualVibe: "Mocked Vibe",
            screenshotBase64: "data:image/png;base64,mock"
        };

        vi.spyOn(Scraper, 'scrapeUrl').mockResolvedValue(mockScrapedData);

        const brief = "Test Brief";
        const referenceUrl = "https://test.com";

        const result = await analyzeBrief(brief, "General", referenceUrl);

        expect(Scraper.scrapeUrl).toHaveBeenCalledWith(referenceUrl);
        expect(result.scrapedContext).toBeDefined();
        expect(result.scrapedContext?.url).toBe(referenceUrl);
        expect(result.scrapedContext?.text).toBe(mockScrapedData.extractedText);
        expect(result.scrapedContext?.vibe).toBe(mockScrapedData.visualVibe);
    });

    it('should fallback to extracting URL from brief if referenceUrl is not provided', async () => {
        const mockScrapedData = {
            url: "https://extracted.com",
            extractedText: "Extracted Content",
            visualVibe: "Extracted Vibe",
            screenshotBase64: "data:image/png;base64,mock"
        };

        vi.spyOn(Scraper, 'scrapeUrl').mockResolvedValue(mockScrapedData);

        const brief = "Check this out: https://extracted.com";

        const result = await analyzeBrief(brief, "General");

        expect(Scraper.scrapeUrl).toHaveBeenCalledWith("https://extracted.com");
        expect(result.scrapedContext).toBeDefined();
        expect(result.scrapedContext?.url).toBe("https://extracted.com");
    });
});
