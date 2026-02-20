import { escapeRegExp, splitSentences, listItems, countMatches, normalizeSpaces } from "../utils/text.js";

export function compileRegex(pattern: string, flags: string | undefined): RegExp {
  const f = (flags ?? "").replace(/[^gimsuy]/g, "");
  return new RegExp(pattern, f || "g");
}

export function lexiconCount(text: string, lexicon: string[]): number {
  if (!lexicon?.length) return 0;
  let c = 0;
  for (const term of lexicon) {
    if (!term) continue;
    const re = new RegExp(escapeRegExp(term), "g");
    c += countMatches(text, re);
  }
  return c;
}

export function ctaCount(text: string, ctaLexicon: string[]): number {
  return lexiconCount(text, ctaLexicon);
}

export function ctaNearEnd(text: string, ctaLexicon: string[], windowSentences: number): boolean {
  const sentences = splitSentences(text);
  const tail = sentences.slice(Math.max(0, sentences.length - windowSentences)).join(" ");
  return lexiconCount(tail, ctaLexicon) > 0;
}

export function sentenceWordCountGt(text: string, maxWords: number): boolean {
  const sentences = splitSentences(text);
  return sentences.some(s => normalizeSpaces(s).split(" ").filter(Boolean).length > maxWords);
}

export function endingRepetitionGte(text: string, endings: string[], minRun: number): boolean {
  const sentences = splitSentences(text);
  const ends = sentences.map(s => {
    for (const e of endings) {
      if (s.trim().endsWith(e) || s.trim().endsWith(e + ".")) return e;
    }
    return "";
  });
  // count longest run
  let best = 0, run = 0, prev = "";
  for (const e of ends) {
    if (e && e === prev) {
      run += 1;
    } else {
      run = e ? 1 : 0;
      prev = e;
    }
    best = Math.max(best, run);
  }
  return best >= minRun;
}

export function wordRepetitionGte(text: string, minRepeats: number, ignore: string[]): boolean {
  const cleaned = normalizeSpaces(text)
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .toLowerCase();
  const words = cleaned.split(" ").filter(Boolean);
  const counts = new Map<string, number>();
  for (const w of words) {
    if (w.length <= 1) continue;
    if (ignore?.includes(w)) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  for (const [, v] of counts) {
    if (v >= minRepeats) return true;
  }
  return false;
}

export function listItemCountGt(text: string, maxItems: number): boolean {
  return listItems(text).length > maxItems;
}

export function regexAny(text: string, patterns: string[], flags?: string): boolean {
  for (const p of patterns) {
    const re = new RegExp(p, flags ?? "g");
    if (re.test(text)) return true;
  }
  return false;
}

export function regexNone(text: string, patterns: string[], flags?: string): boolean {
  for (const p of patterns) {
    const re = new RegExp(p, flags ?? "g");
    if (re.test(text)) return false;
  }
  return true;
}

export function regexCountLt(text: string, pattern: string, flags: string | undefined, minCount: number): boolean {
  const re = new RegExp(pattern, flags ?? "g");
  const m = text.match(re);
  const c = m ? m.length : 0;
  return c < minCount;
}

export function qaMinimumGate(text: string, minQuestions: number, topicGroup: string[], minTopics: number): boolean {
  // Very simple: count "Q." or "Q:" or "질문" lines
  const qCount = countMatches(text, /(Q[\.:]|질문|자주\s*묻는\s*질문)/gi);
  if (qCount < minQuestions) return true; // gate fails
  let topics = 0;
  for (const t of topicGroup) {
    if (new RegExp(escapeRegExp(t), "g").test(text)) topics += 1;
  }
  return topics < minTopics; // gate fails
}

export function claimCountGt(text: string, maxClaims: number): boolean {
  // heuristic: sentences with strong claim markers
  const sentences = splitSentences(text);
  let c = 0;
  for (const s of sentences) {
    if (/(유일|최고|최상|압도|차별|단 하나|베스트|No\.?\s*1|1위)/g.test(s)) c += 1;
  }
  return c > maxClaims;
}
