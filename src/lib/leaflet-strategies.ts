import { leafletIndustryClusters } from "./schemas";

export type LeafletCluster = keyof typeof leafletIndustryClusters;

export interface LeafletStrategy {
    A: { tone: string; keywords: string[]; instruction: string; label: string; writingStyle: string; moduleInstructions: Record<string, string> };
    B: { tone: string; keywords: string[]; instruction: string; label: string; writingStyle: string; moduleInstructions: Record<string, string> };
    C: { tone: string; keywords: string[]; instruction: string; label: string; writingStyle: string; moduleInstructions: Record<string, string> };
}

export const LEAFLET_STRATEGIES: Record<LeafletCluster, LeafletStrategy> = {
    "🏛️ 전문 서비스": {
        A: {
            label: "전문성/신뢰 (Expertise)",
            tone: "논리적이고, 전문적이며, 신뢰감을 주는 (Logical, Professional, Trustworthy)",
            writingStyle: "Technical Editor (Dry, Factual, Analytic)",
            keywords: ["최고의 전문가", "승소율", "체계적 분석", "법적 보호", "성공 사례"],
            instruction: "고객에게 '최고의 전문가'라는 인식을 심어주세요. 감정에 호소하기보다 객관적인 수치, 자격, 경력을 강조하고, 문제가 해결되는 논리적인 과정을 서술하세요.",
            moduleInstructions: {
                brand_story: "Focus on the Founder's Philosophy and prestigious history. Use 'Established in 19XX' style.",
                core_service: "Detail the 'Systematic Process' (Step 1 -> Step 2 -> Step 3). Explain WHY this process works.",
                customer_review: "Select review that mentions specific results (won money, saved tax).",
                faq: "Address high-level concerns about risks and costs."
            }
        },
        B: {
            label: "문제 해결/공감 (Problem Solving)",
            tone: "날카롭지만 든든한 (Sharp but Reassuring)",
            writingStyle: "Empathetic Consultant (Reassuring, Clear)",
            keywords: ["억울함", "복잡한 절차", "즉각 대응", "비밀 보장", "해결책"],
            instruction: "고객이 처한 '골치 아픈 상황'을 위로하고, 우리가 그것을 얼마나 깔끔하게 해결해줄 수 있는지 강조하세요. '당신의 편'이라는 느낌을 주세요.",
            moduleInstructions: {
                brand_story: "Focus on 'Why we fight for our clients'. Emphasize client protection.",
                core_service: "Focus on 'Pain Point -> Solution'. Explain how we handle the difficult parts for them.",
                customer_review: "Select review that mentions 'emotional relief' and 'peace of mind'.",
                faq: "Address fears about timeline and complexity."
            }
        },
        C: {
            label: "프리미엄 파트너십 (Partnership)",
            tone: "정중하고 비즈니스적인 (Polite, Business-formal)",
            writingStyle: "Business Strategist (Formal, Visionary)",
            keywords: ["성공 파트너", "지속 가능", "리스크 관리", "전담 팀", "맞춤 솔루션"],
            instruction: "단발성 서비스가 아닌, 고객의 사업 성공을 돕는 '분기별 파트너'로서의 가치를 제안하세요. 장기적인 이익과 리스크 관리를 강조하세요.",
            moduleInstructions: {
                brand_story: "Focus on 'Shared Success' and 'Long-term Vision'.",
                core_service: "Focus on 'ROI' and 'Risk Management'. Explain the business value.",
                customer_review: "Select review from a corporate client or long-term partner.",
                faq: "Address questions about ongoing support and dedicated teams."
            }
        }
    },
    "🏥 의료 및 웰니스": {
        A: {
            label: "임상 전문성 (Clinical Expertise)",
            tone: "학술적이고 신뢰감 있는 (Academic, Trustworthy)",
            writingStyle: "Medical Journal Editor (Academic, Precise)",
            keywords: ["대학병원 출신", "첨단 장비", "정밀 진단", "임상 연구", "표준 진료"],
            instruction: "의료진의 화려한 스펙과 병원의 첨단 시스템을 강조하세요. '나를 맡겨도 안전하다'는 확신을 주는 것이 목표입니다.",
            moduleInstructions: {
                brand_story: "Highlight the Doctor's academic background and research achievements.",
                core_service: "Explain the 'Medical Mechanism' (How it works physiologically). Use technical terms correctly.",
                customer_review: "Select review that mentions 'cured difficult symptoms'.",
                faq: "Address technical questions about side effects and recovery."
            }
        },
        B: {
            label: "환자 공감/케어 (Patient Care)",
            tone: "따뜻하고 다정한 (Warm, Gentle)",
            writingStyle: "Counselor (Gentle, Warm, Explanatory)",
            keywords: ["아프지 않은", "꼼꼼한 설명", "가족 같은", "무서움 해소", "회복"],
            instruction: "병원에 대한 두려움을 없애주세요. 통증 최소화 노력, 친절한 상담, 따뜻한 분위기를 묘사하여 방문 문턱을 낮추세요.",
            moduleInstructions: {
                brand_story: "Focus on the 'Patient-First' philosophy. 'We treat people, not diseases'.",
                core_service: "Explain the 'Care Process'. How we make it comfortable and painless.",
                customer_review: "Select review that mentions 'kindness' and 'no pain'.",
                faq: "Address anxiety about pain and procedure duration."
            }
        },
        C: {
            label: "프리미엄/심미 (Aesthetic)",
            tone: "세련되고 고급스러운 (Sophisticated, Premium)",
            writingStyle: "Lifestyle Magazine (Sophisticated, Alluring)",
            keywords: ["아름다움", "자신감 회복", "VIP 공간", "프라이빗", "예술적 감각"],
            instruction: "치료를 넘어 '아름다움'과 '삶의 질'을 파는 곳으로 포지셔닝하세요. 고급스러운 인테리어와 프라이빗한 서비스를 강조하세요.",
            moduleInstructions: {
                brand_story: "Focus on 'Art of Beauty'. The clinic as a gallery or lounge.",
                core_service: "Focus on 'Aesthetic Results' and 'Space Experience'.",
                customer_review: "Select review that mentions 'improved self-esteem' and 'beautiful facility'.",
                faq: "Address questions about privacy and VIP recovery rooms."
            }
        }
    },
    "🎓 교육 및 아카데미": {
        A: {
            label: "입시/결과 중심 (Result Oriented)",
            tone: "단호하고 자신감 넘치는 (Assertive, Confident)",
            writingStyle: "Headmaster (Assertive, confident, directive)",
            keywords: ["SKY 배출", "1등급", "최상위권", "합격 불변의 법칙", "독보적"],
            instruction: "학부모들이 가장 원하는 '성적 향상'과 '합격' 결과를 전면에 내세우세요. 우리의 커리큘럼이 왜 필승 전략인지 강하게 어필하세요.",
            moduleInstructions: {
                brand_story: "Focus on 'Track Record'. Number of admitted students.",
                core_service: "Explain the 'Winning Curriculum'. Strict management system.",
                customer_review: "Select review about 'grade improvement' and 'university acceptance'.",
                faq: "Address strict attendance rules and testing policies."
            }
        },
        B: {
            label: "관리/멘토링 (Care & Mentoring)",
            tone: "형/언니 같은, 격려하는 (Mentoring, Encouraging)",
            writingStyle: "Mentor (Encouraging, Supportive)",
            keywords: ["동기 부여", "공부 습관", "밀착 케어", "포기하지 않는", "꿈"],
            instruction: "성적보다 '아이의 변화'에 집중하세요. 꼼꼼한 관리 시스템과 정서적 지지를 통해 아이가 스스로 공부하게 만든다는 점을 강조하세요.",
            moduleInstructions: {
                brand_story: "Focus on 'Potential'. Every child can succeed with right guidance.",
                core_service: "Explain the 'Mentoring System'. 1:1 checkups, daily logs.",
                customer_review: "Select review about 'attitude change' and 'regaining confidence'.",
                faq: "Address concerns about child losing interest or getting tired."
            }
        },
        C: {
            label: "창의/미래 역량 (Future Skills)",
            tone: "혁신적이고 비전 제시적인 (Innovative, Visionary)",
            writingStyle: "Futurist (Inspiring, Visionary)",
            keywords: ["창의력", "사고력", "미래 인재", "글로벌 리더", "코딩/AI"],
            instruction: "단순 암기가 아닌 '생각하는 힘'을 기르는 교육임을 강조하세요. 4차 산업혁명 시대에 필요한 역량을 키워주는 선진적인 교육 기관임을 어필하세요.",
            moduleInstructions: {
                brand_story: "Focus on 'Future Skills'. Why traditional education is not enough.",
                core_service: "Explain the 'Project-Based Learning' method. Student-led classes.",
                customer_review: "Select review about 'fun learning' and 'creative output'.",
                faq: "Address questions about curriculum relevance to university."
            }
        }
    },
    "💎 프리미엄 라이프": {
        A: {
            label: "공간 미학/감성 (Aesthetic Space)",
            tone: "시적이고 우아한 (Poetic, Elegant)",
            writingStyle: "Art Curator (Poetic, Abstract, Elegant)",
            keywords: ["여백", "휴식", "오브제", "영감", "감각적인"],
            instruction: "공간의 분위기와 그곳에서 느낄 수 있는 감정을 묘사하세요. 마치 잡지 에디터가 쓴 글처럼 세련된 어휘를 사용하세요.",
            moduleInstructions: {
                brand_story: "Focus on 'Space Philosophy'. The architect's intent.",
                core_service: "Describe the 'Sensory Experience' (Sight, Smell, Touch).",
                customer_review: "Select review capturing the 'Atmosphere' and 'Vibe'.",
                faq: "Address questions about reservation and quiet zones."
            }
        },
        B: {
            label: "장인정신/퀄리티 (Craftsmanship)",
            tone: "진중하고 고집 있는 (Serious, Authentic)",
            writingStyle: "Master Craftsman (Serious, Authentic)",
            keywords: ["엄선된 재료", "오랜 시간", "직접 만든", "고유의 레시피", "정성"],
            instruction: "제품 하나하나에 들어간 정성과 타협하지 않는 품질 기준을 이야기하세요. '명품'을 소비한다는 자부심을 주어야 합니다.",
            moduleInstructions: {
                brand_story: "Focus on 'Obsession with Quality'. The maker's journey.",
                core_service: "Explain the 'Production Process'. Why it takes time.",
                customer_review: "Select review praising the 'Detail' and 'Quality'.",
                faq: "Address questions about sourcing and durability."
            }
        },
        C: {
            label: "하이엔드/익스클루시브 (Exclusive)",
            tone: "도도하고 특별한 (Haughty, Special)",
            writingStyle: "Private Club Concierge (Exclusive, Haughty)",
            keywords: ["소수 정예", "멤버십", "예약제", "프라이빗", "남다른 클래스"],
            instruction: "아무나 누릴 수 없는 특별함을 강조하세요. 선택된 소수만을 위한 프리미엄 서비스임을 은근히 과시하는 톤을 유지하세요.",
            moduleInstructions: {
                brand_story: "Focus on 'Exclusivity'. Not for everyone.",
                core_service: "Explain 'Privileges'. What members get that others don't.",
                customer_review: "Select review emphasizing 'Privacy' and 'Special Treatment'.",
                faq: "Address membership criteria and waiting lists."
            }
        }
    },
    "🏢 산업 및 B2B": {
        A: {
            label: "기술력/스펙 (Tech Specs)",
            tone: "건조하고 전문적인 (Dry, Technical)",
            writingStyle: "Engineer (Dry, Technical, Precise)",
            keywords: ["특허 보유", "정밀도", "내구성", "최신 공법", "국제 규격"],
            instruction: "감정을 배제하고 기술적 우위를 증명하세요. 구체적인 수치, 인증 현황, 특허 기술을 나열하여 엔지니어들에게 어필하세요.",
            moduleInstructions: {
                brand_story: "Focus on 'R&D capabilities' and 'History of Innovation'.",
                core_service: "List 'Technical Specifications' and 'Performance Metrics'.",
                customer_review: "Select review praising 'Reliability' and 'Uptime'.",
                faq: "Address technical support and warranty specs."
            }
        },
        B: {
            label: "비용/효율 (Efficiency)",
            tone: "실용적이고 합리적인 (Rational, Cost-focused)",
            writingStyle: "Procurement Officer (Rational, Cost-focused)",
            keywords: ["비용 절감", "생산성 향상", "ROI", "최적화", "유지보수"],
            instruction: "도입 시 얻을 수 있는 경제적 이익과 효율성을 강조하세요. ROI 계산이나 절감 효과를 구체적으로 제시하면 좋습니다.",
            moduleInstructions: {
                brand_story: "Focus on 'Operational Excellence' and 'Cost Leadership'.",
                core_service: "Explain 'Cost Benefit Analysis'. How it saves money.",
                customer_review: "Select review mentioning 'Cost Savings' and 'Speed'.",
                faq: "Address deployment time and ROI calculation."
            }
        },
        C: {
            label: "신뢰/파트너십 (Trust)",
            tone: "성실하고 책임감 있는 (Sincere, Responsible)",
            writingStyle: "Dedicated Manager (Sincere, Responsible)",
            keywords: ["책임 시공", "철저한 AS", "오랜 업력", "고객 약속", "무사고"],
            instruction: "끝까지 책임지는 자세를 강조하세요. 사후 관리와 신뢰도를 어필하세요.",
            moduleInstructions: {
                brand_story: "Focus on 'Integrity'. We stick to our promises.",
                core_service: "Explain 'Maintenance & Support'. We are always there.",
                customer_review: "Select review praising 'Responsiveness' and 'Consistency'.",
                faq: "Address emergency support and contract terms."
            }
        }
    },
    "🎗️ 공공 및 사회": {
        A: {
            label: "정책 홍보 (Policy Info)",
            tone: "명확하고 공익적인 (Clear, Public)",
            writingStyle: "Public Officer (Clear, Neutral, Informative)",
            keywords: ["지원 혜택", "신청 방법", "대상자", "접수 기간", "공공성"],
            instruction: "정책의 혜택과 신청 방법을 빠짐없이 정확하게 전달하세요.",
            moduleInstructions: {
                brand_story: "Focus on 'Public Welfare'. Why this policy exists.",
                core_service: "Detail 'Eligibility' and 'Application Process'. Step by step.",
                customer_review: "Use 'Case Examples' instead of reviews.",
                faq: "Address common disqualification reasons."
            }
        },
        B: {
            label: "참여 유도 (Participation)",
            tone: "호소력 있고 활기찬 (Appealing, Energetic)",
            writingStyle: "Campaign Manager (Encouraging, Energetic)",
            keywords: ["함께해요", "우리 동네", "변화", "참여", "주인공"],
            instruction: "시민들의 자발적인 참여를 독려하고, 함께 만드는 변화를 강조하세요.",
            moduleInstructions: {
                brand_story: "Focus on 'Community Spirit'. We do this together.",
                core_service: "Explain 'How to Participate'. Easy steps.",
                customer_review: "Show 'Participant Testimonials'.",
                faq: "Address questions about time commitment and rewards."
            }
        },
        C: {
            label: "성과 보고 (Report)",
            tone: "객관적이고 투명한 (Objective, Transparent)",
            writingStyle: "Auditor (Objective, Data-driven)",
            keywords: ["달성률", "예산 집행", "개선 결과", "투명성", "약속 이행"],
            instruction: "그동안의 성과와 변화를 수치와 팩트 중심으로 보고하세요.",
            moduleInstructions: {
                brand_story: "Focus on 'Accountability'. We delivered results.",
                core_service: "List 'Key Achievements' and 'Statistics'.",
                customer_review: "Show 'Before & After' statistics.",
                faq: "Address future plans and budget usage."
            }
        }
    }
};

export function getStrategyForCategory(industry: string): LeafletStrategy {
    const cluster = Object.entries(leafletIndustryClusters).find(([_, industries]) =>
        (industries as readonly string[]).includes(industry)
    )?.[0] as LeafletCluster;

    return LEAFLET_STRATEGIES[cluster] || LEAFLET_STRATEGIES["🏛️ 전문 서비스"]; // Default fallback
}
