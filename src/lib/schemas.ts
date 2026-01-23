import { z } from "zod";

export const predefinedGoals = [
    "오픈",
    "할인",
    "모집",
    "예약유도",
    "신메뉴",
    "시즌이벤트",
] as const;

export const predefinedContactTypes = ["phone", "kakao", "naver"] as const;

export const flyerFormSchema = z.object({
    category: z.string().min(1, { message: "업종을 선택해 주세요." }),
    goal: z.string().min(1, { message: "목적을 선택해 주세요." }),
    name: z
        .string()
        .min(2, { message: "상호명은 2자 이상 입력해 주세요." })
        .max(20, { message: "상호명은 20자 이내로 입력해 주세요." })
        .regex(/^[a-zA-Z0-9가-힣\s\.]+$/, {
            message: "특수문자는 제외하고 입력해 주세요.",
        }),
    offer: z
        .string()
        .min(4, { message: "혜택/오퍼를 4자 이상 입력해 주세요." })
        .max(40, { message: "혜택/오퍼는 40자 이내로 입력해 주세요." }),
    period: z.string().min(1, { message: "기간을 입력해 주세요. (예: 2/1~2/14)" }),
    contactType: z.enum(predefinedContactTypes),
    contactValue: z
        .string()
        .min(1, { message: "문의처 값을 입력해 주세요." }),
    // Optional fields
    location: z.string().optional(),
    hours: z.string().optional(),
    usp: z.string().optional(),
    target: z.string().optional(),
    convenience: z.string().optional(),
    disclaimerHint: z.string().optional(),
});

export type FlyerFormValues = z.infer<typeof flyerFormSchema>;
