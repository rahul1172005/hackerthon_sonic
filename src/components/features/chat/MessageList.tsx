'use client';

import React, { useRef, useEffect } from 'react';
import { Message } from '@/domain/models/types';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface MessageListProps {
    messages: Message[];
    isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto py-8 px-4">
            {messages.map((msg) => (
                <div key={msg.id} className={cn("flex gap-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>

                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                        msg.role === 'assistant' ? "bg-zinc-800 border border-zinc-700 text-white animate-pulse-slow" : "bg-zinc-800 border border-zinc-700 text-zinc-400"
                    )}>
                        {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>

                    <div className={cn(
                        "rounded-2xl px-6 py-4 max-w-[85%] text-sm leading-7 shadow-sm",
                        msg.role === 'user'
                            ? "bg-zinc-800 text-white rounded-tr-sm"
                            : "bg-transparent text-zinc-200 border border-zinc-800/50 rounded-tl-sm backdrop-blur-sm"
                    )}>
                        <div className="whitespace-pre-wrap font-sans tracking-wide">
                            {msg.content}
                            {msg.isStreaming && (
                                <span className="inline-block w-2 h-4 ml-1 align-middle bg-white animate-pulse rounded-full" />
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {isLoading && !messages[messages.length - 1]?.isStreaming && (
                <div className="flex gap-4 w-full max-w-3xl mx-auto px-4 fade-in duration-300">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1 animate-pulse">
                        <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-2 py-2">
                        <div className="h-4 w-24 bg-zinc-800/50 rounded animate-pulse" />
                        <div className="h-4 w-64 bg-zinc-800/30 rounded animate-pulse" />
                    </div>
                </div>
            )}

            <div ref={bottomRef} className="h-4" />
        </div>
    );
}
