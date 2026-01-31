/**
 * Ollama Chat API Route
 * Proxies requests to local Ollama server to avoid CORS issues
 */

import { NextRequest } from 'next/server';

const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            return new Response(
                JSON.stringify({ error: `Ollama API error: ${response.status}` }),
                { status: response.status, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // If streaming is requested, pipe the response
        if (body.stream) {
            const reader = response.body?.getReader();
            if (!reader) {
                return new Response(
                    JSON.stringify({ error: 'No response body from Ollama' }),
                    { status: 500, headers: { 'Content-Type': 'application/json' } }
                );
            }

            // Create a readable stream that pipes from Ollama
            const stream = new ReadableStream({
                async start(controller) {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            controller.close();
                            break;
                        }
                        controller.enqueue(value);
                    }
                },
            });

            return new Response(stream, {
                headers: {
                    'Content-Type': 'application/x-ndjson',
                    'Transfer-Encoding': 'chunked',
                },
            });
        }

        // Non-streaming response
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Ollama proxy error:', error);
        return new Response(
            JSON.stringify({ 
                error: 'Failed to connect to Ollama. Make sure Ollama is running.',
                details: error instanceof Error ? error.message : 'Unknown error'
            }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
