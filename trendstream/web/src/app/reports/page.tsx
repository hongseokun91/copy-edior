import { fetchReports } from "@/lib/enterprise/reports";
import { CreateReportButton } from "./create-button"; // Separate component for interactivity
import { FileText, Download, Calendar } from "lucide-react";

export default async function ReportsPage() {
    const reports = await fetchReports();

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Executive Reports</h2>
                    <p className="text-slate-400 mt-1">
                        Generate and export strategy insights for leadership.
                    </p>
                </div>
                <CreateReportButton />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                    <div key={report.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 group hover:border-indigo-500/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-800 rounded-lg text-slate-300 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                                <FileText className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-mono text-slate-500">{report.type}</span>
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                            {report.title}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                            <Calendar className="w-4 h-4" />
                            {report.dateRange}
                        </div>

                        <a
                            href={`/api/reports/${report.id}/pptx`}
                            className="w-full flex items-center justify-center gap-2 py-2 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download PPTX
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
