솔루션: 스프린트 백로그(에픽 → 티켓)
공통 DoD(Definition of Done) — 모든 티켓 적용
모바일(360px)에서 깨짐 없음
접근성: 라벨/포커스/키보드 탭 이동 기본 동작
에러는 모달 없이 인라인 처리(레이트리밋/쿨다운 포함: 결과 영역 상단 배너 1줄 허용)
로그에 원문 IP 저장/출력 금지(해시만)
EPIC 0. 프로젝트 세팅 & 공통 기반(Foundation)
T0-1. 리포지토리/프레임워크 초기화 (FE/DevOps) — 난이도: 하
내용
Next.js(App Router) 기본 세팅
환경변수 구조 정의(.env.example)
린트/포맷(ESLint/Prettier) 최소 세팅
AC
pnpm dev실행, /와 /make라우팅 동작
빌드/런 정상
의존성없음
T0-2. 공통 타입/스키마 정의 (FE/BE) — 난이도: 중
내용
Request/Response 타입: GenerateRequest, GenerateResponse, Variant, Slots
입력 검증 스키마(zod 등)
AC
FE/BE가 동일 타입을 공유(또는 동기화)하고 컴파일 에러 없음
의존성T0-1
T0-3. 공통 UI 컴포넌트 베이스 (FE) — 난이도: 하
내용
버튼, 인풋, 칩, 탭, 카드, 토글, 인라인 에러 컴포넌트
AC
디자인 일관성 유지(여백/폰트/상태)
의존성T0-1
EPIC 1. 홈 & 생성 페이지 UI(UX 단순화 핵심)
T1-1. 홈(/) 구현 (FE) — 난이도: 하
내용
메인 카피 1줄 + CTA 1개(“전단지 문구 만들기”)
(옵션) 인기 업종 칩 6개(클릭 시 /make에 preset 전달)
AC
CTA 클릭으로 /make 이동
칩 클릭 시 업종이 미리 선택된 상태로 이동
의존성T0-1
T1-2. 생성 페이지 레이아웃(한 화면) (FE) — 난이도: 중
내용
상단 바: 타입 탭(전단지 고정), 톤 드롭다운, (옵션) 디자이너 모드 토글
입력 폼(필수 6) + 스타일 영역 + 생성 버튼 + 결과 영역(하단)
AC
스크롤 흐름: 입력 → 버튼 → 결과가 자연스럽게 이어짐
결과 영역은 생성 전엔 “가이드 상태” 표시
의존성T0-3
T1-3. 필수 6개 입력 UX 구현 (FE) — 난이도: 중
내용
업종: 검색형 드롭다운 + 추천 칩
목적: 칩 그룹
상호/혜택: 텍스트
기간: 칩 + 직접입력(칩 선택 시 입력칸에 자동 반영)
문의: 채널 라디오 + 값 입력(placeholder가 채널에 따라 변경)
AC
6개 모두 채워야 “문구 만들기” 활성화
필드별 인라인 에러(2~3줄 이내)
의존성T1-2, T0-2
T1-4. 로딩/에러 상태 UX(모달 최소) (FE) — 난이도: 중
내용
생성 중: 결과 영역 스켈레톤 + 1줄 상태 텍스트
서버 오류: 결과 영역 상단 인라인 경고
레이트리밋 초과: 결과 영역 상단 “오늘 남은 횟수/리셋 시간” 안내
AC
모달 없이도 사용자가 다음 행동을 이해 가능
의존성T2-1(API) 이후 연동 필요(우선 UI 스텁 가능)
EPIC 2. 스타일 시스템(정적 썸네일 + 규칙)
T2-1. StyleSpec(정적 데이터) 정의 (FE/BE) — 난이도: 중
내용
styles.ts/json에 8~12개 스타일 정의
필드: id, name, tags, previewUrl, rules(length_bias, emoji_allowed, headline_pattern...)
AC
FE 카드 렌더 가능
BE가 styleId로 rules 참조 가능
의존성T0-2
T2-2. 스타일 선택 UI(추천 3 + 더보기) (FE) — 난이도: 중
내용
업종/목적 기반 “추천 3개” 상단 노출(간단 룰테이블로 시작)
더보기 펼침 시 전체 스타일 카드 그리드
AC
기본은 추천 3만 보여서 단순해 보임
선택 즉시 active 상태 반영
의존성T2-1, T1-2
T2-3. 스타일 썸네일 제작/적용 (Design/FE) — 난이도: 중
내용
Figma로 8~12개 썸네일 제작 → webp export → /public/styles/*.webp
AC
카드 썸네일 로딩 빠르고 깨짐 없음
의존성T2-1
EPIC 3. 생성 API + 운영장치(레이트리밋/쿨다운/캐시)

공통 AC(EPIC 3): Redis 장애/Timeout 시 cache/rate/cooldown은 서비스 치명 장애로 간주하지 않고 fail-open(생성 플로우 계속) + degraded 로그/플래그를 남긴다.
공통 AC(EPIC 3): 처리 순서는 RateLimit → Cooldown → CacheHit → Generate로 고정한다(문서/코드 동일).



T3-1. POST /api/generate스켈레톤 + 검증 (BE) — 난이도: 중
내용
요청 body 검증(필수 6개 + tone + styleId)
실패 시 에러코드/메시지 규격화
AC
invalid input에 대해 일관된 응답 반환
의존성T0-2



T3-2. IP 추출 + 해시 처리 (BE) — 난이도: 중
내용
x-forwarded-for기반 클라이언트 IP 추출
sha256(ip + salt)로 ipHash 생성
AC
로그/저장 어디에도 원문 IP가 남지 않음
의존성T3-1
T3-3. 일일 레이트리밋(자정 KST 리셋) (BE/DevOps) — 난이도: 상
내용
KV/Redis에 rl:{YYYY-MM-DD(KST)}:{ipHash}카운터
TTL을 “다음날 00:00 KST”까지
응답에 remaining, resetAtKST포함
AC
제한 도달 시 429 + resetAt 반환
KST 기준으로 리셋 확인
의존성T3-2
T3-4. 쿨다운(연속 요청 방지) (BE) — 난이도: 중
내용
cd:{ipHash}10초 TTL
쿨다운 중이면 429(별도 코드) + 남은 초 안내
AC
연타 시 서버 비용이 늘지 않음
의존성T3-2
T3-5. 입력 해시 기반 결과 캐시(24h) (BE) — 난이도: 중
내용
inputHash = sha256(coreInputs+tone+styleId)
gen:{inputHash}로 결과 저장(24h TTL)
AC
“Redis timeout/error 시 요청은 5xx로 죽지 않고, degraded 모드로 진행”
동일 입력 재요청 시 cacheHit=true, 빠른 응답
의존성T3-1
EPIC 4. 문구 생성 엔진(규격/품질 장치 중심)
T4-1. 슬롯/패널 스키마(전단지 1면 확정) (BE) — 난이도: 중
내용
슬롯: HEADLINE/SUBHEAD/BULLETS(3~5)/CTA/INFO(3줄)/DISCLAIMER
각 제한값 상수화
AC
모든 결과가 슬롯 구조로 반환됨(빈 슬롯 없음)
의존성T0-2



T4-1a. LLM Output Validator + Fallback
AC: “응답 스키마 불일치 시 1회 수정요청(repair) → 실패하면 fallback”

T4-1a. LLM 응답 검증 + Repair/Fallback (BE) — 난이도: 상
내용
LLM 응답을 슬롯 스키마로 검증(zod 등)
검증 실패 시 repair 프롬프트로 1회 재요청
repair도 실패하면 safeFallbackTemplate(input)로 결과 생성AC
파싱 실패가 전체 실패(500)로 이어지지 않고, 품질 저하 모드로 200 응답 유지의존성T4-1




T4-2. 업종×목적×톤×스타일 “패턴 템플릿” 1차 구현 (BE/Content) — 난이도: 상
내용
헤드라인 패턴, CTA 패턴, 불릿 패턴(업종군 별) 최소 세트
오퍼/기간/문의가 자연스럽게 끼워지도록 템플릿 설계
AC
최소 10개 업종군에서 “사용 가능한 문장”이 안정적으로 생성
의존성T4-1, T2-1
T4-3. 글자수 초과 처리: 자동 축약 (BE) — 난이도: 상
내용
불용어 제거, 조사/어미 단순화, 동의어 치환
슬롯별 축약 규칙(CTA/헤드라인 우선순위)
AC
1차로 대부분 제한 내로 수렴
축약 적용 여부를 meta.warnings로 표시
의존성T4-2
T4-4. 그래도 초과 시 “슬롯 단위 재생성(짧은 버전)” (BE) — 난이도: 상
내용
초과한 슬롯만 짧은 템플릿으로 재생성
AC
최종적으로 제한을 지키도록 강제(가능한 한)
불가 시에만 경고 뱃지(“수정 권장”) 반환
의존성T4-3
T4-5. 업종군 안전표현 완화 룰 (BE) — 난이도: 중
내용
헬스/다이어트/의료 유사 업종군: 단정/과장 표현 필터링/완화
AC
금칙 패턴이 결과에 포함되지 않도록 처리
의존성T4-2
EPIC 5. 결과 UI(사장님용/디자이너용) + 복사/다운로드
T5-1. 결과 렌더(사장님용) (FE) — 난이도: 중
내용
카드형 섹션으로 슬롯을 보기 좋게 출력
변형 A/B/C 탭(또는 세그먼트)
AC
생성 직후 즉시 렌더
A/B/C 전환 시 깜빡임 최소
의존성T3-1 응답 형태, T4-1
T5-2. 디자이너 모드 출력(슬롯ID + 글자수) (FE) — 난이도: 중
내용
SLOT_ID (len/max): text고정 포맷
글자수 카운트 정확히 표시
AC
len/max가 실제 문자 기준으로 정확
의존성T5-1
T5-3. 슬롯별 복사 / 전체 복사 (FE) — 난이도: 하
내용
각 슬롯 옆 “복사” 버튼
전체 복사 시 슬롯 순서 고정(디자이너용 포맷 옵션)
AC
모바일에서도 복사 성공 UX(토스트 1회)
의존성T5-1
T5-4. TXT 다운로드 (FE) — 난이도: 하
내용
flyer_{date}_{name}.txt다운로드
사장님용/디자이너용 중 선택(기본: 디자이너용)
AC
윈도/모바일에서 다운로드 정상
의존성T5-1
EPIC 6. 이벤트/로그/관측(Analytics & Observability)
T6-1. 이벤트 정의 & 발화 지점 삽입 (FE) — 난이도: 중
내용
page_view, generate_click/success/fail, copy_slot, copy_all, download_txt, change_style/tone/variant, rate_limited
AC
이벤트 누락 없이 호출
의존성T1-2, T5-3
“이벤트 전송 실패/지연이 generate 완료 렌더에 영향 0”
추가 AC: Analytics(PostHog 등) 전송은 UI 흐름을 절대 블로킹하지 않는다(await 금지, 실패/지연 무시, fire-and-forget).
T6-2. 서버 로그/에러 추적(원문 IP 금지) (BE/DevOps) — 난이도: 중
내용
requestId 발급
에러 시 requestId로 상관관계 확인 가능
AC
운영 이슈 추적 가능(개인정보 노출 없음)
의존성T3-2
EPIC 7. 배포/QA/릴리즈 체크리스트
T7-1. 배포 파이프라인 구성(DevOps) — 난이도: 중
내용
Production 환경변수 세팅
KV/Redis 연결 설정
AC
프로덕션에서 generate 정상 동작
의존성T3-3
T7-2. E2E 시나리오 테스트(최소 5케이스) (QA/FE) — 난이도: 중
케이스
정상 생성(A/B/C)
입력 누락(필드별 인라인 에러)
레이트리밋 초과(429 + resetAt 표시)
쿨다운 동작
캐시 히트(응답 빨라짐 + cacheHit=true)
AC
릴리즈 전 체크리스트 통과
의존성T3-3~T5-4
T7-3. 콘텐츠 QA(업종군 10개 샘플) (Content/QA) — 난이도: 중
내용
업종군별 3샘플씩 생성 → 슬롯 길이/자연스러움 점검
AC
“인쇄물에 바로 넣을 수 있는 수준” 최소 기준 충족
의존성T4-2~T4-5
예시: “바로 착수 가능한 1차 스프린트 범위(추천)”
Sprint 1(기반 + 전단지 MVP End-to-End)
T0-1, T0-2, T0-3
T1-1, T1-2, T1-3
T2-1, T2-2 (썸네일은 임시 이미지로 시작 가능)
T3-1, T3-2, T3-5(캐시)
T4-1, T4-2(업종군 최소 5개로 시작)
T5-1, T5-3
→ 이 조합이면 “입력 → 생성 → 결과 복사”까지 End-to-End가 바로 나옵니다.
레이트리밋/쿨다운/안전표현/다운로드/E2E는 다음 스프린트에서 붙이는 게 안정적입니다.
