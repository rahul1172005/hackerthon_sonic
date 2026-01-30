'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface NavbarProps {
    className?: string;
}

export function Navbar({ className }: NavbarProps) {
    const navLinks = [
        { name: 'TESTING', href: '/testing' },
        { name: 'ABOUT', href: '/about' },
        { name: 'FEATURES', href: '/features' },
        { name: 'HELP', href: '/help' },
    ];

    return (
        <nav
            className={cn(
                "relative w-full h-16 flex items-center px-6 md:px-8 border-b border-white/5 bg-black/50 backdrop-blur-md z-40 fixed top-0 left-0 md:relative",
                className
            )}
        >
            {/* Logo / Brand - Left */}
            <Link href="/" className="flex items-center gap-2 cursor-pointer group">
                <div className="w-2 h-6 bg-white rounded-full animate-pulse-slow group-hover:bg-zinc-200 transition-colors" />
                <span className="text-lg font-semibold tracking-widest text-white font-sans group-hover:text-zinc-200 transition-colors">IRIS</span>
            </Link>

            {/* Center Navigation Removed */}


            {/* Right spacer (optional for future buttons) */}
            <div className="ml-auto hidden md:block w-[120px]" />
        </nav>
    );
}
