import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function StudioHome() {
    const presetCategories = [
        { label: "식당/카페", value: "restaurant" },
        { label: "학원/교육", value: "education" },
        { label: "뷰티/헬스", value: "beauty" },
        { label: "부동산/영업", value: "realestate" },
        { label: "쇼핑몰/마켓", value: "shopping" },
        { label: "행사/이벤트", value: "event" },
    ];

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-slate-50">
            <div className="max-w-md w-full space-y-8">
                <div className="space-y-4">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl whitespace-pre-line">
                        전단지부터 리플렛까지,{"\n"}규격에 딱 맞는 카피{"\n"}바로 완성
                    </h1>
                    <p className="text-lg text-slate-600">
                        고민하지 마세요. 업종과 목적만 고르면{"\n"}
                        디자이너가 좋아하는 깔끔한 문구가 완성됩니다.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    {presetCategories.map((cat) => (
                        <Link key={cat.value} href={`/make?category=${cat.value}`}>
                            <Badge variant="secondary" className="px-3 py-1.5 text-sm cursor-pointer hover:bg-slate-200 transition-colors">
                                {cat.label}
                            </Badge>
                        </Link>
                    ))}
                </div>

                <Link href="/make">
                    <Button size="lg" className="w-full text-lg h-14 font-bold shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 border-none text-white">
                        무료 카피 만들기
                    </Button>
                </Link>



                <div className="pt-8">
                    <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 underline underline-offset-4">
                        ← 통합 대시보드로 돌아가기
                    </Link>
                </div>
            </div>
        </main>
    );
}
