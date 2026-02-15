
// Simple Jaccard Similarity using Character Bi-grams
// Good for Korean where word boundaries are not always sufficient for similarity.

export function getBiGrams(text: string): Set<string> {
    const clean = text.replace(/\s+/g, "").toLowerCase();
    const grams = new Set<string>();
    for (let i = 0; i < clean.length - 1; i++) {
        grams.add(clean.substring(i, i + 2));
    }
    return grams;
}

export function jaccardSimilarity(textA: string, textB: string): number {
    const setA = getBiGrams(textA);
    const setB = getBiGrams(textB);

    if (setA.size === 0 && setB.size === 0) return 1.0;
    if (setA.size === 0 || setB.size === 0) return 0.0;

    let intersection = 0;
    for (const gram of setA) {
        if (setB.has(gram)) intersection++;
    }

    const union = setA.size + setB.size - intersection;
    return intersection / union;
}

export function calculateMaxSimilarity(texts: string[]): number {
    let maxSim = 0;
    for (let i = 0; i < texts.length; i++) {
        for (let j = i + 1; j < texts.length; j++) {
            const sim = jaccardSimilarity(texts[i], texts[j]);
            if (sim > maxSim) maxSim = sim;
        }
    }
    return maxSim;
}
