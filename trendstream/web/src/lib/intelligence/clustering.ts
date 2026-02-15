
/**
 * Simulated Clustering for MVP.
 * In production, this would use K-Means on pgvector or an external service.
 */

interface ClusterResult {
    clusterId: string;
    name: string;
    patternType: 'hook' | 'structure' | 'cta' | 'visual';
    confidence: number;
}

// Pre-defined "Attractors" (Mock Clusters)
const MOCK_CLUSTERS = [
    { id: 'c-hook-01', name: 'The "Unexpected Expert" Hook', type: 'hook' },
    { id: 'c-struct-02', name: 'ASMR Unboxing Reversal', type: 'structure' },
    { id: 'c-visual-03', name: 'Carousel Storytelling', type: 'visual' },
    { id: 'c-cta-04', name: 'Save-for-Later CTA', type: 'cta' },
] as const;

export async function assignCluster(embedding: number[]): Promise<ClusterResult> {
    // In a real system, we would:
    // 1. Query DB for nearest neighbor centroid.
    // 2. If distance < threshold, assign to that cluster.
    // 3. Else, create new cluster (if outlier detection enabled) or assign to "Uncategorized".

    // For MVP: Deterministically assign based on the first value of the embedding
    // This effectively hacks "similarity" so same inputs go to same clusters.

    const seed = Math.abs(embedding[0] * 1000);
    const index = Math.floor(seed) % MOCK_CLUSTERS.length;
    const match = MOCK_CLUSTERS[index];

    return {
        clusterId: match.id,
        name: match.name,
        patternType: match.type,
        confidence: 0.85 + (seed % 15) / 100, // Randomish confidence 0.85 - 1.00
    };
}
