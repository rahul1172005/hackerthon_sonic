'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Database, Cpu, FileText, Zap, Info, HelpCircle, Trash2, MessageSquare } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/useChatStore';

export function Sidebar({ className }: { className?: string }) {
    // Destructure state from the store
    const {
        clearMessages,
        sessions,
        loadSession,
        deleteSession,
        currentSessionId
    } = useChatStore();

    // Default to empty array if sessions is somehow undefined during hydration
    const safeSessions = sessions || [];

    return (
        <div className={cn("w-[260px] shrink-0 h-full bg-sidebar border-r border-sidebar-border flex flex-col", className)}>
            <div className="p-4">
                <Button
                    variant="physical"
                    className="w-full justify-start gap-3 pl-6"
                    onClick={() => clearMessages()}
                >
                    <Plus className="w-4 h-4" />
                    New Test Session
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto py-2 scrollabar-thin scrollbar-thumb-zinc-800">
                <div className="px-3 mb-6">
                    <p className="text-xs font-medium text-muted-foreground mb-2 px-2 uppercase tracking-wider">Recent Sessions</p>
                    <div className="space-y-1">
                        {safeSessions.length === 0 ? (
                            <p className="px-2 text-xs text-zinc-600 italic">No recent chats</p>
                        ) : (
                            safeSessions.map((session) => (
                                <div
                                    key={session.id}
                                    className={cn(
                                        "group flex items-center gap-2 w-full rounded-md px-2 py-1.5 transition-colors cursor-pointer",
                                        currentSessionId === session.id
                                            ? "bg-sidebar-accent text-sidebar-foreground"
                                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                                    )}
                                    onClick={() => loadSession(session.id)}
                                >
                                    <MessageSquare className="w-4 h-4 shrink-0" />
                                    <span className="flex-1 text-sm truncate text-left">{session.title || 'Untitled Session'}</span>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteSession(session.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-700 rounded transition-all text-zinc-400 hover:text-red-400"
                                        title="Delete chat"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="px-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2 px-2 uppercase tracking-wider">System</p>
                    <div className="space-y-1">
                        <SidebarItem icon={Database} label="Data Management" />
                        <SidebarItem icon={Cpu} label="Device Config" />
                        <SidebarItem icon={FileText} label="Generated Reports" />
                    </div>
                </div>

                <div className="px-3 mt-6">
                    <p className="text-xs font-medium text-muted-foreground mb-2 px-2 uppercase tracking-wider">Resources</p>
                    <div className="space-y-1">
                        <Link href="/features">
                            <SidebarItem icon={Zap} label="Features" />
                        </Link>
                        <Link href="/about">
                            <SidebarItem icon={Info} label="About" />
                        </Link>
                        <Link href="/help">
                            <SidebarItem icon={HelpCircle} label="Help & Guide" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-sidebar-border bg-sidebar">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-xs border border-zinc-700 ring-2 ring-transparent group-hover:ring-zinc-600 transition-all">
                        ENG
                    </div>
                </div>
                <div className="flex-1 overflow-hidden">
                    {/* User info removed */}
                </div>
            </div>
        </div>
    );
}

function SidebarItem({ icon: Icon, label }: { icon: React.ElementType, label: string }) {
    return (
        <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent h-9 px-2">
            {label}
        </Button>
    )
}
