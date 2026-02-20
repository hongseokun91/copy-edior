import { splitSentences, joinSentences, normalizeSpaces, escapeRegExp, uniq } from "../utils/text.js";

export interface ActionContext {
  rewriteMaps: any;
  brandStyle?: { ctaDefault?: string; blacklist?: string[]; formality?: string };
  ctaDefault: string;
}

function replaceAll(text: string, from: string, to: string): string {
  if (!from) return text;
  const re = new RegExp(escapeRegExp(from), "g");
  return text.replace(re, to);
}

export function applyClicheToSpecific(text: string, maps: any): string {
  const list = maps?.CLICHE_TO_SPECIFIC ?? [];
  let out = text;
  for (const item of list) {
    out = replaceAll(out, item.from, item.to);
  }
  return out;
}

export function applyAbstractToSpecific(text: string, maps: any): string {
  const list = maps?.ABSTRACT_TO_SPECIFIC_MAP ?? [];
  let out = text;
  // Replace longer keys first
  const sorted = [...list].sort((a, b) => (b.key?.length ?? 0) - (a.key?.length ?? 0));
  for (const item of sorted) {
    if (!item.key) continue;
    out = replaceAll(out, item.key, item.rewrite);
  }
  return out;
}

export function applySafeSoftener(text: string, maps: any): string {
  const templ = maps?.SAFE_SOFTENERS?.SOFTEN_OVERCLAIM ?? [];
  let out = text;
  for (const r of templ) {
    out = replaceAll(out, r.from, r.to);
  }
  return out;
}

export function superlativeToStandard(text: string): string {
  return text
    .replace(/최고급|최상급|압도적|독보적/gi, "기준에 맞춘")
    .replace(/혁명적|획기적/gi, "기준을 바꾼");
}

export function rankToStandard(text: string): string {
  // downgrade rank claims to standards
  return text
    .replace(/업계\s*1위|국내\s*최초|세계\s*최고|No\.?\s*1/gi, "검증 기준을 충족하는")
    .replace(/유일(한)?/gi, "차별화된 기준을 가진");
}

export function splitLongSentences(text: string): string {
  const sents = splitSentences(text);
  const out: string[] = [];
  for (const s of sents) {
    const words = normalizeSpaces(s).split(" ").filter(Boolean);
    if (words.length <= 28) {
      out.push(s);
      continue;
    }
    // Try splitting by commas / 그리고 / 그래서
    const parts = s.split(/,| 그리고 | 그래서 | 또한 /g).map(p => p.trim()).filter(Boolean);
    if (parts.length <= 1) {
      out.push(s);
    } else {
      out.push(parts.join(". ") + ".");
    }
  }
  return joinSentences(out);
}

export function varyEndings(text: string, formality: string): string {
  // Minimal: remove repeated '합니다' by merging or converting some to noun-ending.
  const sents = splitSentences(text);
  const out: string[] = [];
  let run = 0;
  for (const s of sents) {
    const isHam = s.trim().endsWith("합니다") || s.trim().endsWith("합니다.");
    if (isHam) run += 1; else run = 0;

    if (run >= 3) {
      // convert one sentence to short noun phrase
      const converted = s.replace(/합니다\.?$/, "— 기준을 공개합니다.");
      out.push(converted);
      run = 0;
    } else {
      out.push(s);
    }
  }
  return joinSentences(out);
}

export function deDuplicate(text: string): string {
  // Remove immediate duplicates and trim repeated word runs.
  let out = text.replace(/\b(\w+)\s+\1\b/gi, "$1");
  // Also collapse duplicate phrases like "진행 기준과 조건" repeated
  out = out.replace(/(진행\s*기준과\s*조건)(\s*.*\s*)\1/gi, "$1$2");
  return normalizeSpaces(out);
}

export function trimList(text: string, maxItems: number): string {
  const lines = text.split("\n");
  let count = 0;
  const out: string[] = [];
  for (const line of lines) {
    const isItem = /^[-•*]\s+/.test(line.trim()) || /^\d+[.)]\s+/.test(line.trim());
    if (isItem) {
      count += 1;
      if (count <= maxItems) out.push(line);
    } else {
      out.push(line);
    }
  }
  return out.join("\n").trim();
}

export function reduceToOneClaim(text: string): string {
  const sents = splitSentences(text);
  if (sents.length <= 1) return text;
  // Keep first sentence as claim. Others are moved to evidence block if exist.
  const first = sents[0];
  const rest = sents.slice(1).slice(0, 2); // keep a little
  return joinSentences([first, ...rest]);
}

export function ensureSingleCTA(text: string, ctaLexicon: string[], ctaDefault: string): string {
  // Keep only one CTA sentence (last one). If multiple, delete earlier CTA sentences.
  const sents = splitSentences(text);
  const isCTA = (s: string) => ctaLexicon.some(t => s.includes(t));
  const ctaIdxs = sents.map((s, i) => (isCTA(s) ? i : -1)).filter(i => i >= 0);
  if (ctaIdxs.length === 0) return joinSentences([...sents, ctaDefault]);
  if (ctaIdxs.length === 1) return joinSentences(sents);

  const keep = ctaIdxs[ctaIdxs.length - 1];
  const out = sents.filter((s, i) => !isCTA(s) || i === keep);
  return joinSentences(out);
}

export function insert(text: string, position: "start" | "end" | "before_cta" | "end_if_missing", template: string, ctaLexicon: string[], ctaDefault: string): string {
  if (!template) return text;
  const filled = template.replace("{{CTA_DEFAULT}}", ctaDefault);
  if (position === "start") return `${filled}\n${text}`.trim();
  if (position === "end") return `${text}\n${filled}`.trim();
  if (position === "end_if_missing") {
    // if CTA is missing, append
    const hasCTA = ctaLexicon.some(t => text.includes(t));
    return hasCTA ? text : `${text}\n${filled}`.trim();
  }
  if (position === "before_cta") {
    const sents = splitSentences(text);
    const idx = sents.findIndex(s => ctaLexicon.some(t => s.includes(t)));
    if (idx === -1) return `${text}\n${filled}`.trim();
    sents.splice(idx, 0, filled);
    return joinSentences(sents);
  }
  return text;
}

export function label(text: string, labelText: string): string {
  if (!labelText) return text;
  return `${labelText}\n${text}`.trim();
}

export function applyReplaceStrategy(text: string, strategy: string, ctx: ActionContext): string {
  if (strategy === "cliche_to_specific") return applyClicheToSpecific(text, ctx.rewriteMaps);
  if (strategy === "abstract_to_specific") return applyAbstractToSpecific(text, ctx.rewriteMaps);
  return text;
}

export function applyDownshiftStrategy(text: string, strategy: string, ctx: ActionContext): string {
  if (strategy === "safe_softener") return applySafeSoftener(text, ctx.rewriteMaps);
  if (strategy === "split_sentence") return splitLongSentences(text);
  if (strategy === "vary_endings") return varyEndings(text, ctx.brandStyle?.formality ?? "합니다");
  if (strategy === "de_duplicate") return deDuplicate(text);
  if (strategy === "trim_list") return trimList(text, 4);
  if (strategy === "reduce_to_one_claim") return reduceToOneClaim(text);
  if (strategy === "superlative_to_standard") return superlativeToStandard(text);
  if (strategy === "rank_to_standard") return rankToStandard(text);
  return text;
}
