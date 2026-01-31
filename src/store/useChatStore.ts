import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from '@/domain/models/types';

export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    updatedAt: string;
}

interface ChatState {
    messages: Message[];
    sessions: ChatSession[];
    currentSessionId: string | null;
    isLoading: boolean;

    addMessage: (role: Message['role'], content: string) => void;
    setLoading: (loading: boolean) => void;
    streamMessage: (chunk: string) => void;
    clearMessages: () => void; // Acts as "New Chat"

    // Session Management
    loadSession: (sessionId: string) => void;
    deleteSession: (sessionId: string) => void;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            messages: [],
            sessions: [],
            currentSessionId: null,
            isLoading: false,

            addMessage: (role, content) => {
                const newMessage: Message = {
                    id: crypto.randomUUID(),
                    role,
                    content,
                    timestamp: new Date().toISOString(),
                    isStreaming: role === 'assistant' && get().isLoading
                };

                set((state) => {
                    let { currentSessionId, sessions } = state;
                    const newMessages = [...state.messages, newMessage];

                    // If no session is active, create one
                    if (!currentSessionId) {
                        const newSession: ChatSession = {
                            id: crypto.randomUUID(),
                            title: content.slice(0, 30) + (content.length > 30 ? '...' : ''), // Auto-generate title from first message
                            messages: newMessages,
                            updatedAt: new Date().toISOString()
                        };
                        return {
                            messages: newMessages,
                            sessions: [newSession, ...sessions],
                            currentSessionId: newSession.id
                        };
                    }

                    // Update existing session
                    const updatedSessions = sessions.map(session =>
                        session.id === currentSessionId
                            ? { ...session, messages: newMessages, updatedAt: new Date().toISOString() }
                            : session
                    );

                    // Move current session to top if updated
                    const currentSession = updatedSessions.find(s => s.id === currentSessionId);
                    const otherSessions = updatedSessions.filter(s => s.id !== currentSessionId);

                    return {
                        messages: newMessages,
                        sessions: currentSession ? [currentSession, ...otherSessions] : updatedSessions
                    };
                });
            },

            setLoading: (loading) => set({ isLoading: loading }),

            streamMessage: (chunk) => set((state) => {
                const messages = [...state.messages];
                const lastMessage = messages[messages.length - 1];

                if (!lastMessage) return {}; // Should not happen if logic is correct

                let updatedMessages = messages;

                if (lastMessage.role === 'assistant') {
                    // Update existing assistant message
                    updatedMessages[messages.length - 1] = {
                        ...lastMessage,
                        content: lastMessage.content + chunk,
                        isStreaming: true
                    };
                } else {
                    // Create new assistant message (rare case for stream start if not handled in addMessage, 
                    // but usually addMessage handles 'user', then we might need to inject 'assistant' start here?)
                    // Adjusted logic: usually we add 'user', then start streaming 'assistant'.
                    // For simplicity, let's assume 'assistant' message is created implicitly or explicitly.
                    // The previous implementation created it on the fly. Let's keep that.

                    updatedMessages = [...messages, {
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: chunk,
                        timestamp: new Date().toISOString(),
                        isStreaming: true
                    }];
                }

                // Sync with session
                const { currentSessionId, sessions } = state;
                if (currentSessionId) {
                    const updatedSessions = sessions.map(session =>
                        session.id === currentSessionId
                            ? { ...session, messages: updatedMessages, updatedAt: new Date().toISOString() }
                            : session
                    );
                    return { messages: updatedMessages, sessions: updatedSessions };
                }

                return { messages: updatedMessages };
            }),

            clearMessages: () => set({
                messages: [],
                currentSessionId: null,
                isLoading: false
            }),

            loadSession: (sessionId) => {
                const session = get().sessions.find(s => s.id === sessionId);
                if (session) {
                    set({
                        currentSessionId: session.id,
                        messages: session.messages,
                        isLoading: false
                    });
                }
            },

            deleteSession: (sessionId) => set((state) => {
                const newSessions = state.sessions.filter(s => s.id !== sessionId);
                // If we deleted the active session, clear the view
                if (state.currentSessionId === sessionId) {
                    return {
                        sessions: newSessions,
                        currentSessionId: null,
                        messages: []
                    };
                }
                return { sessions: newSessions };
            })
        }),
        {
            name: 'chat-storage', // unique name
            partialize: (state) => ({ sessions: state.sessions }), // Persist sessions only, or everything?
            // Actually let's persist sessions. current state can be derivative.
            // But for simple "restore where I left off", persisting everything is fine.
        }
    )
);
