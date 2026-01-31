/**
 * Ollama Health Check API Route
 * Checks if Ollama server is running
 */

import { NextRequest } from 'next/server';

const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            return new Response(JSON.stringify({
                status: 'healthy',
                models: data.models?.map((m: any) => m.name) || [],
            }), {
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({
            status: 'unhealthy',
            error: `Ollama returned status ${response.status}`,
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({
            status: 'unhealthy',
            error: 'Cannot connect to Ollama. Is it running?',
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
