'use client';

import React from 'react';
import { Sidebar } from '@/components/features/chat/Sidebar';
import { Navbar } from '@/components/shared/Navbar';
import type { ReactNode } from 'react';

export function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-background text-white overflow-hidden font-geist-sans">
            <Sidebar className="hidden md:flex" />
            <main className="flex-1 flex flex-col relative bg-background overflow-hidden">
                <div className="w-full relative z-30 hidden md:block">
                    <Navbar className="relative border-b border-zinc-900/50 bg-black/80 md:bg-transparent" />
                </div>

                {/* Mobile Header (simplified for now, reused conceptually) */}
                <div className="md:hidden absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-black/80 backdrop-blur border-b border-zinc-900">
                    <span className="text-lg font-semibold tracking-widest text-white font-sans">IRIS</span>
                </div>

                <div className="flex-1 overflow-auto relative scrollbar-thin scrollbar-thumb-zinc-800">
                    {children}
                </div>
            </main>
        </div>
    );
}
