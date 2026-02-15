"use client";

import { useState } from "react";
import { createReportAction } from "@/actions/reports";
import { Loader2, Plus } from "lucide-react";

export function CreateReportButton() {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("type", "weekly_trend");
        await createReportAction(formData);
        setLoading(false);
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Generate New Report
        </button>
    );
}
