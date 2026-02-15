
export const POSTER_INTENTS = [
    { id: "INT_PROMO_OFFER", label: "할인/오퍼", description: "할인율, 가격, 기간 한정 혜택 강조" },
    { id: "INT_PRODUCT_LAUNCH", label: "신제품/런칭", description: "새로운 메뉴, 제품, 서비스 소개" },
    { id: "INT_EVENT_GUIDE", label: "행사/공연", description: "전시, 공연, 지역 행사, 축제 안내" },
    { id: "INT_RECRUITING", label: "모집/채용", description: "직원 채용, 수강생 모집, 서포터즈" },
    { id: "INT_PUBLIC_NOTICE", label: "공공/공지", description: "정책 안내, 안전 수칙, 캠페인 (Strict)" },
    { id: "INT_BRAND_CAMPAIGN", label: "브랜딩", description: "브랜드 이미지, 슬로건 중심" },
    { id: "INT_B2B_SEMINAR", label: "B2B/세미나", description: "웨비나, 사업설명회, 컨퍼런스" },
] as const;

export const HEADLINE_TYPES = [
    { id: "HL_OFFER_FIRST", label: "혜택 중심", description: "20% 할인, 1+1 등 혜택을 가장 크게" },
    { id: "HL_AUDIENCE_FIRST", label: "타깃 중심", description: "소상공인 주목, 직장인 필독 등" },
    { id: "HL_PROBLEM_FIRST", label: "문제/상황", description: "야근에 지쳤다면, 매출 고민일 때" },
    { id: "HL_AUTHORITY_FIRST", label: "공식/권위", description: "공식 인증, 1위 브랜드, 정부 지원" },
] as const;

export const CHANNEL_PACKS = [
    { id: "PACK_PRINT_A2", label: "인쇄용 (A2/A3)", ratio: "1:1.414" },
    { id: "PACK_SIGNAGE_16_9", label: "사이니지 (16:9)", ratio: "16:9" },
    { id: "PACK_SNS_1_1", label: "인스타그램 (1:1)", ratio: "1:1" },
    { id: "PACK_SNS_9_16", label: "릴스/스토리 (9:16)", ratio: "9:16" },
] as const;

export const DENSITY_PROFILES = [
    { id: "DENSITY_MINIMAL", label: "임팩트형 (Minimal)", desc: "헤드라인 중심, 텍스트 최소화 (이미지형)" },
    { id: "DENSITY_STANDARD", label: "밸런스형 (Standard)", desc: "헤드라인 + 핵심 요약 3줄 (표준형)" },
    { id: "DENSITY_DETAILED", label: "정보형 (Detailed)", desc: "상세 정보, 라인업, 설명 포함 (가독성형)" },
] as const;

export const SLOT_IDS = {
    HEADLINE: "S_HEADLINE",
    SUBHEAD: "S_SUBHEAD",
    CTA: "S_CTA",
    OFFER_MAIN: "S_OFFER_MAIN",
    PERIOD: "S_PERIOD",
    CONDITIONS: "S_CONDITIONS",
    EXCLUSIONS: "S_EXCLUSIONS",
    LOCATION_OR_CHANNEL: "S_LOCATION_OR_CHANNEL",
    PRODUCT_NAME: "S_PRODUCT_NAME",
    KEY_FEATURES_3: "S_KEY_FEATURES_3",
    LAUNCH_PERIOD: "S_LAUNCH_PERIOD",
    PRICE: "S_PRICE_OR_TRIAL",
    EVENT_TITLE: "S_EVENT_TITLE",
    DATETIME: "S_DATETIME",
    LOCATION: "S_LOCATION",
    PROGRAM: "S_PROGRAM_HIGHLIGHTS",
    TICKET: "S_TICKET_OR_REGISTER",
    ROLE_TITLE: "S_ROLE_TITLE",
    ELIGIBILITY: "S_ELIGIBILITY",
    DEADLINE: "S_DEADLINE",
    HOW_TO_APPLY: "S_HOW_TO_APPLY",
    NOTICE_TITLE: "S_NOTICE_TITLE",
    TARGET: "S_TARGET",
    PROCEDURE: "S_PROCEDURE",
    CONTACT_OFFICIAL: "S_CONTACT_OFFICIAL",
    DISCLAIMER: "S_DISCLAIMER",
} as const;

export const SLOT_LABELS: Record<string, string> = {
    "S_HEADLINE": "메인 헤드카피",
    "S_SUBHEAD": "서브 카피",
    "S_CTA": "행동 유도 (CTA)",
    "S_OFFER_MAIN": "핵심 혜택/할인",
    "S_PERIOD": "기간 안내",
    "S_CONDITIONS": "유의사항/조건",
    "S_EXCLUSIONS": "제외 대상",
    "S_LOCATION_OR_CHANNEL": "장소/채널",
    "S_PRODUCT_NAME": "제품/서비스명",
    "S_KEY_FEATURES_3": "주요 특징 3가지",
    "S_LAUNCH_PERIOD": "런칭 기간",
    "S_PRICE_OR_TRIAL": "가격/체험정보",
    "S_EVENT_TITLE": "행사명",
    "S_DATETIME": "일시",
    "S_LOCATION": "장소",
    "S_PROGRAM_HIGHLIGHTS": "프로그램 하이라이트",
    "S_TICKET_OR_REGISTER": "예매/등록 방법",
    "S_TIMETABLE_MINI": "타임테이블 (요약)",
    "S_HOST_ORGANIZER": "주최/주관",
    "S_CAUTION_RULES": "주의사항/규칙",
    "S_SPONSORS_LOGOS": "후원사 로고",
    "S_ROLE_TITLE": "모집 분야/직무",
    "S_ELIGIBILITY": "자격 요건",
    "S_DEADLINE": "마감 기한",
    "S_HOW_TO_APPLY": "지원 방법",
    "S_BENEFITS_TOP3": "주요 혜택 Top 3",
    "S_PROCESS_STEPS_MINI": "전형 절차",
    "S_TEAM_CULTURE_ONE": "팀 문화 소개",
    "S_LOCATION_WORKMODE": "근무지/형태",
    "S_FAQ_MINI": "자주 묻는 질문",
    "S_NOTICE_TITLE": "공지 제목",
    "S_TARGET": "대상",
    "S_PROCEDURE": "절차/방법",
    "S_CONTACT_OFFICIAL": "공식 문의처",
    "S_LEGAL_OR_BASIS": "법적 근거/관련 규정",
    "S_DISCLAIMER": "면책 조항",
    "S_REQUIRED_DOCS_MINI": "제출 서류",
    "S_SELECTION_CRITERIA_MINI": "선발 기준",
    "S_SLOGAN": "브랜드 슬로건",
    "S_ONE_IDEA": "핵심 메시지 (One Idea)",
    "S_BRAND_SIGNATURE": "브랜드 시그니처",
    "S_MANIFESTO_3LINES": "매니페스토 (3줄)",
    "S_HASH_TAGS": "해시태그",
    "S_VISUAL_BRIEF": "비주얼 설명",
    "S_SEMINAR_TITLE": "세미나 제목",
    "S_TARGET_AUDIENCE": "참석 대상",
    "S_AGENDA_3": "주요 아젠다",
    "S_SPEAKER_OR_HOST": "연사/호스트",
    "S_REGISTER_LINK_OR_QR": "신청 링크/QR",
    "S_BENEFIT_FOR_ATTENDEE": "참석자 혜택",
    "S_LIMITED_SEATS": "인원 제한/잔여석",
    "S_COMPANY_LOGOS": "참여 기업 로고",
};

export const POSTER_INDUSTRIES = [
    {
        category: "문화·전시·공연",
        items: ["전시(미술/사진/체험전)", "공연(연극/뮤지컬/콘서트)", "영화·상영회·GV", "페스티벌/아트마켓/플리마켓"]
    },
    {
        category: "지역·공공 행사",
        items: ["지자체 축제/지역행사", "주민센터/도서관 프로그램", "공공 캠페인(안전/환경/교통)", "공모전/참여 이벤트(시민 참여형)"]
    },
    {
        category: "박람회·컨벤션·B2B 이벤트",
        items: ["산업 박람회/엑스포", "컨퍼런스/포럼/세미나", "IR/데모데이/네트워킹", "브랜드/기업 전시부스 안내"]
    },
    {
        category: "기업 홍보·브랜딩",
        items: ["회사 소개/브랜드 캠페인", "서비스 런칭/업데이트 공지", "사내 행사(워크숍/타운홀/송년회)", "파트너 모집/제휴 안내"]
    },
    {
        category: "리테일·매장",
        items: ["오픈/리뉴얼/이전 안내", "시즌 세일/프로모션", "인기상품/신상품 소개", "멤버십/적립/쿠폰 안내"]
    },
    {
        category: "식음료(F&B)",
        items: ["신메뉴/시그니처 메뉴", "런치/해피아워/세트 구성", "배달/포장 안내(시간·방법)", "매장 이벤트(리뷰/스탬프/증정)"]
    },
    {
        category: "병의원·헬스케어",
        items: ["진료과목/시술·검진 안내", "예약/상담 유도 포스터", "의료진/장비/시설 소개", "건강 캠페인(예방접종/검진 시즌)"]
    },
    {
        category: "뷰티·미용·패션",
        items: ["헤어/네일/피부/왁싱 등 프로모션", "전후/포트폴리오 강조형", "시즌 스타일/룩북형", "회원권/패키지/정기권 안내"]
    },
    {
        category: "스포츠·피트니스·레저",
        items: ["PT/클래스 모집(요가/필라테스 등)", "체험권/등록 프로모션", "대회/동호회 모집", "시설/시간표 안내(운영 공지)"]
    },
    {
        category: "교육·학원·클래스",
        items: ["수강생 모집(정규/단기 특강)", "설명회/상담회/레벨 테스트", "합격/성과(수상/합격자) 강조형", "시간표/커리큘럼 안내"]
    },
    {
        category: "채용·모집",
        items: ["정규/계약/인턴 채용", "알바/단기 스태프 모집", "봉사자/서포터즈 모집", "동아리/커뮤니티 멤버 모집"]
    },
    {
        category: "부동산·주거",
        items: ["분양/오픈하우스/설명회", "매물 홍보(상가/오피스/주택)", "이전/입주/현장 안내", "관리사무소 공지(단지 내 안내)"]
    },
    {
        category: "여행·관광·숙박",
        items: ["투어/패키지 상품", "시즌 프로모션(성수기/비수기)", "지역 관광 이벤트/체험", "호텔/리조트 시설·혜택 안내"]
    },
    {
        category: "종교·비영리·커뮤니티",
        items: ["집회/행사/예배 일정", "기부/후원 캠페인", "커뮤니티 모임/정기 행사", "강연/교육 프로그램"]
    }
] as const;
