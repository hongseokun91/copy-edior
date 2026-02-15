
import { describe, it, expect } from 'vitest';
import { normalizeUrl } from './normalization';

describe('normalizeUrl', () => {
    it('identifies YouTube URLs', () => {
        const result = normalizeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        expect(result.platform).toBe('youtube');
        expect(result.externalId).toBe('dQw4w9WgXcQ');
    });

    it('identifies YouTube Short URLs', () => {
        const result = normalizeUrl('https://youtu.be/dQw4w9WgXcQ');
        expect(result.platform).toBe('youtube');
        expect(result.externalId).toBe('dQw4w9WgXcQ');
    });

    it('identifies Instagram Reels', () => {
        const result = normalizeUrl('https://www.instagram.com/reel/C3sampl3Code/');
        expect(result.platform).toBe('instagram');
        expect(result.externalId).toBe('C3sampl3Code');
    });

    it('identifies TikTok Videos', () => {
        const result = normalizeUrl('https://www.tiktok.com/@user/video/7312345678901234567');
        expect(result.platform).toBe('tiktok');
        expect(result.externalId).toBe('7312345678901234567');
    });

    it('handles unknown URLs', () => {
        const result = normalizeUrl('https://example.com/foo');
        expect(result.platform).toBe('unknown');
        expect(result.externalId).toBeNull();
    });
});
