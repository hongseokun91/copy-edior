핵심 정리
확정 스택 (v0.1)
Dev 환경:Google Antigravity (+ MCP로 GitHub 등 연결) 
Web:Next.js(App Router) + TypeScript
UI:Tailwind CSS + shadcn/ui(= Radix 기반 컴포넌트)
폼/검증:react-hook-form + zod
Backend:Next.js Route Handlers(/api/*)
레이트리밋/쿨다운/캐시:Upstash Redis(REST)
배포:Vercel
테스트:Playwright(E2E) + Vitest(유닛)
분석:PostHog(커스텀 이벤트 필요 시) — v0.1에선 “옵션이지만 추천”
“capture는 비동기, 실패 무시”
PostHog 이벤트 발화는 fire-and-forget 원칙(절대 await 하지 않음, 실패 무시)으로 UX를 블로킹하지 않는다.
핵심 이유: DB 없이도 운영 가능한 구조(무가입/영구 DB 저장 없음)에서, 꼭 필요한 “IP 일일 제한 + 동일 입력 결과 캐시(TTL)”만 Redis로 해결하면 가장 가볍고 안정적입니다.
솔루션
1) 아키텍처 결정(왜 이 조합인가)
Next.js 단일 앱: 프론트/백을 한 repo에서 끝내서 개발/배포/수정 루프가 가장 짧음
Vercel: 무가입 SaaS류에서 가장 빠른 배포/롤백/환경변수 관리
Upstash Redis(REST): Edge/서버리스에서 붙이기 쉽고,
IP 일일 카운트(자정 KST 리셋)
쿨다운 10초
입력 해시 기반 결과 캐시 24h를 한 번에 해결
DB는 v0.1에 불필요: 유저 저장이 없고, 결과 캐시는 Redis로 충분
2) Antigravity에서의 작업 방식(추천 세팅)
Antigravity는 에이전트가 계획/검증/반복 작업을 하도록 설계된 개발 플랫폼이라, 우리가 만든 에픽/티켓 백로그를 그대로 “에이전트 미션”으로 돌리기 좋습니다.
MCP는 “도구 연결 포트”처럼 동작하고, Antigravity 안에서 MCP 서버를 설치/연결하는 흐름이 공식적으로 안내됩니다. 
v0.1에서 추천 MCP 연결:
GitHub MCP(PR/이슈/검색 자동화)
(선택) Figma MCP(썸네일 작업 참고용)
(선택) 배포/로그 확인은 Vercel CLI로도 충분(초기엔 MCP 없어도 OK)
3) 런타임 선택(Edge vs Node)
/api/generate: Edge Runtime 권장(속도/확장성)
단, 특정 라이브러리 호환성 문제가 있으면 Node로 전환(기능 영향 없음)
Upstash REST 클라이언트는 Edge에서 잘 맞는 편이라(서버리스 친화), 우선 Edge로 시작하는 게 깔끔합니다
“Edge+Upstash에서 네트워크 오류 발생 시 Fail-Mode(캐시 fail-open 등) 표준”
Upstash(Redis) 장애/Timeout 시 캐시·레이트리밋·쿨다운은 보조장치로 간주하고 요청은 fail-open으로 생성 플로우를 계속 진행하되(degraded 로그/플래그 기록).

.
예시
최종 스택 “한 줄” 버전
Antigravity + Next.js(App Router, TS) + Tailwind/shadcn + zod/RHF + Vercel + Upstash Redis(rl/cooldown/cache) + Playwright/Vitest (+ PostHog 옵션)“capture는 비동기, 실패 무시”
환경변수(최소)
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
IP_HASH_SALT
DAILY_LIMIT=20
COOLDOWN_SECONDS=10
(옵션) POSTHOG_KEY, POSTHOG_HOST
고급 팁
v0.1은 “DB 없는 설계”를 끝까지 유지하세요. 단순 UX보다 더 큰 운영 이점이 생깁니다(보안/비용/유지보수).
Antigravity에선 백로그 티켓을 그대로 “미션”으로 주고, 결과를 Artifact로 검증하는 방식이 잘 맞습니다. 
PostHog는 커스텀 이벤트가 꼭 필요할 때만붙이고, 초기엔 서버 로그+Vercel Analytics로도 충분히 갈 수 있어요(단, PRD의 이벤트 정밀도가 필요하면 PostHog 추천).
공식 링크 모음(스택 확정용)
Antigravity: https://antigravity.google/ (Docs: https://antigravity.google/docs) Next.js: https://nextjs.org/docs Vercel: https://vercel.com/docs Upstash Redis: https://docs.upstash.com/ Tailwind CSS: https://tailwindcss.com/docs shadcn/ui: https://ui.shadcn.com/ react-hook-form: https://react-hook-form.com/ zod: https://zod.dev/ Playwright: https://playwright.dev/ Vitest: https://vitest.dev/ PostHog: https://posthog.com/docs Sentry(옵션): https://docs.sentry.io/ 
원하면 다음으로, 이 스택 기준으로 repo 구조(폴더), API 라우트 설계, Upstash 키 설계(자정 KST TTL 계산), 초기 UI 컴포넌트 리스트까지 “첫 커밋 설계도” 형태로 바로 내려드릴게요.
