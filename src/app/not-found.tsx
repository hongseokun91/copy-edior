import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center space-y-6">
            <div className="bg-white p-4 rounded-full shadow-sm mb-2">
                <FileQuestion className="w-12 h-12 text-slate-400" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">페이지를 찾을 수 없어요</h2>
                <p className="text-slate-500">
                    요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
                </p>
            </div>
            <Link href="/">
                <Button className="gap-2">
                    홈으로 돌아가기
                </Button>
            </Link>
        </div>
    );
}
