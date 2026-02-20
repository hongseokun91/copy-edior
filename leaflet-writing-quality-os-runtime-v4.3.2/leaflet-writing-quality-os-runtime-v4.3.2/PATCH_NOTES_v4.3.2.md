# Patch Notes v4.3.2 (Quality Only)

## 1) Industry Override Wiring (완전 연결)
- `rewrite_maps.v4.3.json > INDUSTRY_OVERRIDES[industryKey]` 를 런타임에서 merge
- 적용 범위:
  - `extraOverclaimBlock` → `OVERCLAIM_BLOCKLIST`에 병합 (탐지/완화 자동)
  - `requiredDisclaimers` → 고위험 모듈(가격/전후/보증/Q&A 등)에서 **누락 시 자동 삽입**
  - `requiredSpecificity` → (인쇄 등) 사양 확정 항목을 **‘검증 방법’ 문장으로 안전하게 명시** (환각 방지 + 품질 상승)

## 2) Evidence Slot Enforcement (강제)
- ProofPack 제공 시: `근거:` 문장 자동 생성(숫자/후기/인증/협력/언론 중 1~3개)
- ProofPack 미제공 시: `검증 방법:` 문장 자동 생성(합의/체크리스트/기준 공개 방식)
- 기존에 `근거:` 또는 `검증 방법:`이 있으면 중복 삽입하지 않음

## 3) Auto Input Requests (모듈 최소요건 미충족 시)
- module policy(`module_policies.v4.3.json`) 기반으로 필요한 입력을 점검
- 부족할 경우:
  - `debug.inputRequests: string[]`
  - `debug.nextQuestionsPrompt: string` (내부용 1-shot 질문 프롬프트)
  를 생성하여 “입력 보강 루프”를 쉽게 만듦 (UI 변경 없이 서버 로깅/운영에 사용)

## Compatibility
- 기존 `finalCopy`/`scorecard` 구조는 유지
- 신규 산출물은 `debug.*`에만 추가 (UI/스펙 영향 최소화)
