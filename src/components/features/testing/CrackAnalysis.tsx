import React from 'react';
import { AlertTriangle, TrendingUp, Ruler, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface Crack {
    id: string;
    x: number;
    y: number;
    width: number;
    depth: number;
    severity: 'low' | 'medium' | 'high';
}

interface CrackAnalysisProps {
    cracks: Crack[];
}

export function CrackAnalysis({ cracks }: CrackAnalysisProps) {
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'low': return 'text-amber-400 bg-amber-950/20 border-amber-900/50';
            case 'medium': return 'text-orange-400 bg-orange-950/20 border-orange-900/50';
            case 'high': return 'text-red-400 bg-red-950/20 border-red-900/50';
            default: return 'text-zinc-400 bg-zinc-900 border-zinc-800';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
            default: return <TrendingUp className="w-4 h-4 text-orange-500" />;
        }
    };

    const getTotalRisk = () => {
        const highCount = cracks.filter(c => c.severity === 'high').length;
        const mediumCount = cracks.filter(c => c.severity === 'medium').length;

        if (highCount > 0) return { level: 'High', color: 'text-red-400 bg-red-950/30 border-red-900', icon: '🚨' };
        if (mediumCount > 1) return { level: 'Medium', color: 'text-orange-400 bg-orange-950/30 border-orange-900', icon: '⚠️' };
        return { level: 'Low', color: 'text-emerald-400 bg-emerald-950/30 border-emerald-900', icon: '✅' }; // Changed to green for Low/Safe
    };

    const risk = getTotalRisk();

    return (
        <div className="space-y-4">
            {/* Overall Risk Assessment */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border backdrop-blur-sm ${risk.color}`}
            >
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{risk.icon}</span>
                    <h4 className="font-semibold tracking-wide uppercase text-sm opacity-90">Structural Risk</h4>
                </div>
                <div className="text-xs font-medium uppercase tracking-widest opacity-70 mb-1">
                    Assessment Level
                </div>
                <div className="text-2xl font-bold tracking-tight">
                    {risk.level.toUpperCase()}
                </div>
            </motion.div>

            {/* Individual Crack Analysis */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Detected Defects</h4>
                    <Badge variant="outline" className="text-[10px] bg-zinc-900 border-zinc-800 text-zinc-400">
                        {cracks.length} FOUND
                    </Badge>
                </div>

                <div className="h-[280px] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    {cracks.map((crack, index) => (
                        <motion.div
                            key={crack.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-xl border backdrop-blur-md transition-colors ${getSeverityColor(crack.severity)}`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    {getSeverityIcon(crack.severity)}
                                    <span className="text-sm font-bold font-mono">
                                        DEFECT-{String(index + 1).padStart(3, '0')}
                                    </span>
                                </div>
                                <Badge variant="outline" className={`text-[10px] font-bold shadow-none bg-transparent border-current opacity-80`}>
                                    {crack.severity.toUpperCase()}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                <div className="flex items-center gap-2 p-2 bg-black/20 rounded-lg border border-white/5">
                                    <Ruler className="w-3.5 h-3.5 opacity-70" />
                                    <div>
                                        <div className="text-[10px] opacity-60 uppercase">Width</div>
                                        <div className="font-mono font-semibold">{crack.width.toFixed(1)}mm</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-black/20 rounded-lg border border-white/5">
                                    <Layers className="w-3.5 h-3.5 opacity-70" />
                                    <div>
                                        <div className="text-[10px] opacity-60 uppercase">Depth</div>
                                        <div className="font-mono font-semibold">{crack.depth.toFixed(1)}mm</div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-[10px] font-mono opacity-60 mb-2 px-2">
                                POS: X:{crack.x.toFixed(0)} Y:{crack.y.toFixed(0)}
                            </div>

                            {/* Crack severity analysis message */}
                            <div className="mt-2 p-2.5 bg-black/20 rounded-lg text-[10px] font-medium leading-relaxed border border-white/5">
                                {crack.severity === 'high' && (
                                    <span className="opacity-90">
                                        Critical integrity failure probable. Immediate structural intervention required.
                                    </span>
                                )}
                                {crack.severity === 'medium' && (
                                    <span className="opacity-90">
                                        Significant propagation detected. Schedule maintenance cycle within 30 days.
                                    </span>
                                )}
                                {crack.severity === 'low' && (
                                    <span className="opacity-90">
                                        Minor surface discontinuity. Logged for standard monitoring protocols.
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Statistical Summary */}
            <div className="pt-4 border-t border-zinc-800 space-y-3">
                <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Metrics</h4>

                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
                        <div className="text-[10px] text-zinc-500 font-medium mb-1 uppercase">Total</div>
                        <div className="text-xl font-bold text-zinc-200">{cracks.length}</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
                        <div className="text-[10px] text-zinc-500 font-medium mb-1 uppercase">Avg Depth</div>
                        <div className="text-xl font-bold text-zinc-200">
                            {cracks.length > 0
                                ? (cracks.reduce((sum, c) => sum + c.depth, 0) / cracks.length).toFixed(1)
                                : '0'
                            }
                        </div>
                        <div className="text-[10px] text-zinc-600 font-mono">mm</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
                        <div className="text-[10px] text-zinc-500 font-medium mb-1 uppercase">Max Width</div>
                        <div className="text-xl font-bold text-zinc-200">
                            {cracks.length > 0
                                ? Math.max(...cracks.map(c => c.width)).toFixed(1)
                                : '0'
                            }
                        </div>
                        <div className="text-[10px] text-zinc-600 font-mono">mm</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
