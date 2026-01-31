'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

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
            <Link href="/" className="flex items-center gap-4 cursor-pointer group select-none">
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <Image
                        src="/logo1111.png"
                        alt="IRIS Logo"
                        width={44} // Slightly larger for visibility
                        height={44}
                        className="object-contain brightness-0 invert"
                        priority
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-white/70 drop-shadow-sm">
                        IRIS
                    </span>
                </div>
            </Link>

            {/* Center Navigation Removed */}


            {/* Right spacer (optional for future buttons) */}
            <div className="ml-auto hidden md:block w-[120px]" />
        </nav>
    );
}
