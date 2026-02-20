
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    flyerFormSchema,
    leafletFormSchema,
    posterFormSchema,
    brochureFormSchema,
    FlyerFormValues
} from "@/lib/schemas";
import { GenerateResponse } from "@/types/flyer";
import { getClientIp, hashIp } from "@/lib/server-utils";
import { getCachedResult, setCachedResult, checkRateLimit, checkCooldown } from "@/lib/redis";
import { validateSafety } from "@/lib/quality";
import { createHash } from "crypto";
import { logger } from "@/lib/logger";

// P1 Implementation
import { normalizeContact, normalizePeriod } from "@/lib/content-engine/normalizer";
import { generateAndRefine } from "@/lib/copy/engine"; // Flyer (Default)
import { generateLeaflet } from "@/lib/engines/leaflet-engine";
import { generateBrochure } from "@/lib/engines/brochure-engine";
import { generatePoster } from "@/lib/poster/poster-engine";

const generateRequestSchema = z.object({
    type: z.enum(["flyer", "leaflet", "brochure", "poster"]),
    tone: z.enum(["friendly", "premium", "direct"]),
    styleId: z.string(),
    inputs: z.any(), // Flexible here, validated inside handler
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parseResult = generateRequestSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const { type, tone, styleId, inputs: rawInputs } = parseResult.data;

        // Validation & Type Narrowing per product type
        // We parse inputs specifically per type to avoid generic Union issues
        let inputs: any; // We use any for internal logic, but schemas ensure shape

        try {
            if (type === 'leaflet') {
                inputs = leafletFormSchema.parse(rawInputs);
            } else if (type === 'brochure') {
                inputs = brochureFormSchema.parse(rawInputs);
            } else if (type === 'poster') {
                inputs = posterFormSchema.parse(rawInputs);
            } else {
                inputs = flyerFormSchema.parse(rawInputs);
            }
        } catch (e) {
            // Zod error handling
            if (e instanceof z.ZodError) {
                return NextResponse.json({ error: "Validation Error", details: e.issues }, { status: 400 });
            }
            throw e;
        }

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
        // For Poster, 'name' might be missing, so fallback safely
        const safetyText = (inputs.offer || "") + (inputs.name || "");
        if (!validateSafety(safetyText).safe) return NextResponse.json({ error: "Safety" }, { status: 400 });

        // [v1.4] Trace ID Generation
        const traceId = `tr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        // Cache Key (V2: Include type to distinguish between Flyer/Leaflet)
        const inputHash = createHash("sha256").update(JSON.stringify({ type, tone, styleId, inputs })).digest("hex");
        const cacheKey = `gen:${inputHash}`;

        const cached = await getCachedResult(cacheKey) as GenerateResponse | null;
        if (cached) return NextResponse.json({ ...cached, meta: { ...cached.meta, cacheHit: true, traceId } });

        // Generate All Variants (Dispatcher Pattern v2.0)
        let engineResult;

        if (type === 'leaflet') {
            engineResult = await generateLeaflet(inputs, traceId);
        } else if (type === 'brochure') {
            engineResult = await generateBrochure(inputs, traceId);
        } else if (type === 'poster') {
            engineResult = await generatePoster(inputs, traceId);
        } else {
            // Flyer (Default / Legacy)
            // Explicitly cast to prevent strict check against mismatched Union types
            // Since we validated with flyerFormSchema in this branch, it IS valid.
            engineResult = await generateAndRefine(
                inputs.category,
                tone,
                // Inject styleId since it's separate in request but expected in FlyerInputs
                { ...inputs, styleId } as FlyerFormValues & { styleId: string },
                type,
                traceId
            );
        }

        const responseData: GenerateResponse = {
            variants: engineResult.variants,
            meta: {
                traceId,
                rateLimit: { remaining: 10, resetAtKST: "00:00" },
                cacheHit: false,
                normalized: {
                    period: normalizePeriod((inputs as any).period || ""),
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

        if (e.status === 502) {
            return NextResponse.json(e.body || { error: "Provider Error", traceId: e.traceId }, { status: 502 });
        }

        return NextResponse.json({ error: "Server Error", message: e.message }, { status: 500 });
    }
}
