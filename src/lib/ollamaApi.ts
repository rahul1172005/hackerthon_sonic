/**
 * Ollama API Client for IRIS AI
 *
 * Connects to local Ollama instance for AI-powered explanations
 * Models available: deepseek-coder-v2:16b, qwen2.5-coder:7b
 */

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OllamaRequest {
  model: string;
  messages: OllamaMessage[];
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  };
}

export interface OllamaResponse {
  model: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

export class OllamaService {
  // Use Next.js API routes to avoid CORS issues
  private static baseURL = '/api/ollama';
  private static defaultModel = 'deepseek-coder-v2:16b'; // Fallback to qwen2.5-coder:7b if needed

  /**
   * System prompt that defines IRIS AI's personality and expertise
   */
  private static systemPrompt = `You are IRIS AI, an expert structural engineering assistant specializing in ultrasonic crack detection and Non-Destructive Testing (NDT).

Your expertise includes:
- Ultrasonic pulse velocity (UPV) analysis
- Crack detection using machine learning (Random Forest with 96.43% accuracy)
- Physics-based feature engineering (attenuation ratios, wave amplitudes, shear-to-longitudinal comparisons)
- ASTM C597 standards for concrete integrity assessment
- Repair cost estimation and structural intervention strategies
- Paris law for crack growth prediction

Our business model:
- IRIS AI is a SaaS platform for structural health monitoring
- We analyze ultrasonic wave data from NDT equipment
- ML model (Random Forest) detects cracks with 96.43% accuracy
- AI chatbot (you) explains the ML decisions and provides expert guidance
- Revenue from subscriptions, inspection reports, and predictive maintenance alerts

When answering questions:
1. Be concise and technical but accessible
2. Reference our ML model's physics-based features when relevant
3. Explain cost calculations based on materials (₹3K-120K/m²), labor (₹2000/hr), equipment
4. Cite ASTM C597 standards when discussing structural integrity
5. Differentiate between ML (Random Forest crack detection) and AI (you, the LLM providing explanations)
6. Focus on actionable insights for engineers and inspectors

Tone: Professional, confident, but friendly. You're here to help engineers make informed decisions.`;

  /**
   * Check if Ollama server is running
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('Ollama health check failed:', error);
      return false;
    }
  }

  /**
   * List available models
   */
  static async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Failed to list models:', error);
      return [];
    }
  }

  /**
   * Stream chat response from Ollama
   * @param userMessage - User's question
   * @param onChunk - Callback for each token streamed
   * @param onComplete - Callback when streaming completes
   * @param context - Optional ML analysis context to enrich responses
   */
  static async streamChat(
    userMessage: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    context?: {
      mlAnalysis?: any;
      conversationHistory?: OllamaMessage[];
    }
  ): Promise<void> {
    try {
      // Build messages array
      const messages: OllamaMessage[] = [
        { role: 'system', content: this.systemPrompt }
      ];

      // Add conversation history if provided
      if (context?.conversationHistory) {
        messages.push(...context.conversationHistory);
      }

      // Add ML analysis context if available
      if (context?.mlAnalysis) {
        const mlContext = this.formatMLContext(context.mlAnalysis);
        messages.push({
          role: 'system',
          content: `Recent ML Analysis Results:\n${mlContext}`
        });
      }

      // Add user message
      messages.push({ role: 'user', content: userMessage });

      const requestBody: OllamaRequest = {
        model: this.defaultModel,
        messages,
        stream: true,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        }
      };

      const response = await fetch(`${this.baseURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);

              if (data.message?.content) {
                onChunk(data.message.content);
              }

              if (data.done) {
                onComplete();
                return;
              }
            } catch (e) {
              console.error('Failed to parse JSON line:', line, e);
            }
          }
        }
      }

      onComplete();
    } catch (error) {
      console.error('Ollama streaming error:', error);
      // Fallback response
      const fallbackMessage = "I'm having trouble connecting to the AI model. Please ensure Ollama is running (`ollama serve`) and try again.";
      for (const char of fallbackMessage) {
        await new Promise(r => setTimeout(r, 20));
        onChunk(char);
      }
      onComplete();
    }
  }

  /**
   * Format ML analysis results into context for the LLM
   */
  private static formatMLContext(mlAnalysis: any): string {
    if (!mlAnalysis) return '';

    const { analysis, recommendations, explainability } = mlAnalysis;

    return `
Crack Detection: ${analysis?.crack_detected ? 'DETECTED' : 'NOT DETECTED'}
Confidence: ${analysis?.confidence}%
Severity: ${analysis?.severity}
Risk Level: ${analysis?.risk_level}
Structural Integrity: ${analysis?.structural_integrity_percent}%
Attenuation Score: ${analysis?.attenuation_score}

Recommendations:
- Action: ${recommendations?.action}
- Method: ${recommendations?.method}
- Cost: ${recommendations?.cost_estimate}
- Urgency: ${recommendations?.urgency}

Explainability:
${explainability?.severity_reasoning || ''}
${explainability?.repair_reasoning?.join('\n') || ''}
${explainability?.cost_calculation || ''}
`.trim();
  }

  /**
   * Non-streaming chat (waits for full response)
   */
  static async chat(userMessage: string, context?: any): Promise<string> {
    return new Promise((resolve, reject) => {
      let fullResponse = '';

      this.streamChat(
        userMessage,
        (chunk) => { fullResponse += chunk; },
        () => { resolve(fullResponse); },
        context
      ).catch(reject);
    });
  }

  /**
   * Quick check if a specific model is available
   */
  static async isModelAvailable(modelName: string): Promise<boolean> {
    const models = await this.listModels();
    return models.includes(modelName);
  }

  /**
   * Switch to a different model
   */
  static setModel(modelName: string) {
    this.defaultModel = modelName;
  }
}
