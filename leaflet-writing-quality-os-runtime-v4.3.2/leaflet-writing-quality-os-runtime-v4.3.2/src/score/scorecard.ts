import type { Dimension, Severity, Scorecard } from "../../typings/types.js";
import { clamp, nowIsoKST } from "../utils/text.js";

export interface ScoreInput {
  version: string;
  moduleKey: any;
  industryKey?: string;
  cutoff: number;
  baseScore?: number;
  penalties: Array<{ ruleId: string; delta: number; reason: string }>;
  bonuses: Array<{ ruleId: string; delta: number; reason: string }>;
  triggered: Array<{ ruleId: string; severity: Severity; message?: string }>;
  actionsApplied: Array<{ type: string; details?: any }>;
  dimensionDelta: Partial<Record<Dimension, number>>;
  hardFail: boolean;
  ceg?: { claims: string[]; evidence: string[]; unlinkedClaims: string[] };
}

export function buildScorecard(inp: ScoreInput): Scorecard {
  const base = inp.baseScore ?? 100;
  const delta = inp.penalties.reduce((a, p) => a + p.delta, 0) + inp.bonuses.reduce((a, b) => a + b.delta, 0);
  const total = inp.hardFail ? Math.min(base + delta, 0) : (base + delta);

  const dims: Record<Dimension, number> = {
    clarity: 5,
    specificity: 5,
    structure: 5,
    voice_fit: 5,
    readability_rhythm: 5,
    credibility_safety: 5,
    conversion: 5
  };
  for (const [k, v] of Object.entries(inp.dimensionDelta)) {
    const key = k as Dimension;
    dims[key] = clamp((dims[key] ?? 5) + (v ?? 0), 0, 5);
  }

  const pass = !inp.hardFail && total >= inp.cutoff && dims.credibility_safety === 5;

  return {
    version: inp.version,
    moduleKey: inp.moduleKey,
    industryKey: inp.industryKey,
    totalScore: total,
    cutoff: inp.cutoff,
    pass,
    hardFail: inp.hardFail,
    dimensionScores: dims,
    penalties: inp.penalties.length ? inp.penalties : undefined,
    bonuses: inp.bonuses.length ? inp.bonuses : undefined,
    rulesTriggered: inp.triggered,
    actionsApplied: inp.actionsApplied,
    ceg: inp.ceg,
    timestamp: nowIsoKST()
  };
}
