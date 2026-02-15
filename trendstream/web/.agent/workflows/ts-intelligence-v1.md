---
description: Trendstream Phase 1 - Intelligence (Embeddings, Clustering, Similarity)
---

# Intelligence V1 Implementation

## Goal
 Implement pattern extraction using local embeddings (or API) + clustering.

## Steps
1. **Normalization**:
   - Create `src/lib/intelligence/normalize.ts`.
   - Function: `normalizeMetrics(raw: Json): NormalizedMetrics`.
2. **Embeddings**:
   - Create `src/lib/intelligence/embeddings.ts`.
   - Integrate Vercel AI SDK or OpenAI directly to generate vector for `(title + abstract)`.
3. **Clustering**:
   - Implement basic clustering (e.g. k-means or dbscan adapter, or just simple cosine similarity grouping).
   - `src/lib/intelligence/clustering.ts`.
4. **Integration**:
   - Update `ingest.ts` to call:
     - `normalize()`
     - `generateEmbedding()`
     - `assignCluster()`
     - Save to DB.

## Verification
- Ingest 5 different videos.
- Check `pattern_clusters` table has entries.
- Check `metrics_normalized` populated.
