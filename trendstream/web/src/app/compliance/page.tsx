
import { ShieldAlert, CheckCircle, AlertTriangle, Lock } from "lucide-react";

// Mock Data (matches logic in compliance.ts)
const RULES = [
    {
        id: 'rule-med-01',
        name: 'No Absolute Medical Claims',
        severity: 'block',
        category: 'medical',
        pattern: 'Regex: (cure|guaranteed result...)',
        status: 'active'
    },
    {
        id: 'rule-fin-02',
        name: 'Financial Promise Constraint',
        severity: 'warning',
        category: 'finance',
        pattern: 'Keywords: "passive income", "get rich"',
        status: 'active'
    },
    {
        id: 'rule-copy-03',
        name: 'Copyright Check',
        severity: 'block',
        category: 'copyright',
        pattern: 'Fingerprint Match > 80%',
        status: 'active'
    }
];

export default function CompliancePage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Compliance Rules</h2>
                    <p className="text-slate-400 mt-1">
                        Manage automated safety gates and content constraints.
                    </p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    + Add Rule
                </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950 text-slate-400 font-medium">
                        <tr>
                            <th className="px-6 py-4">Rule Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Severity</th>
                            <th className="px-6 py-4">Pattern</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {RULES.map((rule) => (
                            <tr key={rule.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-200">{rule.name}</td>
                                <td className="px-6 py-4 text-slate-400 capitalize">{rule.category}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${rule.severity === 'block'
                                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                        {rule.severity === 'block' ? <Lock className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                        {rule.severity.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{rule.pattern}</td>
                                <td className="px-6 py-4 text-emerald-400 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Active
                                </td>
                                <td className="px-6 py-4 text-right text-slate-500 hover:text-white cursor-pointer">
                                    Edit
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
