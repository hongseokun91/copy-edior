"use server";

import { generateReport } from "@/lib/enterprise/reports";
import { revalidatePath } from "next/cache";

export async function createReportAction(formData: FormData) {
    const type = formData.get("type") as string || "weekly_trend";
    await generateReport(type);
    revalidatePath('/reports');
    return { success: true };
}
