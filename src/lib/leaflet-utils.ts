
export const getPanels = (type: string, surface: "OUTSIDE" | "INSIDE"): { id: string; label: string; subLabel: string }[] => {
    if (type === "2단") {
        if (surface === "OUTSIDE") return [
            { id: "P4", label: "뒷표지", subLabel: "정보/문의" },
            { id: "P1", label: "앞표지", subLabel: "메인 타이틀" }
        ];
        return [
            { id: "P2", label: "내지 좌측", subLabel: "도입/핵심" },
            { id: "P3", label: "내지 우측", subLabel: "상세/전개" }
        ];
    }
    if (type === "4단" || type === "N_FOLD") {
        if (surface === "OUTSIDE") return [
            { id: "P2", label: "도입부 1", subLabel: "스토리 시작" },
            { id: "P3", label: "도입부 2", subLabel: "스토리 전개" },
            { id: "P8", label: "뒷표지", subLabel: "정보/문의" },
            { id: "P1", label: "앞표지", subLabel: "메인 타이틀" }
        ];
        return [
            { id: "P4", label: "내지 1", subLabel: "세부 내용" },
            { id: "P5", label: "내지 2", subLabel: "세부 내용" },
            { id: "P6", label: "내지 3", subLabel: "세부 내용" },
            { id: "P7", label: "내지 4", subLabel: "세부 내용" }
        ];
    }
    if (type === "GATE_FOLD") {
        if (surface === "OUTSIDE") return [
            { id: "P2", label: "좌측 날개", subLabel: "호기심 유발" },
            { id: "P6", label: "뒷표지", subLabel: "정보/문의" },
            { id: "P1", label: "우측 날개", subLabel: "메인 타이틀" }
        ];
        return [
            { id: "P3", label: "내지 좌측", subLabel: "전개 1" },
            { id: "P4", label: "내지 중앙", subLabel: "전개 2" },
            { id: "P5", label: "내지 우측", subLabel: "전개 3" }
        ];
    }
    // Default: 3-Fold
    if (surface === "OUTSIDE") return [
        { id: "P2", label: "날개", subLabel: "도입/후킹" },
        { id: "P6", label: "뒷표지", subLabel: "정보/문의" },
        { id: "P1", label: "앞표지", subLabel: "메인 타이틀" }
    ];
    return [
        { id: "P3", label: "내지 좌측", subLabel: "전개 1" },
        { id: "P4", label: "내지 중앙", subLabel: "전개 2" },
        { id: "P5", label: "내지 우측", subLabel: "전개 3" }
    ];
};
