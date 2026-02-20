import type { LoadedConfig, QualityOSInput, QualityOSResult } from "./types.js";
import type { RuleSpec, Dimension, Severity } from "../typings/types.js";
import {
  regexAny, regexNone, regexCountLt, lexiconCount, ctaCount, ctaNearEnd,
  sentenceWordCountGt, endingRepetitionGte, wordRepetitionGte, listItemCountGt,
  qaMinimumGate, claimCountGt
} from "./detect/index.js";
import {
  applyReplaceStrategy, applyDownshiftStrategy, insert, ensureSingleCTA, label
} from "./actions/index.js";
import { buildScorecard } from "./score/scorecard.js";
import { splitSentences, joinSentences, escapeRegExp, normalizeSpaces, uniq } from "./utils/text.js";

type RuleTrigger = { rule: RuleSpec; severity: Severity; message?: string };

function moduleMatches(rule: RuleSpec, moduleKey: string): boolean {
  return rule.modules.includes("*" as any) || rule.modules.includes(moduleKey as any);
}

function mergeUnique<T>(a: T[] | undefined, b: T[] | undefined): T[] {
  const out: T[] = [];
  for (const x of (a ?? [])) out.push(x);
  for (const x of (b ?? [])) out.push(x);
  return Array.from(new Set(out as any)) as any;
}

function getIndustryOverride(cfg: LoadedConfig, industryKey?: string): any {
  if (!industryKey) return null;
  return cfg.rewriteMaps?.INDUSTRY_OVERRIDES?.[industryKey] ?? null;
}

function getEffectiveRewriteMaps(cfg: LoadedConfig, industryKey?: string): any {
  const base = cfg.rewriteMaps ?? {};
  const ov = getIndustryOverride(cfg, industryKey) ?? {};
  const eff: any = { ...base };

  // Merge blocklists/lexicons
  eff.OVERCLAIM_BLOCKLIST = mergeUnique(base.OVERCLAIM_BLOCKLIST, ov.extraOverclaimBlock);
  eff.CLICHE_BLOCKLIST = mergeUnique(base.CLICHE_BLOCKLIST, ov.extraClicheBlock);
  eff.ABSTRACT_WORDS = mergeUnique(base.ABSTRACT_WORDS, ov.extraAbstractWords);

  // Carry disclaimers/specificity requirements
  eff.__requiredDisclaimers = ov.requiredDisclaimers ?? [];
  eff.__requiredSpecificity = ov.requiredSpecificity ?? [];

  return eff;
}

function hasEvidenceLine(text: string): boolean {
  return /(근거\s*:|Evidence\s*:|검증\s*방법\s*:)/i.test(text);
}

function buildEvidenceLineFromProof(proofPack: any): string | null {
  if (!proofPack) return null;
  const picks: string[] = [];
  const add = (arr: any, limit: number) => {
    if (!arr || !Array.isArray(arr)) return;
    for (const x of arr) {
      if (typeof x !== "string") continue;
      const s = x.trim();
      if (!s) continue;
      if (picks.length >= 3) return;
      picks.push(s);
      if (picks.length >= limit) return;
    }
  };

  add(proofPack.numbers, 1);
  add(proofPack.certs, 1);
  add(proofPack.awards, 1);
  add(proofPack.partners, 1);
  add(proofPack.press, 1);
  add(proofPack.reviews, 2);

  if (!picks.length) return null;
  return `근거: ${picks.slice(0, 3).join(" · ")}`;
}

function buildVerificationLine(industrySpecificity: string[], proofPack: any): string {
  // If process/policy exists, use them; else generic but safe.
  const process = Array.isArray(proofPack?.process) ? proofPack.process.slice(0, 5) : [];
  const policy = Array.isArray(proofPack?.policy) ? proofPack.policy.slice(0, 2) : [];

  const parts: string[] = [];
  if (industrySpecificity?.length) {
    parts.push(`사양 확정은 ${industrySpecificity.join(", ")} 기준으로 먼저 합의합니다.`);
  }
  if (process.length) {
    parts.push(`진행: ${process.join(" → ")}.`);
  } else {
    parts.push("진행 전 작업 범위와 기준을 먼저 합의하고, 단계별 체크리스트로 확인합니다.");
  }
  if (policy.length) {
    parts.push(`원칙: ${policy.join(" / ")}.`);
  }
  return `검증 방법: ${parts.join(" ")}`.trim();
}

function shouldInsertDisclaimers(moduleKey: string, cfg: LoadedConfig): boolean {
  // Insert for high-risk modules primarily
  const highRisk = cfg.modulePolicies?.highRiskModules ?? [];
  return highRisk.includes(moduleKey);
}

function buildInputRequests(moduleKey: string, cfg: LoadedConfig, industryKey: string | undefined, proofPack: any): { requests: string[]; prompt: string } {
  const p = cfg.modulePolicies?.policies?.[moduleKey];
  const reqs: string[] = [];

  if (!p) return { requests: [], prompt: "" };

  const add = (s: string) => { if (s && !reqs.includes(s)) reqs.push(s); };

  // Required evidence types → ask for missing proofpack fields
  const evidence = p.requiredEvidenceTypes ?? [];
  const hasAny = (keys: string[]) => keys.some(k => Array.isArray(proofPack?.[k]) && proofPack[k].length > 0);

  for (const e of evidence) {
    if (e === "process_steps") {
      if (!hasAny(["process"])) add("서비스/프로젝트 진행 과정을 3~6단계로 적어주세요. (예: 상담→확정→진행→검수→완료)");
    } else if (e.startsWith("one_of:")) {
      const opts = e.replace("one_of:", "").split("|");
      const map: any = { review: "reviews", number: "numbers", case: "cases", cert: "certs", award: "awards", partner: "partners", press: "press" };
      const keys = opts.map((o: string) => map[o]).filter(Boolean);
      if (!hasAny(keys)) add("증거(선택 1개 이상)를 주세요: 수치(누적/기간/시간), 후기 1~3개, 사례 1개, 인증/수상, 주요 협력/납품, 언론 보도.");
    } else if (e === "date_and_metric") {
      if (!hasAny(["numbers"])) add("날짜/기간/성과지표(숫자) 1개 이상을 주세요. (예: 2023.07, 누적 1,200건)");
    } else if (e === "scope_and_exceptions") {
      if (!hasAny(["policy"])) add("조건/예외/주의사항(무엇이 포함/제외인지)을 1~3줄로 주세요.");
    }
  }

  // Required structures → ask for missing structure inputs
  const structures = p.requiredStructures ?? [];
  for (const s of structures) {
    if (s === "one_sentence_definition") add("한 문장 정의(무엇을→어떤 방식으로→어떤 결과)를 알려주세요.");
    if (s === "steps_3_to_5") add("핵심 프로세스를 3~5단계로 알려주세요.");
    if (s === "timeline_4_to_8") add("연혁 항목 4~8개를 날짜(YYYY.MM) + 사건/성과 형태로 주세요.");
    if (s === "pricing_includes_options_conditions") add("가격 정책: 기본 포함 3개, 옵션 3개, 조건/예외 1개를 주세요.");
    if (s === "warranty_scope_period_process_exceptions") add("품질보증: 보증 범위/기간/처리 절차(3단계)/예외를 주세요.");
    if (s === "qa_3plus_topics") add("Q&A: 가격/시간/환불/품질/절차 중 최소 3개 질문과 답을 주세요.");
  }

  // Industry required specificity → ask for specs (print)
  const ov = getIndustryOverride(cfg, industryKey);
  const spec = ov?.requiredSpecificity ?? [];
  if (Array.isArray(spec) && spec.length) {
    add(`업종(${industryKey}) 필수 확인 항목: ${spec.join(", ")} 중 현재 확정된 내용을 알려주세요. (미확정이면 '상담 시 확정'으로 처리)`);
  }

  const prompt = reqs.length
    ? `아래 질문에 답해주면 리플렛 문구 퀄리티가 확 올라갑니다.\n` + reqs.map((q, i) => `${i + 1}. ${q}`).join("\n")
    : "";

  return { requests: reqs, prompt };
}

function pickCutoff(cfg: LoadedConfig, moduleKey: string): number {
  const base = cfg.modulePolicies?.cutoffs?.default ?? 84;
  const p = cfg.modulePolicies?.policies?.[moduleKey];
  return p?.cutoff ?? base;
}

function getCtaDefault(inp: QualityOSInput): string {
  const cta = inp.brandStyle?.ctaDefault;
  if (cta && cta.trim().length > 0) return cta.trim();
  return "상담으로 확인해보세요.";
}

function extractCEG(text: string): { claims: string[]; evidence: string[]; unlinkedClaims: string[] } {
  const sents = splitSentences(text);
  const claims: string[] = [];
  const evidence: string[] = [];
  for (const s of sents) {
    if (/(합니다|입니다|됩니다|입니다\.)/g.test(s) && s.length <= 120) claims.push(s);
    if (/(\d|인증|수상|후기|리뷰|매체|기사|협력)/g.test(s)) evidence.push(s);
  }
  const unlinkedClaims = claims.filter(c => !evidence.some(e => e === c));
  return { claims: uniq(claims).slice(0, 8), evidence: uniq(evidence).slice(0, 8), unlinkedClaims: uniq(unlinkedClaims).slice(0, 8) };
}

function evaluateDetection(text: string, rule: RuleSpec, cfg: LoadedConfig, inp: QualityOSInput): boolean {
  const d: any = rule.detection;

  const maps = getEffectiveRewriteMaps(cfg, inp.industryKey);

  const getLexicon = (key: string): string[] => {
    if (key === "CTA_LEXICON") return maps?.CTA_LEXICON ?? [];
    if (key === "CLICHE_BLOCKLIST") return maps?.CLICHE_BLOCKLIST ?? [];
    if (key === "OVERCLAIM_BLOCKLIST") return maps?.OVERCLAIM_BLOCKLIST ?? [];
    if (key === "ABSTRACT_WORDS") return maps?.ABSTRACT_WORDS ?? [];
    if (key === "ALLOW_REPEAT_KEYWORDS") return maps?.ALLOW_REPEAT_KEYWORDS ?? [];
    return maps?.[key] ?? [];
  };

  switch (d.type) {
    case "regex_any":
      return regexAny(text, d.patterns ?? [], d.flags);
    case "regex_none":
      return regexNone(text, d.patterns ?? [], d.flags);
    case "regex_count_lt":
      return regexCountLt(text, d.pattern, d.flags, d.minCount);
    case "lexicon_count_gte": {
      const lex = getLexicon(d.lexiconKey);
      return lexiconCount(text, lex) >= (d.minCount ?? 1);
    }
    case "cta_count": {
      const lex = getLexicon(d.ctaLexiconKey);
      return ctaCount(text, lex) > (d.maxAllowed ?? 1);
    }
    case "cta_near_end": {
      const lex = getLexicon(d.ctaLexiconKey);
      return !ctaNearEnd(text, lex, d.windowSentences ?? 2);
    }
    case "sentence_word_count_gt":
      return sentenceWordCountGt(text, d.maxWords ?? 28);
    case "ending_repetition_gte":
      return endingRepetitionGte(text, d.endings ?? [], d.minRun ?? 3);
    case "word_repetition_gte": {
      const ignore = getLexicon(d.ignoreLexiconKey);
      return wordRepetitionGte(text, d.minRepeats ?? 4, ignore);
    }
    case "list_item_count_gt":
      return listItemCountGt(text, d.maxItems ?? 4);
    case "qa_minimum_gate":
      return qaMinimumGate(text, d.minQuestions ?? 3, d.topicGroup ?? [], d.minTopics ?? 3);
    case "claim_count_gt":
      return claimCountGt(text, d.maxClaims ?? 1);
    case "composite_all":
      return (d.all ?? []).every((x: any) => evaluateDetection(text, { ...rule, detection: x } as any, cfg, inp));
    case "composite_any":
      return (d.any ?? []).some((x: any) => evaluateDetection(text, { ...rule, detection: x } as any, cfg, inp));
    default:
      // unknown detection: do not trigger
      return false;
  }
}

function applyActions(text: string, trigger: RuleTrigger, cfg: LoadedConfig, inp: QualityOSInput, actionsLog: Array<{ type: string; details?: any }>): string {
  const maps = getEffectiveRewriteMaps(cfg, inp.industryKey);
  const ctaLex = maps?.CTA_LEXICON ?? [];
  const ctaDefault = getCtaDefault(inp);

  let out = text;
  for (const a of trigger.rule.action ?? []) {
    const type = a.type;
    if (type === "REPLACE") {
      out = applyReplaceStrategy(out, a.strategy ?? "", { rewriteMaps: maps, brandStyle: inp.brandStyle, ctaDefault });
      actionsLog.push({ type: "REPLACE", details: { strategy: a.strategy, mapKey: a.mapKey } });
    } else if (type === "DOWNSHIFT") {
      out = applyDownshiftStrategy(out, a.strategy ?? "", { rewriteMaps: maps, brandStyle: inp.brandStyle, ctaDefault });
      actionsLog.push({ type: "DOWNSHIFT", details: { strategy: a.strategy } });
    } else if (type === "INSERT") {
      out = insert(out, a.position ?? "end", a.template ?? "", ctaLex, ctaDefault);
      actionsLog.push({ type: "INSERT", details: { position: a.position, template: a.template } });
    } else if (type === "MERGE_CTA") {
      out = ensureSingleCTA(out, ctaLex, ctaDefault);
      actionsLog.push({ type: "MERGE_CTA", details: { keep: ctaDefault } });
    } else if (type === "LABEL") {
      out = label(out, a.label ?? "");
      actionsLog.push({ type: "LABEL", details: { label: a.label } });
    }
  }
  return out;
}

function applyBrandBlacklist(text: string, blacklist: string[]): { text: string; triggered: boolean } {
  if (!blacklist?.length) return { text, triggered: false };
  let out = text;
  let trig = false;
  for (const term of blacklist) {
    if (!term) continue;
    const re = new RegExp(escapeRegExp(term), "g");
    if (re.test(out)) trig = true;
    out = out.replace(re, "[금지어]");
  }
  return { text: out, triggered: trig };
}

export class QualityOSRuntime {
  private cfg: LoadedConfig;
  constructor(cfg: LoadedConfig) {
    this.cfg = cfg;
  }

  run(input: QualityOSInput): QualityOSResult {
    const rules = (this.cfg.rules?.rules ?? []) as RuleSpec[];
    const version = this.cfg.rules?.version ?? "4.3.x";
    const cutoff = pickCutoff(this.cfg, input.moduleKey);
    const maxPasses = input.maxPasses ?? 3;

    let text = (input.draft ?? "").trim();
    const debugPasses: any[] = [];

    // brand blacklist pre-pass (does not add score; just prevents leakage)
    const bl = applyBrandBlacklist(text, input.brandStyle?.blacklist ?? []);
    if (bl.triggered) text = bl.text;

    let finalScorecard: any = null;

    for (let passNo = 1; passNo <= maxPasses; passNo += 1) {
      const textBefore = text;

      const penalties: Array<{ ruleId: string; delta: number; reason: string }> = [];
      const bonuses: Array<{ ruleId: string; delta: number; reason: string }> = [];
      const triggered: Array<{ ruleId: string; severity: Severity; message?: string }> = [];
      const actionsApplied: Array<{ type: string; details?: any }> = [];
      const dimensionDelta: any = {};
      let hardFail = false;

      // Evaluate and apply actions for triggered rules in deterministic order: HARD_FAIL -> HIGH -> MEDIUM -> LOW
      const order = { "HARD_FAIL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3 } as const;
      const candidates = rules
        .filter(r => moduleMatches(r, input.moduleKey))
        .sort((a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9));

      for (const r of candidates) {
        const isTriggered = evaluateDetection(text, r, this.cfg, input);
        if (!isTriggered) continue;

        triggered.push({ ruleId: r.id, severity: r.severity, message: r.message });

        // Score deltas
        const pen = r.score?.penalty;
        const bon = r.score?.bonus;
        if (typeof pen === "number") penalties.push({ ruleId: r.id, delta: pen, reason: r.message });
        if (typeof bon === "number") bonuses.push({ ruleId: r.id, delta: bon, reason: r.message });
        const dd = r.score?.dimensionDelta ?? {};
        for (const [k, v] of Object.entries(dd)) {
          dimensionDelta[k] = (dimensionDelta[k] ?? 0) + (v ?? 0);
        }

        // Hard fail flag
        if (r.severity === "HARD_FAIL") hardFail = true;

        // Apply actions
        text = applyActions(text, { rule: r, severity: r.severity, message: r.message }, this.cfg, input, actionsApplied);
      }

      // Ensure single CTA (global safety)
      const maps = getEffectiveRewriteMaps(this.cfg, input.industryKey);
      const ctaLex = maps?.CTA_LEXICON ?? [];
      text = ensureSingleCTA(text, ctaLex, getCtaDefault(input));

      // --- v4.3.2 Enforcement: Evidence Slot + Industry Disclaimers ---
      const effMaps = getEffectiveRewriteMaps(this.cfg, input.industryKey);
      const ctaLex2 = effMaps?.CTA_LEXICON ?? [];

      // Evidence Slot
      if (!hasEvidenceLine(text)) {
        const ev = buildEvidenceLineFromProof(input.proofPack);
        if (ev) {
          text = insert(text, "before_cta", ev, ctaLex2, getCtaDefault(input));
          actionsApplied.push({ type: "EVIDENCE_SLOT", details: { mode: "proof_pack" } });
        } else {
          const ver = buildVerificationLine(effMaps.__requiredSpecificity ?? [], input.proofPack);
          text = insert(text, "before_cta", ver, ctaLex2, getCtaDefault(input));
          actionsApplied.push({ type: "EVIDENCE_SLOT", details: { mode: "verification_method" } });
        }
      }

      // Required disclaimers (industry)
      const disclaimers: string[] = effMaps.__requiredDisclaimers ?? [];
      if (disclaimers.length && shouldInsertDisclaimers(input.moduleKey, this.cfg)) {
        for (const d of disclaimers) {
          if (!d) continue;
          if (text.includes(d)) continue;
          text = insert(text, "before_cta", d, ctaLex2, getCtaDefault(input));
          actionsApplied.push({ type: "DISCLAIMER_INSERT", details: { text: d } });
        }
      }
      // Build scorecard
      const ceg = extractCEG(text);
      finalScorecard = buildScorecard({
        version,
        moduleKey: input.moduleKey,
        industryKey: input.industryKey,
        cutoff,
        penalties,
        bonuses,
        triggered,
        actionsApplied,
        dimensionDelta,
        hardFail,
        ceg
      });

      debugPasses.push({
        passNo,
        textBefore,
        textAfter: text,
        triggered: triggered.map(t => ({ ruleId: t.ruleId, severity: t.severity })),
        actions: actionsApplied,
        totalScore: finalScorecard.totalScore,
        hardFail: finalScorecard.hardFail
      });

      if (finalScorecard.pass) break; // success
      // If hardFail persists due to missing required info, looping won't help. Stop if inserted 확인필요 exists.
      if (finalScorecard.hardFail && /\[확인필요/.test(text)) break;
      // Otherwise, next pass may improve (e.g., abstract->specific then rhythm pass)
    }


    const ir = buildInputRequests(input.moduleKey, this.cfg, input.industryKey, input.proofPack);
    return {
      finalCopy: text,
      scorecard: finalScorecard,
      debug: { passes: debugPasses, inputRequests: ir.requests, nextQuestionsPrompt: ir.prompt }
    };
  }
}
