"use server";

import { normalizeUrl } from "@/lib/normalization";
import { generateEmbedding } from "@/lib/intelligence/embeddings";
import { assignCluster } from "@/lib/intelligence/clustering";

export async function ingestUrl(formData: FormData) {
    const rawUrl = formData.get("url") as string;

    if (!rawUrl) {
        return { success: false, message: "URL is required" };
    }

    try {
        // 1. Normalize
        const normalized = normalizeUrl(rawUrl);
        if (normalized.platform === 'unknown') {
            return { success: false, message: "Unsupported platform. Use YouTube, Instagram, or TikTok." };
        }

        console.log("Processing:", normalized);

        // 2. Fetch Metadata (Mocked for now)
        // Real implementation would call Platform APIs here
        const mockTitle = `Analysis of ${normalized.platform} content ${normalized.externalId}`;
        const mockAbstract = "Contains fast usage of jump cuts and high-contrast text overlays.";

        // 3. Intelligence Pipeline
        // A. Generate Embedding
        const vector = await generateEmbedding(mockTitle + mockAbstract);

        // B. Assign Cluster
        const cluster = await assignCluster(vector);

        // 4. Save to DB (Stub)
        // In real app: insert into raw_inputs, then metrics_normalized, then pattern_clusters linkage
        console.log("Intelligence Result:", { vectorSignature: vector.slice(0, 5), cluster });

        return {
            success: true,
            message: `Analyzed! Identified pattern: ${cluster.name} (${(cluster.confidence * 100).toFixed(0)}% match)`,
            data: {
                id: "mock-id-" + Math.random(),
                originalUrl: normalized.originalUrl,
                cluster,
                status: "completed"
            }
        };

    } catch (e) {
        console.error(e);
        return { success: false, message: "Server error during analysis" };
    }
}
