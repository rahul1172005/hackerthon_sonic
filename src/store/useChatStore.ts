import { create } from 'zustand';
import { Message } from '@/domain/models/types';

interface ChatState {
    messages: Message[];
    isLoading: boolean;
    addMessage: (role: Message['role'], content: string) => void;
    setLoading: (loading: boolean) => void;
    streamMessage: (chunk: string) => void;
    clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    isLoading: false,

    addMessage: (role, content) => set((state) => ({
        messages: [...state.messages, {
            id: crypto.randomUUID(),
            role,
            content,
            timestamp: new Date().toISOString(),
            isStreaming: role === 'assistant' && state.isLoading
        }]
    })),

    setLoading: (loading) => set({ isLoading: loading }),

    streamMessage: (chunk) => set((state) => {
        const messages = [...state.messages];
        const lastMessage = messages[messages.length - 1];

        if (lastMessage && lastMessage.role === 'assistant') {
            messages[messages.length - 1] = {
                ...lastMessage,
                content: lastMessage.content + chunk,
                isStreaming: true
            };
            return { messages };
        }

        // If no assistant message exists yet, create one
        return {
            messages: [...state.messages, {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: chunk,
                timestamp: new Date().toISOString(),
                isStreaming: true
            }]
        };
    }),

    clearMessages: () => set({ messages: [] })
}));
