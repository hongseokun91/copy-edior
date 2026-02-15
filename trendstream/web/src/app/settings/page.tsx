
import { fetchAuditLogs } from "@/lib/enterprise/audit";
import { Shield, Users, Lock, Activity } from "lucide-react";

export default async function SettingsPage() {
    const logs = await fetchAuditLogs();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Enterprise Settings</h2>
                <p className="text-slate-400 mt-1">
                    Manage security, access control, and audit trails.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SSO Configuration */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Single Sign-On (SSO)</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-6">
                        Configure SAML or OIDC providers for your tenant. Currently using local authentication.
                    </p>
                    <button className="w-full py-2 bg-slate-800 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed border border-slate-700">
                        Configure Provider (Enterprise Plan)
                    </button>
                </div>

                {/* Role Management */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg">
                            <Users className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Role Management</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-6">
                        Manage granular permissions and access scopes for team members.
                    </p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm p-2 bg-slate-950 rounded">
                            <span className="text-slate-200">Admin</span>
                            <span className="text-slate-500">Full Access</span>
                        </div>
                        <div className="flex justify-between text-sm p-2 bg-slate-950 rounded">
                            <span className="text-slate-200">Analyst</span>
                            <span className="text-slate-500">Read-only</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                        <Activity className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Notifications</h3>
                </div>
                <p className="text-sm text-slate-400 mb-6">
                    Configure alerts for viral spikes and compliance violations.
                </p>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-300 text-sm">Email Alerts</span>
                        <div className="w-10 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-300 text-sm">Slack Webhook</span>
                        <div className="w-10 h-6 bg-slate-700 rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Audit Log */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-semibold text-white">Audit Log</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-950 text-slate-400 font-medium sticky top-0">
                            <tr>
                                <th className="px-6 py-3">Timestamp</th>
                                <th className="px-6 py-3">Actor</th>
                                <th className="px-6 py-3">Action</th>
                                <th className="px-6 py-3">Resource</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-3 text-slate-500 font-mono text-xs">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-3 text-slate-300">{log.actor}</td>
                                    <td className="px-6 py-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-200">
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-slate-400 font-mono text-xs">{log.resource}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
