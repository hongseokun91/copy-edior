
// v1.3.1 - Forced Gateway Standardization
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from "ai";
import * as fs from 'fs';
import * as path from 'path';
import { isMockMode, generateMockResponse, mockModel } from './mock-provider';

// [P0] Env Standardization: Gateway Only
const ENV = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL: process.env.VERCEL,
    RAW_MODE: (process.env.AI_PROVIDER_MODE || 'gateway').toLowerCase(),
    GATEWAY_URL: process.env.AI_GATEWAY_BASE_URL,
    GATEWAY_KEY: process.env.AI_GATEWAY_API_KEY
};

const isDeployed = ENV.VERCEL === '1' || ENV.VERCEL_ENV === 'production' || ENV.VERCEL_ENV === 'preview' || ENV.NODE_ENV === 'production';

console.log(`[AI_ENV_STARTUP] Node=${ENV.NODE_ENV} Vercel=${ENV.VERCEL_ENV} Mode=gateway GatewayURL=${!!ENV.GATEWAY_URL} HasKey=${!!ENV.GATEWAY_KEY}`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let copyModel: any;
let isGatewayReady = false;

if (ENV.GATEWAY_URL && ENV.GATEWAY_KEY) {
    const aiGateway = createOpenAICompatible({
        name: 'ai-gateway',
        baseURL: ENV.GATEWAY_URL,
        headers: { Authorization: `Bearer ${ENV.GATEWAY_KEY}` },
    });
    copyModel = aiGateway('gpt-4o');
    isGatewayReady = true;
} else {
    if (isDeployed) {
        console.error("[System] CRITICAL: Gateway Keys Missing in Deployed Env.");
        copyModel = null;
    } else {
        console.warn("[System] Gateway Keys Missing locally. Simulating with Mock.");
        copyModel = mockModel;
    }
}

type ErrorClass = 'AUTH' | 'QUOTA' | 'TIMEOUT' | 'PARSE' | 'PROVIDER' | 'UNKNOWN' | 'PROVIDER_CONFIG';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function classifyError(e: any): ErrorClass {
    const msg = (e.message || "").toLowerCase();
    const code = e.code || e.status || 0;
    if (msg.includes('api key') || code === 401 || code === 403) return 'AUTH';
    if (code === 429 || msg.includes('quota') || msg.includes('limit')) return 'QUOTA';
    if (msg.includes('timeout') || msg.includes('abort') || e.name === 'AbortError') return 'TIMEOUT';
    if (msg.includes('json') || msg.includes('parse') || msg.includes('syntax')) return 'PARSE';
    if (code >= 500 || msg.includes('network') || msg.includes('fetch')) return 'PROVIDER';
    return 'UNKNOWN';
}

function logToFile(msg: string) {
    if (process.env.VERCEL_ENV) return;
    try {
        const logPath = path.join(process.cwd(), 'debug_server.log');
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
    } catch (e) { /* ignore */ }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function repairJson(brokenText: string, schema: any, traceId: string = "unknown") {
    if (!copyModel) throw new Error("No Provider Available for Repair");
    logToFile(`[REPAIR_START] ${traceId}`);

    // Attempt 1: Just fix formatting
    const prompt = `[TASK] Fix invalid JSON. Output ONLY valid JSON inside <JSON> tags.\n[BROKEN]\n${brokenText}`;
    const { text } = await generateText({
        model: copyModel,
        system: `You are a JSON Repair Agent. Output format: <JSON>{ ... }</JSON>`,
        prompt: prompt,
        abortSignal: AbortSignal.timeout(15000)
    });

    const match = text.match(/<JSON>([\s\S]*?)<\/JSON>/);
    if (!match) throw new Error("Repair Failed: No <JSON> tags");
    return JSON.parse(match[1]);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function safeGenerateObject(params: any, traceId: string = "unknown") {
    const passName = params.passName || "unnamed_object";

    // [Phase 1] Hard Lockdown
    if (isDeployed) {
        console.error(`[AI_ERROR] { traceId: "${traceId}", passName: "${passName}", errorClass: "PROVIDER_CONTRACT", message: "FORBIDDEN_GENERATE_OBJECT_IN_DEPLOYED_ENV" }`);
        throw { status: 502, body: { error: "DEPRECATED_METHOD", traceId, message: "Server Protocol Conflict" } };
    }

    try {
        const { generateObject } = require('ai');
        const { object } = await generateObject({
            model: copyModel,
            ...params
        });
        return { object };
    } catch (e: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = e as any;
        const errorType = classifyError(err);
        const rawHead = (err.responseBody || "").substring(0, 300).replace(/\n/g, " ");
        console.error(`[AI_ERROR] { traceId: "${traceId}", passName: "${passName}", errorClass: "${errorType}", message: "${err.message}", rawHead: "${rawHead}" }`);
        // [HARDENING] Sanitize Error for Client
        if (errorType === 'AUTH' || errorType === 'QUOTA') {
            throw new Error("AI Service Unavailable (Capacity/Auth Error). Please contact support.");
        }
        if (errorType === 'PROVIDER') {
            throw new Error("AI Service Temporary Error. Please try again later.");
        }
        throw new Error("Generation Failed. Please modify your request.");
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function safeGenerateText(params: any, traceId: string = "unknown") {
    const passName = params.passName || "unnamed_text";
    const attempt = params.attempt || 1;

    console.log(`[AI_TRACE] { traceId: "${traceId}", passName: "${passName}", attempt: ${attempt}, env: "${ENV.VERCEL_ENV || 'local'}", model: "gpt-4o" }`);

    if (!isGatewayReady && isDeployed) {
        throw new Error("Service Unavailable: AI Gateway Not Configured");
    }

    // [Mock Mode Interception]
    if (copyModel === mockModel) {
        // Pass full params to mock provider for better context (Frame detection via passName)
        const mockObj = await generateMockResponse(params);
        return {
            text: `<JSON>${JSON.stringify(mockObj)}</JSON>`,
            usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
        };
    }

    try {
        const { text, usage } = await generateText({
            model: copyModel,
            ...params
        });
        return { text, usage };
    } catch (e: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = e as any;
        const errorType = classifyError(err);
        console.error(`[AI_ERROR] { traceId: "${traceId}", passName: "${passName}", errorClass: "${errorType}", message: "${err.message}" }`);
        // [HARDENING] Sanitize Error for Client
        throw new Error("AI Generation Failed. Internal provider error logged.");
    }
}

export function getAIEnvironment() {
    return {
        isLocal: !isDeployed,
        vercelEnv: ENV.VERCEL_ENV || 'local',
        hasKey: isGatewayReady
    };
}
