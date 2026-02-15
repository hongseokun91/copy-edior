// src/lib/brochure-industry.ts
import { IndustryL1 } from "@/types/brochure";

export interface IndustryDefinition {
    l1: IndustryL1;
    label: string;
    description: string;
    l2Items: Array<{
        id: string;
        label: string;
        l3Items?: string[];
    }>;
}

export const INDUSTRY_TAXONOMY: IndustryDefinition[] = [
    {
        l1: "A",
        label: "농림어업 (Agriculture, Forestry & Fishing)",
        description: "1차 산업 - 스마트팜, 축산, 수산 등",
        l2Items: [
            { id: "AG_TECH", label: "농업기술/스마트팜", l3Items: ["스마트팜 솔루션", "농자재", "농업데이터"] },
            { id: "LIVESTOCK", label: "축산/사료", l3Items: ["동물복지", "사료 제조", "유통"] }
        ]
    },
    {
        l1: "B",
        label: "광업 (Mining & Quarrying)",
        description: "에너지 자원, 광물 채굴 및 가공",
        l2Items: [
            { id: "MIN_ENERGY", label: "에너지 자원", l3Items: ["석탄/석유 채굴", "천연가스", "에너지 원료"] },
            { id: "MIN_NONMETAL", label: "비금속 광물", l3Items: ["건설 골재", "석재 가공", "산업용 원료"] }
        ]
    },
    {
        l1: "C",
        label: "제조업 (Manufacturing)",
        description: "전기, 전자, 반도체 및 일반 제조",
        l2Items: [
            { id: "MFG_ELECTRONICS", label: "전기/전자/반도체", l3Items: ["반도체 장비", "전자부품", "공정기술"] },
            { id: "MFG_BIO_HEALTH", label: "바이오/헬스케어 제조", l3Items: ["의약품", "의료기기", "건강기능식품"] },
            { id: "MFG_CONSUMER", label: "소비재 제조", l3Items: ["식품 OEM", "뷰티 제조", "패키징"] }
        ]
    },
    {
        l1: "D",
        label: "전기, 가스, 증기 및 공기 조절 공급업 (Utilities)",
        description: "에너지 발전 및 공급 서비스",
        l2Items: [
            { id: "UTIL_ENERGY", label: "전력 및 신재생에너지", l3Items: ["태양광/풍력 발전", "수소 에너지", "스마트 그리드"] },
            { id: "UTIL_GAS", label: "가스 공급", l3Items: ["도시가스 서비스", "LNG 인프라"] }
        ]
    },
    {
        l1: "E",
        label: "수도, 하수 및 폐기물 처리, 원료 재생업 (Environmental Services)",
        description: "환경 인프라 및 자원 순환",
        l2Items: [
            { id: "ENV_WATER", label: "수처리/상하수도", l3Items: ["정수 시설", "수처리 솔루션"] },
            { id: "ENV_RECYCLE", label: "폐기물/재생", l3Items: ["업사이클링", "폐기물 처리 시스엠"] }
        ]
    },
    {
        l1: "F",
        label: "건설업 (Construction)",
        description: "건축, 토목 및 인테리어",
        l2Items: [
            { id: "CON_ARCH", label: "종합건설/건축", l3Items: ["주택건설", "상업빌딩", "플랜트"] },
            { id: "CON_CIVIL", label: "토목 엔지니어링", l3Items: ["교량/터널", "단지 조성"] }
        ]
    },
    {
        l1: "G",
        label: "도매 및 소매업 (Wholesale & Retail Trade)",
        description: "유통, 커머스 및 무역",
        l2Items: [
            { id: "RET_ECOMMERCE", label: "이커머스/유통", l3Items: ["D2C 브랜드", "플랫폼 입점", "물류 대행"] },
            { id: "WHO_TRADE", label: "해외무역/수출입", l3Items: ["글로벌 소싱", "수출 전문"] }
        ]
    },
    {
        l1: "H",
        label: "운수 및 창고업 (Transportation & Storage)",
        description: "물류, 운송 및 모빌리티",
        l2Items: [
            { id: "LOG_LASTMILE", label: "라스트마일 물류", l3Items: ["퀵커머스", "배송 자동화"] },
            { id: "LOG_MOBILITY", label: "모빌리티 서비스", l3Items: ["카셰어링", "자율주행 인프라"] }
        ]
    },
    {
        l1: "I",
        label: "숙박 및 음식점업 (Accommodation & Food Service)",
        description: "호스피탈리티 및 외식 산업",
        l2Items: [
            { id: "HOS_HOTEL", label: "숙박/스테이", l3Items: ["호텔/리조트", "공유숙박"] },
            { id: "FNB_RESTAURANT", label: "외식/프랜차이즈", l3Items: ["브랜드 가맹", "푸드테크"] }
        ]
    },
    {
        l1: "J",
        label: "정보통신업 (Information & Communications)",
        description: "소프트웨어, 플랫폼, 인프라",
        l2Items: [
            { id: "IT_SAAS", label: "SaaS/B2B 솔루션", l3Items: ["협업툴", "보안 솔루션", "데이터 솔루션"] },
            { id: "IT_PLATFORM", label: "커머스/미디어 플랫폼", l3Items: ["라이브커머스", "스트리밍", "에드테크"] }
        ]
    },
    {
        l1: "K",
        label: "금융 및 보험업 (Finance & Insurance)",
        description: "핀테크, 투자, 전통 금융",
        l2Items: [
            { id: "FIN_TECH", label: "핀테크", l3Items: ["결제 솔루션", "자산관리", "블록체인"] },
            { id: "FIN_VC_PE", label: "투자/자문", l3Items: ["VC/PE", "액셀러레이터", "전략자문"] }
        ]
    },
    {
        l1: "L",
        label: "부동산업 (Real Estate)",
        description: "부동산 개발, 임대 및 관리",
        l2Items: [
            { id: "RE_DEVELOP", label: "부동산 개발/분양", l3Items: ["상가 분양", "시행사 소개"] },
            { id: "RE_PROPTECH", label: "프롭테크/관리", l3Items: ["임대관리 솔루션", "부동산 데이터"] }
        ]
    },
    {
        l1: "M",
        label: "전문, 과학 및 기술 서비스업 (Professional, Scientific & Technical)",
        description: "R&D, 설계, 컨설팅 및 전문 서비스",
        l2Items: [
            { id: "PROF_RD", label: "R&D/과학기술", l3Items: ["소재 연구", "특허 가치 평가"] },
            { id: "PROF_MARKETING", label: "마케팅/광고 에이전시", l3Items: ["브랜딩", "디지털 광고"] }
        ]
    },
    {
        l1: "N",
        label: "사업시설 관리, 사업 지원 및 임대 서비스업 (Business Support)",
        description: "시설 관리, 인력 공급 및 렌탈",
        l2Items: [
            { id: "BS_FM", label: "시설관리(FM)", l3Items: ["건물 관리", "종합 아웃소싱"] },
            { id: "BS_RENTAL", label: "B2B 렌탈", l3Items: ["장비 렌트", "오피스 렌탈"] }
        ]
    },
    {
        l1: "O",
        label: "공공 행정, 국방 및 사회보장 행정 (Public Administration)",
        description: "지자체, 공공기관 및 조달",
        l2Items: [
            { id: "PUB_POLICY", label: "지자체/공공정책", l3Items: ["지원사업", "시민서비스", "정책홍보"] },
            { id: "PUB_PROCURE", label: "공공조달/국방", l3Items: ["입찰제안", "인프라 구축", "조달규격"] }
        ]
    },
    {
        l1: "P",
        label: "교육 서비스업 (Education)",
        description: "온/오프라인 교육 및 훈련",
        l2Items: [
            { id: "EDU_TECH", label: "에듀테크", l3Items: ["LMS 솔루션", "AI 학습"] },
            { id: "EDU_ACADEMY", label: "전문 직업 교육", l3Items: ["자격증 과정", "기업 교육"] }
        ]
    },
    {
        l1: "Q",
        label: "보건업 및 사회복지 서비스업 (Healthcare & Social Work)",
        description: "의료 서비스 및 실버 케어",
        l2Items: [
            { id: "HC_HOSPITAL", label: "의료기관/병원", l3Items: ["전문 클리닉", "건강검진 센터"] },
            { id: "HC_SILVER", label: "실버케어/복지", l3Items: ["요양 서비스", "시니어 라이프"] }
        ]
    },
    {
        l1: "R",
        label: "예술, 스포츠 및 여가관련 서비스업 (Arts, Sports & Recreation)",
        description: "문화, 예술, 스포츠 및 컨텐츠",
        l2Items: [
            { id: "ART_CULTURE", label: "문화/예술 컨텐츠", l3Items: ["전시/공연", "콘텐츠 IP"] },
            { id: "SPT_LEISURE", label: "스포츠/피트니스", l3Items: ["스포츠 시설", "레저 서비스"] }
        ]
    },
    {
        l1: "S",
        label: "협회 및 단체, 수리 및 기타 개인 서비스업 (Associations & Personal Services)",
        description: "비영리 단체, 협회 및 가계 서비스",
        l2Items: [
            { id: "ASC_ASSOCIATION", label: "이익단체/협회", l3Items: ["기관 홍보", "회원사 서비스"] },
            { id: "ASC_PERSONAL", label: "개인 서비스", l3Items: ["수리/케어", "커뮤니티"] }
        ]
    },
    {
        l1: "T",
        label: "가구 내 고용활동 및 달리 분류되지 않은 자가소비 생산활동 (Household Activities)",
        description: "가계 서비스 전문",
        l2Items: [
            { id: "HH_SERVICE", label: "가계 관리 서비스", l3Items: ["가사 대행", "홈 메니지먼트"] }
        ]
    },
    {
        l1: "U",
        label: "국제 및 외국기관 (International Organizations)",
        description: "정부 간 기구 및 주한 외국 기관",
        l2Items: [
            { id: "INT_ORG", label: "국제 기구/대사관", l3Items: ["협력 프로젝트", "국가 홍보"] }
        ]
    }
];
