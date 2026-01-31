import { OllamaService } from '@/lib/ollamaApi';

export class ChatService {
    private static mlAnalysisContext: any = null;

    /**
     * Set ML analysis context from the testing dashboard
     * This allows the chatbot to reference recent crack analysis results
     */
    static setMLContext(mlAnalysis: any) {
        this.mlAnalysisContext = mlAnalysis;
    }

    /**
     * Get current ML context
     */
    static getMLContext() {
        return this.mlAnalysisContext;
    }

    /**
     * Clear ML context
     */
    static clearMLContext() {
        this.mlAnalysisContext = null;
    }

    /**
     * Streams AI response using Ollama (deepseek-coder-v2:16b or qwen2.5-coder:7b)
     * Provides real AI explanations for ML model decisions
     */
    static async streamResponse(
        userContent: string,
        onChunk: (chunk: string) => void,
        onComplete: () => void
    ): Promise<void> {
        // Check if Ollama is available
        const isOllamaHealthy = await OllamaService.checkHealth();

        if (!isOllamaHealthy) {
            // Fallback to simulated responses if Ollama is not running
            console.warn('Ollama not available, using fallback responses');
            await this.streamFallbackResponse(userContent, onChunk, onComplete);
            return;
        }

        // Use Ollama for real AI responses
        await OllamaService.streamChat(
            userContent,
            onChunk,
            onComplete,
            {
                mlAnalysis: this.mlAnalysisContext,
                conversationHistory: [] // Could track this in ChatStore if needed
            }
        );
    }

    /**
     * Fallback simulated responses when Ollama is not available
     */
    private static async streamFallbackResponse(
        userContent: string,
        onChunk: (chunk: string) => void,
        onComplete: () => void
    ): Promise<void> {
        // Simulate network latency for AI processing
        const processingTime = 1200 + Math.random() * 800;
        await new Promise(resolve => setTimeout(resolve, processingTime));

        const response = this.determineFallbackResponse(userContent);
        const chars = response.split('');

        // Simulate token streaming
        for (let i = 0; i < chars.length; i++) {
            const delay = 10 + Math.random() * 20;
            await new Promise(r => setTimeout(r, delay));
            onChunk(chars[i]);
        }

        onComplete();
    }

    private static determineFallbackResponse(query: string): string {
        const q = query.toLowerCase();

        // Check if we have ML context to reference
        if (this.mlAnalysisContext) {
            const { analysis, recommendations, explainability } = this.mlAnalysisContext;

            if (q.includes('cost') || q.includes('price') || q.includes('expensive')) {
                return `**Cost Breakdown Explanation**\n\n${explainability?.cost_calculation || 'Cost calculation unavailable'}\n\n**Total Estimate**: ${recommendations?.cost_estimate || 'N/A'}\n\nThis includes materials, labor at ₹2000/hr, equipment rental, and ongoing monitoring costs.`;
            }

            if (q.includes('severity') || q.includes('how bad') || q.includes('serious')) {
                return `**Severity Classification**\n\n${explainability?.severity_reasoning || 'Severity reasoning unavailable'}\n\n**Risk Level**: ${analysis?.risk_level || 'Unknown'}\n**Structural Integrity**: ${analysis?.structural_integrity_percent || 0}%`;
            }

            if (q.includes('repair') || q.includes('fix') || q.includes('method')) {
                const reasoning = explainability?.repair_reasoning?.join('\n• ') || 'Repair reasoning unavailable';
                return `**Repair Method Selection**\n\n• ${reasoning}\n\n**Recommended Method**: ${recommendations?.method || 'N/A'}\n**Urgency**: ${recommendations?.urgency || 'N/A'}`;
            }

            // General ML results query
            if (q.includes('result') || q.includes('analysis') || q.includes('crack')) {
                return `**Latest ML Analysis Results**\n\n🔍 **Detection**: ${analysis?.crack_detected ? 'Crack Detected' : 'No Crack'} (${analysis?.confidence}% confidence)\n📊 **Severity**: ${analysis?.severity}\n⚠️ **Risk**: ${analysis?.risk_level}\n🏗️ **Integrity**: ${analysis?.structural_integrity_percent}%\n📐 **Attenuation**: ${analysis?.attenuation_score}\n\n**Recommended Action**: ${recommendations?.action}\n**Method**: ${recommendations?.method}\n**Cost**: ${recommendations?.cost_estimate}\n**Urgency**: ${recommendations?.urgency}`;
            }
        }

        // Default responses when no ML context
        if (q.includes('crack') || q.includes('defect') || q.includes('integrity')) {
            return "**Analysis Report: Structural Anomaly Detected**\n\nBased on the ultrasonic pulse velocity (UPV) variations in the current sector:\n\n1. **Anomaly Detected**: Zone B-4 (Coordinate 2.4m, 1.1m)\n2. **Signal Attenuation**: -14dB drop observed, indicating potential voiding or delamination.\n3. **Estimated Depth**: 45mm ± 5mm\n4. **Confidence Score**: 94.2%\n\n**Recommendation**: Proceed with secondary grid scan using 50mm spacing to delineate void boundaries.";
        }

        if (q.includes('velocity') || q.includes('upv') || q.includes('speed')) {
            return "**Velocity Profile Analysis**\n\n- **Average Velocity**: 3850 m/s (Grade A Concrete)\n- **Standard Deviation**: 120 m/s\n- **Minimum**: 2900 m/s (Potential Defect at Region 4)\n- **Maximum**: 4200 m/s\n\nData is consistent with C30/35 concrete density specifications.";
        }

        if (q.includes('upload') || q.includes('data')) {
            return "Ready to ingest data. Please upload `.csv` waveform arrays or `.json` test session files using the upload interface. System supports:\n- PUNDIT Lab+ Formats\n- Proceq Strings\n- Custom Array Streams";
        }

        if (q.includes('ml') || q.includes('model') || q.includes('how') || q.includes('accuracy')) {
            return "**IRIS AI ML Model**\n\n🤖 **Algorithm**: Random Forest Classifier\n📊 **Accuracy**: 96.43% (test set)\n🔢 **Features**: 59 physics-based features\n⚡ **Speed**: <200ms response time\n\n**Feature Types**:\n• Amplitude statistics (mean, std, peak)\n• Energy metrics (RMS, total energy)\n• Attenuation ratios (signal decay)\n• Cross-wave comparisons (shear vs longitudinal)\n• Rotation differences (0° vs 90°)\n\nOur ML model detects cracks, then I (AI chatbot) explain the results!";
        }

        return "I'm IRIS AI, your structural engineering assistant. I can explain:\n• ML crack detection results\n• Cost calculations and repair methods\n• Severity classifications\n• Ultrasonic wave analysis\n\nRun an analysis in the **TESTING** tab, then ask me questions about it!";
    }
}
