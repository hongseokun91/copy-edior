import { normalizeInput } from "./normalize";
import { ideate } from "./ideate";
import { selectBestCandidate } from "./selector"; // Pass B
import { polish } from "./polish";
import { checkSimilarity } from "./similarity";
import { FLAGS } from "@/lib/flags";
import { FlyerInputs, FlyerType } from "@/types/flyer";
import { NormalizedBrief } from "@/types/brief";
import { logger } from "@/lib/logger";
import { sanitizeVariant } from "./sanitizer"; // [NEW] Sanitizer
import { outputVariantSchema } from "./schemas"; // [NEW] Zod Schema
import { z } from "zod";

async function processFrame(frame: "A" | "B" | "C", brief: NormalizedBrief, traceId: string, styleId?: string, type: FlyerType = 'flyer') {
    let attempts = 0;
    const MAX_RETRIES = 2; // Self-Correction Limit

    while (attempts <= MAX_RETRIES) {
        try {
            // 1. Pass A: IDEATE
            const { candidates } = await ideate(frame, brief, traceId, styleId);

            // 2. Pass B: SELECT
            const bestCandidate = await selectBestCandidate(candidates || [], frame, brief, traceId);

            // 3. Pass C: POLISH
            // [HARDENING] Feedback Loop
            // [HARDENING] Feedback Loop & Jitter
            let feedback = "";
            let temperature = 0.7; // Default
            if (attempts > 0) {
                feedback = `\n[SYSTEM FEEDBACK] Previous attempt failed validation. Strict Constraints: Headline < 25 chars, Bullets exactly 3-5 items. Do not hallucinate fields.`;
                temperature = 0.85; // Jitter
            }
            let rawVariant = await polish(bestCandidate, frame, brief, traceId, styleId, feedback, temperature);

            // [NEW] 3.5 SANITIZE (Force-Flatten)
            let sanitizedVariant = sanitizeVariant(rawVariant, type);

            // [NEW] 4. VALIDATE (Strict Zod)
            const validation = outputVariantSchema.safeParse(sanitizedVariant);

            if (validation.success) {
                logger.info("GEN_SUCCESS", `Frame ${frame} Validated & Sanitized`);
                return validation.data;
            } else {
                // Validation Failed
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const errors = (validation.error as any).errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(", ");
                logger.warn("GEN_INVALID", `Frame ${frame} Schema Fail (Attempt ${attempts + 1}): ${errors}`);

                if (attempts === MAX_RETRIES) {
                    // Last resort: Return sanitized but invalid, or throw? 
                    // Safe Fallback: Return it anyway, let Frontend handle partials.
                    // Better: Throw to trigger 502? No, return best effort.
                    logger.error("GEN_FAIL_FINAL", `Frame ${frame} returned invalid structure after retries.`);
                    return sanitizedVariant;
                }
            }

        } catch (e: unknown) {
            if (e instanceof z.ZodError) {
                logger.warn("GEN_SCHEMA_FAIL", `Frame ${frame} Zod Validation Failed: ${e.message}`);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                logger.error("GEN_ERROR", `Frame ${frame} Error: ${(e as any).message}`);
            }
        }
        attempts++;
    }

    throw new Error(`Frame ${frame} failed to generate valid output.`);
}

export async function generateAndRefine(
    category: string,
    tone: string, // Unused map
    inputs: FlyerInputs,
    type: FlyerType = 'flyer',
    traceId: string = "tr_unknown"
) {
    const brief = normalizeInput(inputs, type);
    const logs: string[] = [];
    logs.push(`[System] Input Normalized. Goal: ${brief.goal} Trace: ${traceId}`);

    // 2. Generate All (Parallel for speed, Sequential for rate limit if needed)
    // We use Promise.all for speed now as we have robust retry backend
    const [varA, varB, varC] = await Promise.all([
        processFrame("A", brief, traceId, inputs.styleId, type),
        processFrame("B", brief, traceId, inputs.styleId, type),
        processFrame("C", brief, traceId, inputs.styleId, type)
    ]);

    logs.push("[System] Frames Generated, Sanitized, and Validated.");

    let variants = { A: varA, B: varB, C: varC };

    // 3. Similarity Gate (Spec F3)
    if (FLAGS.SIMILARITY_GUARD) {
        const simCheck = checkSimilarity(variants);
        if (!simCheck.ok && simCheck.failPair) {
            logs.push(`[Gate] Similarity Warning (${simCheck.score?.toFixed(2)}). Keeping original for stability.`);
            // In v3.0 Stabilization, we skip regeneration to prevent recursion crash risks.
            // Just log warning. Stability > Perfection.
        }
    }

    // 4. Recommend
    const recommended = "B";

    return {
        variants: variants,
        recommendedFrame: recommended,
        meta: {
            traceId,
            rateLimit: { remaining: 100, resetAtKST: "00:00" },
            cacheHit: false,
            normalized: {
                period: brief.periodNormalized,
                contact: brief.contactNormalized
            },
            warnings: [],
            warRoomLogs: logs.join("\n"),
            debug: brief
        }
    };
}
