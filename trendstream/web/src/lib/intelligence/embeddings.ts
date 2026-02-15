
/**
 * Simulated Embedding Generator for MVP.
 * In production, this would call OpenAI or Vercel AI SDK.
 */

// Simulating 1536 dimensions (ADA-002 style) but with a simple deterministic hash
// to avoid API costs during development verification.
export async function generateEmbedding(text: string): Promise<number[]> {
    const embedding = new Array(1536).fill(0);

    // Simple hash function to seed the vector
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    // Fill vector deterministically based on hash
    // This ensures the same text always gets the same "random" vector
    // allowing us to test stability.
    for (let i = 0; i < 1536; i++) {
        const val = Math.sin(hash + i) * 0.1; // Small float values
        embedding[i] = val;
    }

    return embedding;
}
