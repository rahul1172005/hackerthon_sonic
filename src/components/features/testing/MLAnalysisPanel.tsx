'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Loader2, Brain, Upload, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalysisResult as MLAnalysisResult, getRiskLevelColor, getSeverityColor } from '@/lib/irisApi';

interface MLAnalysisPanelProps {
    uploadedFiles: {
        long_rot00?: File;
        long_rot90?: File;
        shear_rot00?: File;
        shear_rot90?: File;
    };
    onFileChange: (fileType: 'long_rot00' | 'long_rot90' | 'shear_rot00' | 'shear_rot90', file: File | null) => void;
    onAnalyze: () => void;
    loading: boolean;
    error: string | null;
    result: MLAnalysisResult | null;
}

export function MLAnalysisPanel({
    uploadedFiles,
    onFileChange,
    onAnalyze,
    loading,
    error,
    result
}: MLAnalysisPanelProps) {
    const allFilesUploaded = uploadedFiles.long_rot00 && uploadedFiles.long_rot90 &&
                              uploadedFiles.shear_rot00 && uploadedFiles.shear_rot90;

    return (
        <div className="space-y-6">
            {/* File Upload Card */}
            <Card className="bg-gradient-to-br from-purple-900/20 via-zinc-900 to-pink-900/20 border-purple-500/30 shadow-2xl shadow-purple-500/10">
                <CardHeader className="border-b border-purple-500/20 bg-zinc-950/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white text-2xl font-bold flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                AI-Powered Crack Detection
                            </CardTitle>
                            <p className="text-zinc-400 text-sm mt-2">
                                Upload ultrasonic wave data (.npy files) for ML-based structural analysis with 96% accuracy
                            </p>
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
                            Random Forest ML
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Long Wave Rot 0° */}
                        <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                            <label className="block text-sm font-medium mb-2 text-zinc-300">
                                Longitudinal Wave (0°)
                                {uploadedFiles.long_rot00 && <CheckCircle className="inline w-4 h-4 ml-2 text-green-500" />}
                            </label>
                            <input
                                type="file"
                                accept=".npy"
                                onChange={(e) => onFileChange('long_rot00', e.target.files?.[0] || null)}
                                className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-900/50 text-white text-sm"
                            />
                            {uploadedFiles.long_rot00 && (
                                <p className="text-xs text-zinc-500 mt-1">
                                    {uploadedFiles.long_rot00.name} ({(uploadedFiles.long_rot00.size / 1024 / 1024).toFixed(1)} MB)
                                </p>
                            )}
                        </div>

                        {/* Long Wave Rot 90° */}
                        <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                            <label className="block text-sm font-medium mb-2 text-zinc-300">
                                Longitudinal Wave (90°)
                                {uploadedFiles.long_rot90 && <CheckCircle className="inline w-4 h-4 ml-2 text-green-500" />}
                            </label>
                            <input
                                type="file"
                                accept=".npy"
                                onChange={(e) => onFileChange('long_rot90', e.target.files?.[0] || null)}
                                className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-900/50 text-white text-sm"
                            />
                            {uploadedFiles.long_rot90 && (
                                <p className="text-xs text-zinc-500 mt-1">
                                    {uploadedFiles.long_rot90.name} ({(uploadedFiles.long_rot90.size / 1024 / 1024).toFixed(1)} MB)
                                </p>
                            )}
                        </div>

                        {/* Shear Wave Rot 0° */}
                        <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                            <label className="block text-sm font-medium mb-2 text-zinc-300">
                                Shear Wave (0°)
                                {uploadedFiles.shear_rot00 && <CheckCircle className="inline w-4 h-4 ml-2 text-green-500" />}
                            </label>
                            <input
                                type="file"
                                accept=".npy"
                                onChange={(e) => onFileChange('shear_rot00', e.target.files?.[0] || null)}
                                className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-900/50 text-white text-sm"
                            />
                            {uploadedFiles.shear_rot00 && (
                                <p className="text-xs text-zinc-500 mt-1">
                                    {uploadedFiles.shear_rot00.name} ({(uploadedFiles.shear_rot00.size / 1024 / 1024).toFixed(1)} MB)
                                </p>
                            )}
                        </div>

                        {/* Shear Wave Rot 90° */}
                        <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800">
                            <label className="block text-sm font-medium mb-2 text-zinc-300">
                                Shear Wave (90°)
                                {uploadedFiles.shear_rot90 && <CheckCircle className="inline w-4 h-4 ml-2 text-green-500" />}
                            </label>
                            <input
                                type="file"
                                accept=".npy"
                                onChange={(e) => onFileChange('shear_rot90', e.target.files?.[0] || null)}
                                className="w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-900/50 text-white text-sm"
                            />
                            {uploadedFiles.shear_rot90 && (
                                <p className="text-xs text-zinc-500 mt-1">
                                    {uploadedFiles.shear_rot90.name} ({(uploadedFiles.shear_rot90.size / 1024 / 1024).toFixed(1)} MB)
                                </p>
                            )}
                        </div>
                    </div>

                    <Button
                        onClick={onAnalyze}
                        disabled={!allFilesUploaded || loading}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/30"
                        size="lg"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Analyzing with AI...
                            </>
                        ) : (
                            <>
                                <Brain className="mr-2 h-5 w-5" />
                                Run AI Analysis
                            </>
                        )}
                    </Button>

                    {error && (
                        <div className="bg-red-950/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg">
                            <p className="font-semibold flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Error
                            </p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Results Display */}
            {result && (
                <div className="space-y-6">
                    {/* Detection Banner */}
                    <Card className={cn(
                        "border-2 shadow-2xl",
                        result.analysis.crack_detected
                            ? "border-red-500 bg-red-950/10"
                            : "border-green-500 bg-green-950/10"
                    )}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {result.analysis.crack_detected ? (
                                        <AlertTriangle className="w-16 h-16 text-red-500" />
                                    ) : (
                                        <CheckCircle className="w-16 h-16 text-green-500" />
                                    )}
                                    <div>
                                        <h2 className="text-3xl font-bold text-white">
                                            {result.analysis.crack_detected ? 'Crack Detected!' : 'No Crack Detected'}
                                        </h2>
                                        <p className="text-zinc-400 text-lg mt-1">
                                            AI Confidence: <span className="text-white font-bold">{result.analysis.confidence.toFixed(1)}%</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge className={cn(
                                        getSeverityColor(result.analysis.severity),
                                        "text-white text-xl px-6 py-3"
                                    )}>
                                        {result.analysis.severity}
                                    </Badge>
                                    <p className="text-xs text-zinc-500 mt-2">
                                        Processed in {result.processing_time_ms.toFixed(0)}ms
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Risk Metrics */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white">Risk Assessment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className={cn("p-6 rounded-lg border-2", getRiskLevelColor(result.analysis.risk_level))}>
                                    <p className="text-sm font-medium opacity-80">Risk Level</p>
                                    <p className="text-3xl font-bold mt-1">{result.analysis.risk_level}</p>
                                </div>
                                <div className="p-6 rounded-lg border-2 bg-blue-950/20 border-blue-500/30 text-blue-300">
                                    <p className="text-sm font-medium opacity-80">Structural Integrity</p>
                                    <p className="text-3xl font-bold mt-1">
                                        {result.analysis.structural_integrity_percent}%
                                    </p>
                                </div>
                                <div className="p-6 rounded-lg border-2 bg-purple-950/20 border-purple-500/30 text-purple-300">
                                    <p className="text-sm font-medium opacity-80">Attenuation Score</p>
                                    <p className="text-3xl font-bold mt-1">
                                        {result.analysis.attenuation_score.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recommendations with Explainability */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                💡 AI Recommendations
                                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Explainable AI</Badge>
                            </CardTitle>
                            <p className="text-zinc-400 text-sm">{result.recommendations.urgency}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">{result.recommendations.action}</h3>
                                {result.recommendations.immediate_action_required && (
                                    <Badge variant="destructive" className="text-sm px-3 py-1">
                                        ⚠️ IMMEDIATE ACTION REQUIRED
                                    </Badge>
                                )}
                            </div>

                            {/* Explainability Section */}
                            {result.explainability && (
                                <div className="bg-blue-950/20 border border-blue-500/30 p-4 rounded-lg space-y-3">
                                    <h4 className="font-semibold text-blue-300 flex items-center gap-2">
                                        🧠 Why This Recommendation?
                                    </h4>

                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-xs text-blue-400 font-medium">Severity Classification:</p>
                                            <p className="text-sm text-blue-200">{result.explainability.severity_reasoning}</p>
                                        </div>

                                        {result.explainability.repair_reasoning && result.explainability.repair_reasoning.length > 0 && (
                                            <div>
                                                <p className="text-xs text-blue-400 font-medium">Repair Method Logic:</p>
                                                <ul className="text-sm text-blue-200 space-y-1">
                                                    {result.explainability.repair_reasoning.map((reason: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-blue-500 mt-1">→</span>
                                                            <span>{reason}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-xs text-blue-400 font-medium">Cost Calculation:</p>
                                            <p className="text-sm text-blue-200">{result.explainability.cost_calculation}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-zinc-950/50 p-4 rounded-lg">
                                <h4 className="font-medium text-white mb-2">Repair Methods:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    {result.recommendations.methods.map((method, i) => (
                                        <li key={i} className="text-zinc-300">{method}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-zinc-950/50 rounded-lg">
                                    <p className="text-sm text-zinc-400">Cost Estimate</p>
                                    <p className="text-xl font-bold text-white">{result.recommendations.cost_estimate}</p>
                                    {result.recommendations.cost_breakdown && (
                                        <div className="mt-2 text-xs text-zinc-500 space-y-1">
                                            <p>Materials: ₹{(result.recommendations.cost_breakdown.materials / 1000).toFixed(0)}K</p>
                                            <p>Labor: ₹{(result.recommendations.cost_breakdown.labor / 1000).toFixed(0)}K</p>
                                            <p>Equipment: ₹{(result.recommendations.cost_breakdown.equipment / 1000).toFixed(0)}K</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 bg-zinc-950/50 rounded-lg">
                                    <p className="text-sm text-zinc-400">Structural Impact</p>
                                    <p className="text-xl font-bold text-white">{result.recommendations.structural_impact}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-yellow-950/20 border border-yellow-500/30 rounded-lg">
                                <p className="text-sm text-yellow-300 font-medium">Estimated Lifespan (No Intervention)</p>
                                <p className="text-lg font-bold text-yellow-200 mt-1">{result.recommendations.estimated_lifespan}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Crack Progression */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <TrendingDown className="w-5 h-5" />
                                Crack Progression Forecast
                            </CardTitle>
                            <p className="text-zinc-400 text-sm">{result.progression.model}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {result.progression.timeline.map((time, i) => {
                                    const severity = result.progression.severity_forecast[i];
                                    const risk = result.progression.risk_forecast[i];
                                    return (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="w-24 font-bold text-white">{time}</div>
                                            <div className="flex-1">
                                                <div className="w-full bg-zinc-800 rounded-full h-6">
                                                    <div
                                                        className={cn(
                                                            "h-6 rounded-full transition-all",
                                                            severity < 0.3 ? "bg-green-500" :
                                                            severity < 0.6 ? "bg-yellow-500" :
                                                            severity < 0.85 ? "bg-orange-500" :
                                                            "bg-red-500"
                                                        )}
                                                        style={{ width: `${Math.min(severity * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-32 text-right">
                                                <Badge variant={
                                                    risk === 'Low' ? 'default' :
                                                    risk === 'Critical' ? 'destructive' : 'secondary'
                                                }>
                                                    {risk}
                                                </Badge>
                                            </div>
                                            <div className="w-20 text-right text-white font-mono">
                                                {(severity * 100).toFixed(0)}%
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
