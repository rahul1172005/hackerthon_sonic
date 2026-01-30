import React from 'react';
import { motion } from 'framer-motion';

export interface SensorDataPoint {
    time: number;
    sensor1: number;
    sensor2: number;
    sensor3: number;
    sensor4: number;
}

interface DataVisualizationProps {
    data: SensorDataPoint[];
    isActive: boolean;
}

export function DataVisualization({ data, isActive }: DataVisualizationProps) {
    const latestData = data[data.length - 1];

    return (
        <div className="space-y-4">
            {/* Real-time Waveform */}
            <div className="h-64">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Ultrasonic Signal Amplitude (MHz)
                    </h4>
                    <span className="text-xs font-mono text-zinc-600">LIVE FEED</span>
                </div>

                <div className="w-full h-full bg-zinc-950 border border-zinc-800 rounded-xl relative overflow-hidden shadow-inner">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                    <svg width="100%" height="100%" viewBox="0 0 800 200" className="absolute inset-0">
                        {/* Grid */}
                        <defs>
                            <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#27272a" strokeWidth="1" />
                            </pattern>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.5" />

                        {/* Y-axis labels */}
                        <text x="20" y="30" className="text-[10px] fill-zinc-600 font-mono">3.0</text>
                        <text x="20" y="100" className="text-[10px] fill-zinc-600 font-mono">2.5</text>
                        <text x="20" y="170" className="text-[10px] fill-zinc-600 font-mono">2.0</text>

                        {/* Baseline reference */}
                        <line x1="40" y1="100" x2="760" y2="100" stroke="#3f3f46" strokeDasharray="4,4" strokeWidth="1" />

                        {/* Data lines with neon glow */}
                        {data.length > 1 && (
                            <g filter="url(#glow)">
                                {/* Sensor 1 - Blue */}
                                <path
                                    d={`M ${data.map((d, i) => `${40 + (i * 720 / Math.max(data.length - 1, 1))},${100 - ((d.sensor1 - 2.5) * 140)}`).join(' L ')}`}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-90"
                                />

                                {/* Sensor 2 - Green */}
                                <path
                                    d={`M ${data.map((d, i) => `${40 + (i * 720 / Math.max(data.length - 1, 1))},${100 - ((d.sensor2 - 2.5) * 140)}`).join(' L ')}`}
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-90"
                                />

                                {/* Sensor 3 - Amber */}
                                <path
                                    d={`M ${data.map((d, i) => `${40 + (i * 720 / Math.max(data.length - 1, 1))},${100 - ((d.sensor3 - 2.5) * 140)}`).join(' L ')}`}
                                    fill="none"
                                    stroke="#f59e0b"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-90"
                                />

                                {/* Sensor 4 - Red */}
                                <path
                                    d={`M ${data.map((d, i) => `${40 + (i * 720 / Math.max(data.length - 1, 1))},${100 - ((d.sensor4 - 2.5) * 140)}`).join(' L ')}`}
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-90"
                                />
                            </g>
                        )}
                    </svg>
                </div>
            </div>

            {/* Live Sensor Readings */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((sensorNum) => {
                    const value = latestData ? latestData[`sensor${sensorNum}` as keyof SensorDataPoint] : 2.5;
                    const isAnomalous = Math.abs(Number(value) - 2.5) > 0.15;

                    const colors = {
                        1: 'blue',
                        2: 'emerald',
                        3: 'amber',
                        4: 'red'
                    } as const;
                    const color = colors[sensorNum as keyof typeof colors];

                    return (
                        <div
                            key={sensorNum}
                            className={`p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 ${isActive
                                ? isAnomalous
                                    ? `bg-${color}-950/30 border-${color}-800/50 shadow-[0_0_15px_rgba(var(--${color}-500),0.1)]`
                                    : `bg-zinc-900/50 border-zinc-800`
                                : 'bg-zinc-900/30 border-zinc-800'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-mono uppercase tracking-wider ${isActive ? `text-${color}-400` : 'text-zinc-600'}`}>
                                    CH-0{sensorNum}
                                </span>
                                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-zinc-700'}`} />
                            </div>

                            <div className="flex items-baseline gap-1">
                                <span className={`text-2xl font-bold font-mono ${isActive
                                    ? isAnomalous ? `text-${color}-400` : 'text-zinc-200'
                                    : 'text-zinc-600'
                                    }`}>
                                    {Number(value).toFixed(3)}
                                </span>
                                <span className="text-[10px] text-zinc-500 font-mono">MHz</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Signal Analysis Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800/50">
                <div className="text-center p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                    <div className="text-[10px] text-zinc-500 font-mono mb-1 uppercase tracking-wider">Quality</div>
                    <div className={`text-lg font-bold ${isActive ? 'text-emerald-400' : 'text-zinc-600'}`}>
                        {isActive ? '94%' : '--'}
                    </div>
                </div>
                <div className="text-center p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                    <div className="text-[10px] text-zinc-500 font-mono mb-1 uppercase tracking-wider">SNR</div>
                    <div className={`text-lg font-bold ${isActive ? 'text-blue-400' : 'text-zinc-600'}`}>
                        {isActive ? '42dB' : '--'}
                    </div>
                </div>
                <div className="text-center p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                    <div className="text-[10px] text-zinc-500 font-mono mb-1 uppercase tracking-wider">Loss</div>
                    <div className={`text-lg font-bold ${isActive ? 'text-amber-400' : 'text-zinc-600'}`}>
                        {isActive ? '0.1dB' : '--'}
                    </div>
                </div>
            </div>
        </div>
    );
}
