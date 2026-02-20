export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function nowIsoKST(): string {
  // KST is UTC+9
  const d = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return d.toISOString().replace("Z", "+09:00");
}

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function splitSentences(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];
  // Keep line breaks as separators.
  const parts = normalized
    .split(/(?<=[.!?]|[。！？])\s+|\n+/g)
    .map(s => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [normalized];
}

export function joinSentences(sentences: string[]): string {
  // Preserve newlines if already provided.
  const out: string[] = [];
  for (const s of sentences) {
    if (!s) continue;
    out.push(s.trim());
  }
  return out.join(" ");
}

export function countMatches(text: string, re: RegExp): number {
  const m = text.match(re);
  return m ? m.length : 0;
}

export function uniq<T>(arr: T[]): T[] {
  const seen = new Set<T>();
  const out: T[] = [];
  for (const v of arr) {
    if (!seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}

export function normalizeSpaces(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

export function listItems(text: string): string[] {
  // crude: bullet or numbered lines
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const items: string[] = [];
  for (const line of lines) {
    if (/^[-•*]\s+/.test(line) || /^\d+[.)]\s+/.test(line)) items.push(line);
  }
  return items;
}
