"use server";

import { checkDraft } from "@/lib/intelligence/preflight";
import { checkCompliance } from "@/lib/enterprise/compliance";

export async function preflightAction(currentState: any, formData: FormData) {
    const script = formData.get("script") as string;
    if (!script) return { success: false, message: "Script required" };

    await new Promise(r => setTimeout(r, 800)); // Delay

    // 1. Compliance Check
    const compliance = await checkCompliance(script);

    // If blocked, stop there
    if (compliance.status === 'fail') {
        return { success: false, compliance };
    }

    // 2. Intelligence Check (only if passed/warn)
    const result = await checkDraft(script);

    return { success: true, result, compliance };
}
