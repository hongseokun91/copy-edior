"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { flyerFormSchema, predefinedGoals } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
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
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlyerFormProps {
    defaultCategory?: string;
    onSubmit?: (values: z.infer<typeof flyerFormSchema>) => void;
    isLoading?: boolean;
    onCategoryChange?: (category: string) => void;
}

const CATEGORIES = [
    "식당/카페",
    "학원/교육",
    "뷰티/헬스",
    "부동산/영업",
    "쇼핑몰/마켓",
    "행사/이벤트",
    "기업/관공서",
    "기타"
];

const OFFER_RECOMMENDATIONS: Record<string, string[]> = {
    "식당/카페": ["아메리카노 1+1", "전 메뉴 10% 할인", "리뷰 작성 시 음료 증정"],
    "학원/교육": ["첫 달 수강료 50%", "무료 체험 수업", "친구 소개 시 상품권"],
    "뷰티/헬스": ["첫 방문 30% 할인", "1회 무료 체험", "회원권 추가 적립"],
    "부동산/영업": ["무료 상담", "중개수수료 할인", "매물 접수 시 사은품"],
    "쇼핑몰/마켓": ["전 상품 무료배송", "첫 구매 3천원 쿠폰", "3만원 이상 사은품"],
    "행사/이벤트": ["선착순 입장", "사전 예약 할인", "참가자 전원 기념품"],
    "기업/관공서": ["무료 견적 상담", "제휴 업체 할인", "설문 참여 시 기프티콘"],
    "기타": ["사은품 증정", "기간 한정 세일", "무료 배송"]
};

export function FlyerForm({ defaultCategory, onSubmit, isLoading = false, onCategoryChange }: FlyerFormProps) {
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
        },
        mode: "onChange",
    });

    const watchCategory = form.watch("category");

    useEffect(() => {
        if (onCategoryChange && watchCategory) {
            onCategoryChange(watchCategory);
        }
    }, [watchCategory, onCategoryChange]);

    function handleSubmit(values: z.infer<typeof flyerFormSchema>) {
        if (onSubmit) {
            onSubmit(values);
        }
    }

    const recommendations = OFFER_RECOMMENDATIONS[watchCategory] || OFFER_RECOMMENDATIONS["기타"];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

                {/* 1. Category */}
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-bold">어떤 업종인가요?</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="업종 선택 (예: 식당/카페)" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {/* Category Chips - Quick Select */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {["식당/카페", "학원/교육", "뷰티/헬스"].map(chip => (
                                    <Badge
                                        key={chip}
                                        variant={field.value === chip ? "default" : "outline"}
                                        className="cursor-pointer font-normal"
                                        onClick={() => field.onChange(chip)}
                                    >
                                        {chip}
                                    </Badge>
                                ))}
                            </div>
                            <InlineError message={form.formState.errors.category?.message} />
                        </FormItem>
                    )}
                />

                {/* 2. Goal */}
                <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-bold">홍보 목적이 무엇인가요?</FormLabel>
                            <div className="flex flex-wrap gap-2">
                                {predefinedGoals.map((goal) => (
                                    <div key={goal}
                                        className={cn(
                                            "px-3 py-2 rounded-full border text-sm cursor-pointer transition-all select-none",
                                            field.value === goal
                                                ? "bg-slate-900 text-white border-slate-900 font-medium"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                        )}
                                        onClick={() => field.onChange(goal)}
                                    >
                                        {goal}
                                    </div>
                                ))}
                            </div>
                            <InlineError message={form.formState.errors.goal?.message} />
                        </FormItem>
                    )}
                />

                {/* 3. Name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-bold">상호명 (가게 이름)</FormLabel>
                            <FormControl>
                                <Input placeholder="예: 라이트빈" {...field} />
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
                            <FormLabel className="text-base font-bold">가장 강조할 혜택/오퍼</FormLabel>
                            <FormControl>
                                <Input placeholder="예: 아메리카노 1+1 (4~40자)" {...field} />
                            </FormControl>
                            {/* Offer Recommendations */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {recommendations.map((rec) => (
                                    <Badge
                                        key={rec}
                                        variant="secondary"
                                        className="cursor-pointer font-normal bg-blue-50 text-blue-700 hover:bg-blue-100 border-transparent"
                                        onClick={() => field.onChange(rec)}
                                    >
                                        {rec}
                                    </Badge>
                                ))}
                            </div>
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
                            <FormLabel className="text-base font-bold">언제까지 진행하나요?</FormLabel>
                            <div className="flex gap-2">
                                <FormControl>
                                    <Input placeholder="예: 2/1 ~ 2/14" {...field} />
                                </FormControl>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {["이번주", "이번달", "2주간", "소진 시까지"].map(chip => (
                                    <Badge
                                        key={chip}
                                        variant="outline"
                                        className="cursor-pointer font-normal bg-slate-50"
                                        onClick={() => field.onChange(chip)}
                                    >
                                        {chip}
                                    </Badge>
                                ))}
                            </div>
                            <InlineError message={form.formState.errors.period?.message} />
                        </FormItem>
                    )}
                />

                {/* 6. Contact */}
                <FormField
                    control={form.control}
                    name="contactType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-bold">문의 채널</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-3"
                                >
                                    {/* Phone */}
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="phone" id="r-phone" />
                                        <label htmlFor="r-phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            전화번호
                                        </label>
                                    </div>
                                    {/* Input for Phone */}
                                    {field.value === 'phone' && (
                                        <FormField
                                            control={form.control}
                                            name="contactValue"
                                            render={({ field: subField }) => (
                                                <div className="ml-6">
                                                    <Input placeholder="010-0000-0000" {...subField} />
                                                    <InlineError message={form.formState.errors.contactValue?.message} />
                                                </div>
                                            )}
                                        />
                                    )}

                                    {/* Kakao */}
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="kakao" id="r-kakao" />
                                        <label htmlFor="r-kakao" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            카카오톡 ID/채널
                                        </label>
                                    </div>
                                    {/* Input for Kakao */}
                                    {field.value === 'kakao' && (
                                        <FormField
                                            control={form.control}
                                            name="contactValue"
                                            render={({ field: subField }) => (
                                                <div className="ml-6">
                                                    <Input placeholder="@아이디" {...subField} />
                                                    <InlineError message={form.formState.errors.contactValue?.message} />
                                                </div>
                                            )}
                                        />
                                    )}

                                    {/* Naver */}
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="naver" id="r-naver" />
                                        <label htmlFor="r-naver" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            네이버 예약/지도
                                        </label>
                                    </div>
                                    {/* Input for Naver */}
                                    {field.value === 'naver' && (
                                        <FormField
                                            control={form.control}
                                            name="contactValue"
                                            render={({ field: subField }) => (
                                                <div className="ml-6">
                                                    <Input placeholder="naver.me/..." {...subField} />
                                                    <InlineError message={form.formState.errors.contactValue?.message} />
                                                </div>
                                            )}
                                        />
                                    )}

                                </RadioGroup>
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-lg font-bold shadow-md"
                    disabled={!form.formState.isValid || isLoading}
                >
                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    문구 만들기
                </Button>
            </form>
        </Form>
    );
}
