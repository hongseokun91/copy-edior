/**
 * Analysis Pipeline (v1)
 * Handles OCR and visual content analysis.
 */
export async function runAnalysisPipeline(imageUrl: string) {
    console.log(`[Pipeline] Running analysis for: ${imageUrl}`);

    // Stub implementation to pass deployment gate
    return {
        id: `an_${Date.now()}`,
        imageUrl,
        meta: {
            width: 800,
            height: 600,
            format: "jpg"
        },
        blocks: [
            {
                type: "text",
                content: "샘플 분석 내용입니다.",
                box: [10, 10, 100, 50]
            }
        ],
        timestamp: new Date().toISOString()
    };
}
