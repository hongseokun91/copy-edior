
export interface NormalizedInput {
    platform: 'youtube' | 'instagram' | 'tiktok' | 'unknown';
    externalId: string | null;
    originalUrl: string;
}

export function normalizeUrl(url: string): NormalizedInput {
    const cleanUrl = url.trim();
    let platform: NormalizedInput['platform'] = 'unknown';
    let externalId: string | null = null;

    try {
        const urlObj = new URL(cleanUrl);
        const hostname = urlObj.hostname.toLowerCase();

        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
            platform = 'youtube';
            if (hostname.includes('youtu.be')) {
                externalId = urlObj.pathname.slice(1);
            } else {
                externalId = urlObj.searchParams.get('v');
            }
        } else if (hostname.includes('instagram.com')) {
            platform = 'instagram';
            // paths like /p/ID/ or /reel/ID/
            const parts = urlObj.pathname.split('/').filter(Boolean);
            if (['p', 'reel', 'reels'].includes(parts[0])) {
                externalId = parts[1] || null;
            }
        } else if (hostname.includes('tiktok.com')) {
            platform = 'tiktok';
            // paths like /@user/video/ID
            const parts = urlObj.pathname.split('/').filter(Boolean);
            const videoIndex = parts.indexOf('video');
            if (videoIndex !== -1 && parts[videoIndex + 1]) {
                externalId = parts[videoIndex + 1];
            }
        }
    } catch (e) {
        // Invalid URL
    }

    return {
        platform,
        externalId,
        originalUrl: cleanUrl,
    };
}
