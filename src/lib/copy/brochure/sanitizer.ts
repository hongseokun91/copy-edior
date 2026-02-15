// src/lib/copy/brochure/sanitizer.ts
import type { BrochureModuleSpec } from "../../../types/brochure";

const PLACEHOLDER_PATTERNS: RegExp[] = [
    /\.\.\./g,
    /\bTODO\b/gi,
    /\bTBD\b/gi,
    /\[.*?\]/g, // [입력] 등
    /미정/g,
];

export function extractJsonFromTags(text: string): any | null {
    const match = text.match(/<JSON>\s*([\s\S]*?)\s*<\/JSON>/i);
    const body = match?.[1]?.trim();
    if (!body) return null;
    try {
        return JSON.parse(body);
    } catch {
        return null;
    }
}

export function scrubPlaceholders(s: string): string {
    let out = s ?? "";
    for (const r of PLACEHOLDER_PATTERNS) out = out.replace(r, "");
    return out.replace(/\s+/g, " ").trim();
}

export function truncateNoEllipsis(s: string, max: number): string {
    const t = scrubPlaceholders(s);
    if (!max || t.length <= max) return t;
    return t.slice(0, max).trim(); // "..." 금지
}

export function sanitizeSlots(moduleSpec: BrochureModuleSpec, slots: Record<string, any>) {
    const clean: Record<string, any> = {};
    const src = slots ?? {};

    for (const slot of moduleSpec.slots) {
        const v = src[slot.key];

        // null/undefined 처리
        if (v === undefined || v === null) {
            clean[slot.key] = slot.type === "string[]" ? [] : slot.type === "kv_list" ? [] : slot.type === "metric_list" ? [] : "";
            continue;
        }

        // string
        if (slot.type === "string") {
            const s = typeof v === "string" ? v : String(v);
            clean[slot.key] = truncateNoEllipsis(s, slot.maxChars ?? 10_000);
            continue;
        }

        // string[]
        if (slot.type === "string[]") {
            const arr = Array.isArray(v) ? v : [v];
            const items = arr
                .filter(x => typeof x === "string" || typeof x === "number")
                .map(x => truncateNoEllipsis(String(x), slot.maxChars ?? 10_000))
                .filter(x => x.length > 0);

            clean[slot.key] = slot.maxItems ? items.slice(0, slot.maxItems) : items;
            continue;
        }

        // kv_list: {key,value}[]
        if (slot.type === "kv_list") {
            const arr = Array.isArray(v) ? v : [v];
            const kv = arr
                .map((it: any) => {
                    if (it && typeof it === "object" && "key" in it && "value" in it) {
                        return {
                            key: truncateNoEllipsis(String(it.key), 24),
                            value: truncateNoEllipsis(String(it.value), 60),
                        };
                    }
                    const s = String(it);
                    const idx = s.indexOf(":");
                    if (idx > 0) {
                        return {
                            key: truncateNoEllipsis(s.slice(0, idx), 24),
                            value: truncateNoEllipsis(s.slice(idx + 1), 60),
                        };
                    }
                    return { key: truncateNoEllipsis(s, 24), value: "" };
                })
                .filter(x => x.key.length > 0);

            clean[slot.key] = slot.maxItems ? kv.slice(0, slot.maxItems) : kv;
            continue;
        }

        // metric_list: {label,value,note?}[]
        if (slot.type === "metric_list") {
            const arr = Array.isArray(v) ? v : [v];
            const metrics = arr
                .map((it: any) => {
                    if (it && typeof it === "object" && "label" in it && "value" in it) {
                        return {
                            label: truncateNoEllipsis(String(it.label), 24),
                            value: truncateNoEllipsis(String(it.value), 24),
                            note: it.note ? truncateNoEllipsis(String(it.note), 60) : undefined,
                        };
                    }
                    const s = String(it);
                    return { label: truncateNoEllipsis(s, 24), value: "" };
                })
                .filter(x => x.label.length > 0);

            clean[slot.key] = slot.maxItems ? metrics.slice(0, slot.maxItems) : metrics;
            continue;
        }

        // fallback
        clean[slot.key] = v;
    }

    return clean;
}

export function sanitizeModulesBySpec(args: {
    moduleIds: string[];
    modulesFromLLM: any[];
    getSpec: (moduleId: string) => BrochureModuleSpec | undefined;
}) {
    const { moduleIds, modulesFromLLM, getSpec } = args;

    return moduleIds.map(moduleId => {
        const spec = getSpec(moduleId);
        const found = modulesFromLLM.find((x: any) => x?.moduleId === moduleId);
        const rawSlots = found?.slots ?? {};
        const slots = spec ? sanitizeSlots(spec, rawSlots) : rawSlots;

        return { moduleId, slots };
    });
}
