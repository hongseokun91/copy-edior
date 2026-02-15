export const LEAFLET_MODULE_CATEGORIES = ["브랜드소개", "서비스안내", "신뢰/입증", "이용가이드", "문의/기타"] as const;
export type LeafletModuleCategory = (typeof LEAFLET_MODULE_CATEGORIES)[number];

export interface LeafletModuleDef {
    id: string;
    label: string;
    description: string;
    category: '브랜드소개' | '서비스안내' | '신뢰/입증' | '이용가이드' | '문의/기타';
    icon: string;
}

export const LEAFLET_MODULES: LeafletModuleDef[] = [
    // Category: 브랜드소개
    { id: 'ceo_message', label: 'CEO 메시지', description: '대표자의 경영철학 및 CEO 인사', category: '브랜드소개', icon: '👤' },
    { id: 'brand_story', label: '브랜드 스토리', description: '브랜드 탄생 배경 및 성장 과정', category: '브랜드소개', icon: '📖' },
    { id: 'vision_mission', label: '비전&미션', description: '추구하는 핵심 가치와 미래 목표', category: '브랜드소개', icon: '🚀' },
    { id: 'history', label: '연혁', description: '전통과 지속 가능성을 보여주는 주요 성과', category: '브랜드소개', icon: '⏳' },
    { id: 'team_profile', label: '전문가 프로필', description: '팀원들의 전문성 및 약력 소개', category: '브랜드소개', icon: '🎓' },

    // Category: 서비스안내
    { id: 'core_service', label: '핵심 서비스', description: '가장 자신 있는 서비스의 상세 설명', category: '서비스안내', icon: '💎' },
    { id: 'product_catalog', label: '제품사양', description: '전체 제품 리스트 및 사양 안내', category: '서비스안내', icon: '🛍️' },
    { id: 'pricing_table', label: '가격정책', description: '투명한 가격 체계 및 옵션 설명', category: '서비스안내', icon: '💳' },
    { id: 'usp_highlight', label: '특장점', description: '타사와 차별화되는 단 하나의 강점', category: '서비스안내', icon: '🔥' },

    // Category: 신뢰/입증
    { id: 'customer_review', label: '고객후기', description: '실제 이용 고객의 만족도 및 평가', category: '신뢰/입증', icon: '⭐' },
    { id: 'before_after', label: '비포&애프터', description: '시술/서비스 전후의 확실한 변화', category: '신뢰/입증', icon: '🔄' },
    { id: 'awards_certs', label: '수상&인증', description: '대외적인 공신력 입증 자료', category: '신뢰/입증', icon: '🏆' },
    { id: 'partnerships', label: '주요 협력사', description: '함께하는 든든한 파트너사 로고', category: '신뢰/입증', icon: '🤝' },
    { id: 'media_report', label: '언론보도', description: '미디어에 소개된 브랜드 가치', category: '신뢰/입증', icon: '📺' },

    // Category: 이용가이드
    { id: 'faq', label: 'Q&A', description: '고객의 궁금증을 미리 해결', category: '이용가이드', icon: '💡' },
    { id: 'service_process', label: '이용방법', description: '상담부터 완료까지의 단계별 과정', category: '이용가이드', icon: '🛤️' },
    { id: 'membership', label: '멤버십 혜택', description: '단골 고객을 위한 특별 제도', category: '이용가이드', icon: '🏅' },
    { id: 'quality_guarantee', label: '품질보증', description: '신뢰를 더하는 AS 및 책임 정책', category: '이용가이드', icon: '🛡️' },

    // Category: 문의/기타
    { id: 'detailed_map', label: '오시는길', description: '주차 팁 등 유용한 방문 정보', category: '문의/기타', icon: '📍' },
    { id: 'contact_channels', label: '통합문의', description: '상담 가능한 모든 채널 안내', category: '문의/기타', icon: '📞' },
    { id: 'action_coupon', label: '할인쿠폰', description: '즉각적인 방문을 유도하는 쿠폰', category: '문의/기타', icon: '✂️' },
];
