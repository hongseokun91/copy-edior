"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center space-y-6">
            <div className="bg-white p-4 rounded-full shadow-sm mb-2">
                <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">오류가 발생했습니다</h2>
                <p className="text-slate-500">
                    일시적인 문제일 수 있습니다. 다시 시도해 주세요.
                </p>
            </div>
            <div className="flex gap-4">
                <Button onClick={() => reset()} variant="outline" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    다시 시도
                </Button>
                <Button onClick={() => window.location.href = "/"} variant="ghost">
                    홈으로 이동
                </Button>
            </div>
        </div>
    );
}
