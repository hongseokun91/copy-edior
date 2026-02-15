"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    BarChart2,
    Library,
    Settings,
    Search,
    Zap,
    LayoutDashboard,
    ShieldCheck,
    FileText
} from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Trends', href: '/trends', icon: BarChart2 },
    { label: 'Intelligence', href: '/intelligence', icon: Zap },
    { label: 'Library', href: '/library', icon: Library },
    { label: 'Pre-flight', href: '/preflight', icon: Search },
];

const ADMIN_ITEMS = [
    { label: 'Compliance', href: '/compliance', icon: ShieldCheck },
    { label: 'Reports', href: '/reports', icon: FileText },
    { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flexh-screen w-64 flex-col border-r bg-slate-950 text-white">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    Trendstream™
                </h1>
                <p className="text-xs text-slate-400 mt-1">Enterprise Intelligence</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                <div className="text-xs font-semibold text-slate-500 mb-2 px-2 uppercase tracking-wider">
                    Platform
                </div>
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}

                <div className="my-6 border-t border-slate-800" />

                <div className="text-xs font-semibold text-slate-500 mb-2 px-2 uppercase tracking-wider">
                    Enterprise
                </div>
                {ADMIN_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-900">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 border border-white/10" />
                    <div className="text-sm">
                        <div className="font-medium text-slate-200">Admin User</div>
                        <div className="text-xs text-slate-500">Tenant: Acme Corp</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
