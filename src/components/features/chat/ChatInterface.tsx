'use client';

import React, { useState, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { ChatService } from '@/domain/services/chatService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Upload } from 'lucide-react';
import { MessageList } from './MessageList';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ChatInterface() {
    const { addMessage, messages, isLoading, setLoading, streamMessage } = useChatStore();
    const pathname = usePathname();
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const navLinks = [
        { name: 'TESTING', href: '/testing' },
        { name: 'ABOUT', href: '/about' },
        { name: 'FEATURES', href: '/features' },
        { name: 'HELP', href: '/help' },
    ];

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userContent = input;
        setInput('');
        addMessage('user', userContent);
        setLoading(true);

        if (textareaRef.current) {
            textareaRef.current.style.height = '60px';
        }

        await ChatService.streamResponse(
            userContent,
            (chunk) => streamMessage(chunk),
            () => setLoading(false)
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const renderInputBar = (centered: boolean = false) => (
        <div className={cn(
            "relative bg-zinc-800/80 backdrop-blur-xl border transition-all duration-300 rounded-2xl shadow-2xl overflow-hidden group",
            isLoading ? 'border-zinc-700 cursor-not-allowed opacity-80' : 'border-zinc-700 hover:border-zinc-600 focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20',
            centered ? "w-full shadow-[0_0_40px_-5px_rgba(0,0,0,0.3)]" : ""
        )}>
            <Textarea
                ref={textareaRef}
                className="min-h-[60px] max-h-[200px] w-full resize-none bg-transparent border-0 ring-0 focus-visible:ring-0 text-zinc-100 placeholder:text-zinc-400 text-base py-4 pl-5 pr-28 font-geist-sans"
                placeholder={isLoading ? "AI is processing..." : "Ask me anything..."}
                value={input}
                onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                }}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
            />

            <div className="absolute bottom-3 right-3 flex gap-2 items-center">
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-xl transition-all"
                    title="Upload Context"
                >
                    <Upload className="w-5 h-5" />
                </Button>

                <div className="w-px h-6 bg-zinc-700" />

                <Button
                    size="icon"
                    className={cn(
                        "h-9 w-9 rounded-xl transition-all duration-300",
                        input.trim()
                            ? "bg-white text-black hover:bg-zinc-200 shadow-[0_0_15px_-3px_rgba(255,255,255,0.3)]"
                            : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                    )}
                    onClick={() => handleSubmit()}
                    disabled={!input.trim() || isLoading}
                >
                    <Send className="w-4 h-4 ml-0.5" />
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto w-full relative bg-background">
            <div className="flex-1 overflow-y-auto z-10 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                {messages.length === 0 ? (
                    /* ================= EMPTY STATE : AI WALL + CENTERED INPUT ================= */
                    <div className="flex flex-col items-center justify-center h-full px-6 w-full">
                        <div className="text-center select-none mb-12">
                            {/* BIG AI */}
                            <h1 className="text-[90px] md:text-[140px] lg:text-[170px] font-black tracking-tight text-zinc-200/90 leading-none">
                                AI
                            </h1>

                            {/* TRY ME */}
                            <p className="mt-3 text-xl md:text-2xl tracking-[0.3em] font-semibold text-zinc-400 uppercase">
                                Inside the wall, Try Me
                            </p>

                            {/* Subtle glow */}
                            <div className="mt-8 w-64 h-px mx-auto bg-gradient-to-r from-transparent via-zinc-500/40 to-transparent" />
                        </div>

                        {/* CENTERED INPUT BAR */}
                        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
                            {renderInputBar(true)}

                            {/* NAVIGATION LINKS (Gemini Style Pills) */}
                            <div className="flex flex-wrap items-center justify-center gap-8">
                                {navLinks.map((link) => (
                                    <Button
                                        key={link.name}
                                        asChild
                                        variant="physical"
                                        className="w-[140px]"
                                        data-state={pathname === link.href ? 'active' : 'inactive'}
                                    >
                                        <Link href={link.href}>
                                            {link.name}
                                        </Link>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="pb-48">
                            <MessageList messages={messages} isLoading={isLoading} />
                        </div>
                    </>
                )}
            </div>

            {/* ================= FIXED BOTTOM INPUT BAR (Visible only when chat has started) ================= */}
            {messages.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent z-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="max-w-3xl mx-auto space-y-3">
                        {renderInputBar(false)}
                    </div>
                </div>
            )}
        </div>
    );
}
