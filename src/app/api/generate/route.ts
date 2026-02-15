
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { flyerFormSchema, leafletFormSchema } from "@/lib/schemas";
import { GenerateResponse } from "@/types/flyer";
import { getClientIp, hashIp } from "@/lib/server-utils";
import { getCachedResult, setCachedResult, checkRateLimit, checkCooldown } from "@/lib/redis";
import { validateSafety } from "@/lib/quality";
import { createHash } from "crypto";
import { logger } from "@/lib/logger";

// P1 Implementation
import { normalizeContact, normalizePeriod } from "@/lib/content-engine/normalizer";
import { generateAndRefine } from "@/lib/copy/engine";

const generateRequestSchema = z.object({
    type: z.enum(["flyer", "leaflet", "brochure", "poster"]),
    tone: z.enum(["friendly", "premium", "direct"]),
    styleId: z.string(),
    inputs: z.any(), // Flexible here, validated inside handler
});

// Assuming this block was intended to be added to a prompts-like file,
// but if the instruction is to add it to *this* file, it should be outside
// any existing function or object definition to maintain syntactic correctness.
// However, the instruction explicitly says "Define `semanticAnchors` in `prompts.ts`".
// The provided "Code Edit" block seems to be a misplacement of content from `prompts.ts`
// into `route.ts`. Given the constraint to make the file syntactically correct,
// and the explicit instruction to define `semanticAnchors` in `prompts.ts`,
// I will *not* insert this block into `route.ts` as it would be syntactically incorrect
// within the `generateRequestSchema` definition, and the instruction implies it belongs
// elsewhere. The `route.ts` part of the instruction ("update `route.ts` to use the correct
// schema for each product type. (V31)") is already handled by the existing code:
// `const inputs = type === 'leaflet' ? leafletFormSchema.parse(rawInputs) : flyerFormSchema.parse(rawInputs);`

export async function POST(req: NextRequest) {
    try {
        // ... (Validation & Limits - Same)
        const body = await req.json();
        const parseResult = generateRequestSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const { type, tone, styleId, inputs: rawInputs } = parseResult.data;

        // Validation per product type (V31 Fix for Leaflet Data Loss)
        const inputs = type === 'leaflet'
            ? leafletFormSchema.parse(rawInputs)
            : flyerFormSchema.parse(rawInputs);

        // DEBUG: Check Additional Brief
        if (inputs.additionalBrief) {
            logger.info("GEN_BRIEF_RECEIVED", `User Note: ${inputs.additionalBrief}`);
        } else {
            logger.info("GEN_BRIEF_EMPTY", "No additional brief provided");
        }

        // IP & Rate Limit
        const ip = getClientIp(req);
        const ipHash = await hashIp(ip);

        if (!(await checkCooldown(ipHash, 10))) return NextResponse.json({ error: "Cooldown" }, { status: 429 });
        if (!(await checkRateLimit(ipHash)).allowed) return NextResponse.json({ error: "Limit Exceeded" }, { status: 429 });

        // Safety Pre-check
        if (!validateSafety((inputs.offer || "") + inputs.name).safe) return NextResponse.json({ error: "Safety" }, { status: 400 });

        // [v1.4] Trace ID Generation
        const traceId = `tr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        // Cache Key (V2: Include type to distinguish between Flyer/Leaflet)
        const inputHash = createHash("sha256").update(JSON.stringify({ type, tone, styleId, inputs })).digest("hex");
        const cacheKey = `gen:${inputHash}`;

        const cached = await getCachedResult(cacheKey) as GenerateResponse | null;
        if (cached) return NextResponse.json({ ...cached, meta: { ...cached.meta, cacheHit: true, traceId } });

        // Generate All Variants (Engine v1.1 handles A/B/C internally)
        const engineResult = await generateAndRefine(inputs.category, tone, inputs, type, traceId);

        const responseData: GenerateResponse = {
            variants: engineResult.variants,
            meta: {
                traceId,
                rateLimit: { remaining: 10, resetAtKST: "00:00" },
                cacheHit: false,
                normalized: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    period: normalizePeriod((inputs as any).period || ""),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    contact: normalizeContact((inputs as any).contactValue || "")
                },
                warnings: [],
                debug: {
                    inputs,
                    tone,
                    styleId,
                    ipHash: ipHash.substring(0, 8),
                    engineLogs: engineResult.meta.warRoomLogs
                }
            }
        };

        await setCachedResult(cacheKey, responseData, 86400);
        return NextResponse.json(responseData);

    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const e = error as Error & { status?: number; body?: any; traceId?: string };
        logger.error("API_ERROR", "Server Error", { error: e.message });

        // [v1.4] Enhanced Error Propagation (Provider 502 / TraceId)
        if (e.status === 502) {
            return NextResponse.json(e.body || { error: "Provider Error", traceId: e.traceId }, { status: 502 });
        }

        return NextResponse.json({ error: "Server Error", message: e.message }, { status: 500 });
    }
}
