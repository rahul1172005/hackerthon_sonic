'use client';

import React from 'react';
import Link from 'next/link';
import { Sidebar } from './Sidebar';
import { ChatInterface } from './ChatInterface';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { Navbar } from '@/components/shared/Navbar';

export function ChatLayout() {
    return (
        <div className="flex h-screen w-full bg-background text-white overflow-hidden font-geist-sans">
            {/* Desktop Sidebar */}
            <Sidebar className="hidden md:flex" />

            <main className="flex-1 flex flex-col min-h-0 relative bg-background">
                {/* Navbar (Desktop & Tablet) */}
                <div className="w-full relative z-30 hidden md:block">
                    <Navbar className="relative border-b border-zinc-900/50 bg-black/80 md:bg-transparent" />
                </div>

                {/* Mobile Header */}
                <div className="md:hidden absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-black/80 backdrop-blur border-b border-zinc-900">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-zinc-400">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 border-r border-zinc-800 w-[280px] bg-black">
                            <Sidebar />
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="text-lg font-semibold tracking-widest text-white font-sans mr-2">IRIS</Link>
                </div>

                <div className="flex-1 relative min-h-0">
                    <ChatInterface />
                </div>
            </main>
        </div>
    );
}
