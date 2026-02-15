"use client";

import { useState } from "react";
import { ingestUrl } from "@/actions/ingest";
import { Loader2, Plus } from "lucide-react";

export function IngestInput() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setResult(null);
        try {
            const res = await ingestUrl(formData);
            setResult(res);
        } catch (e) {
            setResult({ success: false, message: "Failed to ingest" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form action={handleSubmit} className="flex gap-2">
                <input
                    name="url"
                    type="url"
                    placeholder="Paste YouTube, TikTok, or Instagram URL..."
                    required
                    className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    Analyze
                </button>
            </form>

            {result && (
                <div className={`mt-3 text-sm ${result.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {result.message}
                </div>
            )}
        </div>
    );
}
