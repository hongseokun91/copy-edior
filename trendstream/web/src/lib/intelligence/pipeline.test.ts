
import { describe, it, expect } from 'vitest';
import { generateEmbedding } from './embeddings';
import { assignCluster } from './clustering';

describe('Intelligence Pipeline', () => {
    it('generates deterministic embeddings', async () => {
        const text = 'Test Content';
        const vector1 = await generateEmbedding(text);
        const vector2 = await generateEmbedding(text);

        expect(vector1.length).toBe(1536);
        expect(vector1).toEqual(vector2); // Deterministic check
    });

    it('assigns clusters based on embedding', async () => {
        const vector = await generateEmbedding('The Unexpected Expert Hook');
        const cluster = await assignCluster(vector);

        expect(cluster).toBeDefined();
        expect(cluster.clusterId).toBeDefined();
        expect(cluster.confidence).toBeGreaterThan(0);
    });

    it('consistently clusters similar inputs (simulated)', async () => {
        // In our mock, we use the first value of embedding as seed.
        // Same text -> Same embedding -> Same cluster.
        const text = 'ASMR Unboxing';
        const vector = await generateEmbedding(text);
        const cluster1 = await assignCluster(vector);
        const cluster2 = await assignCluster(vector);

        expect(cluster1.clusterId).toBe(cluster2.clusterId);
    });
});
