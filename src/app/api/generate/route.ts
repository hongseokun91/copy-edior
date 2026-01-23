import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { flyerFormSchema } from "@/lib/schemas";
import { GenerateResponse } from "@/types/flyer";
import { getClientIp, hashIp } from "@/lib/server-utils";
import { getCachedResult, setCachedResult, checkRateLimit, checkCooldown } from "@/lib/redis";
import { generateByTemplate } from "@/lib/templates/patterns";
import { validateSafety, autoShorten } from "@/lib/quality";
import { createHash } from "crypto";
import { logger } from "@/lib/logger";

const generateRequestSchema = z.object({
    type: z.literal("flyer"),
    tone: z.enum(["friendly", "premium", "direct"]),
    styleId: z.string(),
    inputs: flyerFormSchema, // Reuse form schema
});

export async function POST(req: NextRequest) {
    try {
        // 1. Validate Input
        const body = await req.json();
        const parseResult = generateRequestSchema.safeParse(body);

        if (!parseResult.success) {
            logger.warn("GEN_INVALID_INPUT", "Invalid Input Schema", { details: parseResult.error.format() });
            return NextResponse.json(
                { error: "Invalid input", details: parseResult.error.format() },
                { status: 400 }
            );
        }

        const { tone, styleId, inputs } = parseResult.data;

        // 2. IP & Rate Limit
        const ip = getClientIp(req);
        const ipHash = await hashIp(ip);

        // T3-4 Cooldown (10s)
        const isCooldownOk = await checkCooldown(ipHash, 10);
        if (!isCooldownOk) {
            logger.warn("GEN_FAIL_LIMIT", "Cooldown Active", { ipHash });
            return NextResponse.json(
                { error: "Too Many Requests", message: "잠시 후 다시 시도해주세요." },
                { status: 429 }
            );
        }

        // T3-3 Daily Rate Limit
        const { allowed } = await checkRateLimit(ipHash);
        if (!allowed) {
            logger.warn("GEN_FAIL_LIMIT", "Daily Limit Exceeded", { ipHash });
            return NextResponse.json(
                { error: "Daily Limit Exceeded", message: "일일 생성 한도를 초과했습니다." },
                { status: 429 }
            );
        }

        // T4-5 Safety Check
        const safetyResult = validateSafety(inputs.offer + " " + inputs.name);
        if (!safetyResult.safe) {
            logger.warn("GEN_FAIL_SAFETY", "Safety Violation", { reason: safetyResult.reason });
            return NextResponse.json(
                { error: "Content Policy Violation", message: safetyResult.reason },
                { status: 400 }
            );
        }

        // 3. Cache Check (T3-5)
        const inputString = JSON.stringify({ tone, styleId, inputs });
        const inputHash = createHash("sha256").update(inputString).digest("hex");
        const cacheKey = `gen:${inputHash}`;

        const cached = (await getCachedResult(cacheKey)) as GenerateResponse | null;

        if (cached) {
            logger.info("GEN_SUCCESS", "Cache Hit", { cacheKey });
            return NextResponse.json({
                ...cached,
                meta: { ...cached.meta, cacheHit: true }
            });
        }

        // 4. Generate (Template Engine)
        await new Promise(r => setTimeout(r, 500)); // Simulate delay

        const generateAndRefine = (cat: string, t: import("@/types/flyer").FlyerTone, inp: import("@/types/flyer").FlyerInputs) => {
            const raw = generateByTemplate(cat, t, inp);
            // T4-3 Auto-Shortening
            return {
                ...raw,
                HEADLINE: autoShorten(raw.HEADLINE, 18),
                SUBHEAD: autoShorten(raw.SUBHEAD, 32),
            };
        };

        const responseData: GenerateResponse = {
            variants: {
                A: generateAndRefine(inputs.category, tone, inputs),
                B: generateAndRefine(inputs.category, tone, inputs),
                C: generateAndRefine(inputs.category, tone, inputs),
            },
            meta: {
                rateLimit: { remaining: 19, resetAtKST: "00:00" }, // Mock
                cacheHit: false,
                normalized: { period: inputs.period, contact: inputs.contactValue },
                warnings: [],
            },
        };

        // 5. Save Cache
        await setCachedResult(cacheKey, responseData, 86400); // 24h

        logger.info("GEN_SUCCESS", "Generated Successfully", {
            tone,
            styleId,
            category: inputs.category,
            latency: "500ms" // Mock
        });

        return NextResponse.json(responseData);

    } catch (error) {
        logger.error("API_ERROR", "Internal Server Error", { error });
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
