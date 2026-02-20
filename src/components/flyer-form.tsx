"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { predefinedGoals, predefinedIndustries, predefinedContactTypes, flyerFormSchema } from "@/lib/schemas";
// import { predefinedContactTypes } from "@/lib/flyer-constants";
import { FlyerType } from "@/types/flyer";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { InlineError } from "@/components/inline-error";
import {
    Loader2, // Sparkles, MapPin, Store, Calendar, Phone, Globe, Instagram, FileText, User, ShoppingBag, Hash, Target, CheckCircle2, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { normalizeInput, checkFactCompleteness, MissingFact } from "@/lib/facts";
import { ClarificationModal } from "@/components/clarification-modal";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getOfferPlaceholder(productType: string) {
    // This function is new and currently empty, but added as per instruction.
    // Its content might be added in a subsequent change.
    return "";
}

interface FlyerFormProps {
    defaultCategory?: string;
    productType?: FlyerType;
    onSubmit?: (values: z.infer<typeof flyerFormSchema>) => void;
    isLoading?: boolean;
    onCategoryChange?: (category: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OFFER_RECOMMENDATIONS: Record<string, string[]> = {
    "식당/카페": ["아메리카노 1+1", "전 메뉴 10% 할인", "리뷰 작성 시 음료 증정"],
    "학원/교육": ["첫 달 수강료 50%", "무료 체험 수업", "친구 소개 시 상품권"],
    "뷰티/헬스": ["첫 방문 30% 할인", "1회 무료 체험", "회원권 추가 적립"],
    "부동산": ["무료 상담", "중개수수료 할인", "매물 접수 시 사은품"],
    "소매/매장": ["전 상품 무료배송", "첫 구매 3천원 쿠폰", "3만원 이상 사은품"],
    "기타": ["사은품 증정", "기간 한정 세일", "무료 배송"]
};

export function FlyerForm({
    defaultCategory,
    productType = 'flyer',
    onSubmit,
    isLoading = false,
    onCategoryChange
}: FlyerFormProps) {
    const form = useForm<z.infer<typeof flyerFormSchema>>({
        resolver: zodResolver(flyerFormSchema),
        defaultValues: {
            category: defaultCategory || "",
            goal: "오픈",
            name: "",
            offer: "",
            period: "",
            contactType: "phone",
            contactValue: "",
            additionalBrief: "",
        },
        mode: "onChange",
    });

    const watchCategory = useWatch({
        control: form.control,
        name: "category",
    });

    useEffect(() => {
        if (onCategoryChange && watchCategory) {
            onCategoryChange(watchCategory);
        }
    }, [watchCategory, onCategoryChange]);

    const watchContactType = useWatch({
        control: form.control,
        name: "contactType",
    });
    useEffect(() => {
        form.setValue("contactValue", "");
    }, [watchContactType, form]);

    const [showModal, setShowModal] = useState(false);
    const [missingFacts, setMissingFacts] = useState<MissingFact[]>([]);

    function handleSubmit(values: z.infer<typeof flyerFormSchema>) {
        const brief = normalizeInput(values);
        const missing = checkFactCompleteness(brief);

        if (missing.length > 0) {
            setMissingFacts(missing);
            setShowModal(true);
            return;
        }

        if (onSubmit) {
            onSubmit(values);
        }
    }

    const handleClarificationConfirm = (answers: Record<string, string>) => {
        const currentBrief = form.getValues("additionalBrief") || "";
        const newFacts = Object.entries(answers)
            .map(([key, val]) => {
                const factLabel = missingFacts.find(m => m.id === key)?.label || key;
                return `[정보확인] ${factLabel}: ${val}`;
            })
            .join("\n");

        if (newFacts.trim().length > 0) {
            const updatedBrief = currentBrief ? `${currentBrief}\n${newFacts}` : newFacts;
            form.setValue("additionalBrief", updatedBrief, { shouldDirty: true });
        }

        setShowModal(false);
        const updatedValues = form.getValues();
        if (onSubmit) onSubmit(updatedValues);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                        e.preventDefault();
                    }
                }}
            >
                {/* 1. Category */}
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-bold text-slate-700">업종군 (분야 선택)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                    <SelectTrigger className="bg-white border-slate-200 text-slate-900 h-11">
                                        <SelectValue placeholder="업종을 선택해 주세요." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="glass-card text-slate-900 border-slate-100">
                                    {predefinedIndustries.map(cat => (
                                        <SelectItem key={cat} value={cat} className="focus:bg-purple-100 focus:text-purple-900 cursor-pointer text-sm">{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* 2. Strategic Goal Selection */}
                <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-bold text-slate-700">기획 목표</FormLabel>
                            <div className="flex flex-wrap gap-2">
                                {predefinedGoals.map((goal) => (
                                    <Badge
                                        key={goal}
                                        variant={field.value === goal ? "default" : "outline"}
                                        className={cn(
                                            "cursor-pointer px-4 py-2 text-[11px] font-bold transition-all rounded-lg",
                                            field.value === goal
                                                ? "bg-purple-600 border-purple-600 text-white shadow-md scale-[1.03]"
                                                : "bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:bg-purple-50"
                                        )}
                                        onClick={() => field.onChange(goal)}
                                    >
                                        {goal}
                                    </Badge>
                                ))}
                            </div>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                {/* 3. Name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-bold text-slate-700">상호명 (가게 이름)</FormLabel>
                            <FormControl>
                                <Input placeholder="예: 라이트빈" {...field} className="bg-white border-slate-200 text-slate-900 h-11 placeholder:text-slate-300" />
                            </FormControl>
                            <InlineError message={form.formState.errors.name?.message} />
                        </FormItem>
                    )}
                />

                {/* 4. Offer */}
                <FormField
                    control={form.control}
                    name="offer"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-bold text-slate-700">가장 강조할 혜택/오퍼</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="예: 첫 방문 50% 할인"
                                    {...field}
                                    className="bg-white border-slate-200 text-slate-900 h-11 placeholder:text-slate-300"
                                />
                            </FormControl>
                            <FormDescription className="text-xs text-slate-400">
                                고객의 눈길을 확 끌 수 있는 가장 큰 혜택을 입력해주세요.
                            </FormDescription>
                            <InlineError message={form.formState.errors.offer?.message} />
                        </FormItem>
                    )}
                />

                {/* 5. Period */}
                <FormField
                    control={form.control}
                    name="period"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-bold text-slate-700">언제까지 진행하나요?</FormLabel>
                            <FormControl>
                                <Input placeholder="예: 5/1 ~ 5/31" {...field} className="bg-white border-slate-200 text-slate-900 h-11 placeholder:text-slate-300" />
                            </FormControl>
                            <InlineError message={form.formState.errors.period?.message} />
                        </FormItem>
                    )}
                />

                {/* 6. Contact Us */}
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-4">
                    <FormLabel className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        📞 문의처 정보
                    </FormLabel>
                    <FormField
                        control={form.control}
                        name="contactType"
                        render={({ field }) => (
                            <FormItem className="space-y-4">
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-4"
                                    >
                                        <div className="flex items-center space-x-3 text-slate-800">
                                            <RadioGroupItem value="phone" id="f-phone" className="border-purple-600 text-purple-600" />
                                            <label htmlFor="f-phone" className="text-[11px] font-bold text-slate-500 leading-none">전화번호</label>
                                        </div>
                                        {field.value === 'phone' && (
                                            <FormField
                                                control={form.control}
                                                name="contactValue"
                                                render={({ field: subField }) => (
                                                    <div className="ml-8">
                                                        <Input placeholder="010-0000-0000" {...subField} className="bg-white border-slate-200 text-slate-900 h-11 text-sm placeholder:text-slate-300" />
                                                    </div>
                                                )}
                                            />
                                        )}
                                        <div className="flex items-center space-x-3 text-slate-800">
                                            <RadioGroupItem value="kakao" id="f-kakao" className="border-purple-600 text-purple-600" />
                                            <label htmlFor="f-kakao" className="text-[11px] font-bold text-slate-500 leading-none">카카오톡 ID/채널</label>
                                        </div>
                                        {field.value === 'kakao' && (
                                            <FormField
                                                control={form.control}
                                                name="contactValue"
                                                render={({ field: subField }) => (
                                                    <div className="ml-8">
                                                        <Input placeholder="카카오톡 ID 또는 채널 링크" {...subField} className="bg-white border-slate-200 text-slate-900 h-11 text-sm placeholder:text-slate-300" />
                                                    </div>
                                                )}
                                            />
                                        )}
                                    </RadioGroup>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* Detailed Brief */}
                <div className="border border-slate-100 bg-slate-50 p-5 rounded-2xl">
                    <FormLabel className="text-sm font-bold text-slate-700">상세 요청사항 (선택)</FormLabel>
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed mt-1">
                        &quot;중학생만 모집&quot;, &quot;주차장 완비 강조&quot; 처럼<br />
                        꼭 포함되어야 할 내용을 적어주세요.
                    </p>
                    <FormField
                        control={form.control}
                        name="additionalBrief"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <textarea
                                        className="flex min-h-[100px] w-full rounded-xl border border-purple-100 bg-purple-50/30 px-4 py-3 text-sm text-purple-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 placeholder:text-purple-200 resize-none shadow-inner"
                                        placeholder="여기에 적으신 내용은 AI가 최우선으로 반영합니다."
                                        {...field}
                                    />
                                </FormControl>
                                <InlineError message={form.formState.errors.additionalBrief?.message} />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Reference URL (Visual Scraping) */}
                <FormField
                    control={form.control}
                    name="referenceUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-bold text-slate-700">참고할 URL (선택)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="https://example.com (AI가 디자인/내용을 참고합니다)"
                                    {...field}
                                    className="bg-white border-slate-200 text-slate-900 h-11 placeholder:text-slate-300"
                                />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-lg font-black shadow-[0_5px_20px_rgba(147,51,234,0.3)] transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-none"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            <span>AI가 문구를 작성 중입니다...</span>
                        </>
                    ) : (
                        "문구 만들기 (AI)"
                    )}
                </Button>
            </form>

            <ClarificationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                missingFacts={missingFacts}
                onConfirm={handleClarificationConfirm}
                isLoading={isLoading}
            />
        </Form >
    );
}
