import React from 'react';
import { motion } from 'framer-motion';
import { UltrasonicSensor } from './UltrasonicSensor';

interface Crack {
    id: string;
    x: number;
    y: number;
    width: number;
    depth: number;
    severity: 'low' | 'medium' | 'high';
}

interface ConcreteStructureProps {
    isActive: boolean;
    detectedCracks: Crack[];
    currentStep: number;
}

export function ConcreteStructure({ isActive, detectedCracks, currentStep }: ConcreteStructureProps) {
    const sensors = [
        { id: 'sensor-1', x: 50, y: 30, active: currentStep >= 2 },
        { id: 'sensor-2', x: 150, y: 30, active: currentStep >= 2 },
        { id: 'sensor-3', x: 250, y: 30, active: currentStep >= 2 },
        { id: 'sensor-4', x: 350, y: 30, active: currentStep >= 2 },
    ];

    const getCrackColor = (severity: string) => {
        switch (severity) {
            case 'low': return '#f59e0b'; // amber
            case 'medium': return '#f97316'; // orange
            case 'high': return '#ef4444'; // red
            default: return '#6b7280'; // gray
        }
    };

    return (
        <div className="relative w-full">
            {/* Structure Container */}
            <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border border-zinc-800/50 p-8 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

                {/* Concrete Beam */}
                <div className="relative z-10">
                    <svg width="400" height="120" className="mx-auto drop-shadow-2xl overflow-visible">
                        {/* Main concrete structure */}
                        <defs>
                            <pattern id="concrete" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <rect width="20" height="20" fill="#27272a" />
                                <circle cx="5" cy="5" r="1" fill="#3f3f46" />
                                <circle cx="15" cy="12" r="0.8" fill="#3f3f46" />
                                <circle cx="8" cy="17" r="1.2" fill="#3f3f46" />
                            </pattern>

                            {/* Enhanced Gradient for 3D effect */}
                            <linearGradient id="structureGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#3f3f46" />
                                <stop offset="10%" stopColor="#27272a" />
                                <stop offset="90%" stopColor="#27272a" />
                                <stop offset="100%" stopColor="#18181b" />
                            </linearGradient>

                            {/* Shadow filter */}
                            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                                <feOffset dx="0" dy="4" result="offsetblur" />
                                <feComponentTransfer>
                                    <feFuncA type="linear" slope="0.5" />
                                </feComponentTransfer>
                                <feMerge>
                                    <feMergeNode />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Main beam with shadow */}
                        <rect
                            x="20" y="40" width="360" height="40"
                            fill="url(#structureGradient)"
                            stroke="#52525b"
                            strokeWidth="1"
                            rx="4"
                            filter="url(#shadow)"
                        />

                        {/* Support pillars with gradient */}
                        <path d="M 20 80 L 20 110 L 40 110 L 40 80 Z" fill="#27272a" stroke="#52525b" strokeWidth="1" />
                        <path d="M 360 80 L 360 110 L 380 110 L 380 80 Z" fill="#27272a" stroke="#52525b" strokeWidth="1" />

                        {/* Reinforcement bars (rebar) indication */}
                        {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x, i) => (
                            <circle key={i} cx={x} cy="60" r="2" fill="#52525b" opacity="0.8" />
                        ))}

                        {/* Detected cracks */}
                        {detectedCracks.map((crack) => (
                            <motion.g
                                key={crack.id}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, type: "spring" }}
                            >
                                {/* Crack line with glow */}
                                <defs>
                                    <filter id={`glow-${crack.id}`}>
                                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                                <path
                                    d={`M ${crack.x} ${crack.y} Q ${crack.x + crack.width / 2} ${crack.y + crack.depth / 2} ${crack.x + crack.width} ${crack.y + crack.depth}`}
                                    stroke={getCrackColor(crack.severity)}
                                    strokeWidth={Math.max(crack.width, 2)}
                                    fill="none"
                                    strokeLinecap="round"
                                    filter={`url(#glow-${crack.id})`}
                                />

                                {/* Crack highlight with pulse */}
                                <motion.circle
                                    cx={crack.x + crack.width / 2}
                                    cy={crack.y + crack.depth / 2}
                                    r="8"
                                    fill={getCrackColor(crack.severity)}
                                    fillOpacity="0.2"
                                    stroke={getCrackColor(crack.severity)}
                                    strokeWidth="1.5"
                                    strokeDasharray="3,3"
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.3, 0.7, 0.3]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />

                                {/* Severity indicator */}
                                <g transform={`translate(${crack.x + crack.width / 2}, ${crack.y - 20})`}>
                                    <rect
                                        x="-20"
                                        y="-10"
                                        width="40"
                                        height="14"
                                        fill={getCrackColor(crack.severity)}
                                        rx="7"
                                        opacity="0.9"
                                    />
                                    <text
                                        x="0"
                                        y="0"
                                        dy="3"
                                        textAnchor="middle"
                                        className="text-[9px] font-bold fill-white"
                                        style={{ fontFamily: 'monospace' }}
                                    >
                                        {crack.severity.toUpperCase()}
                                    </text>
                                </g>
                            </motion.g>
                        ))}
                    </svg>
                </div>

                {/* Ultrasonic Sensors */}
                <div className="relative mt-2 z-10">
                    {sensors.map((sensor) => (
                        <UltrasonicSensor
                            key={sensor.id}
                            x={sensor.x}
                            y={sensor.y}
                            active={sensor.active}
                            isTransmitting={isActive && sensor.active}
                            id={sensor.id}
                        />
                    ))}
                </div>

                {/* Measurement indicators with enhanced styling */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm">
                        <div className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wider">Length</div>
                        <div className="text-sm font-semibold text-zinc-200 font-mono">3.6 m</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm">
                        <div className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wider">Section</div>
                        <div className="text-sm font-semibold text-zinc-200 font-mono">400×400mm</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm">
                        <div className="text-xs text-zinc-500 font-medium mb-1 uppercase tracking-wider">Material</div>
                        <div className="text-sm font-semibold text-zinc-200">C30 Concrete</div>
                    </div>
                </div>
            </div>

            {/* Legend with enhanced styling */}
            <div className="mt-4 flex flex-wrap gap-6 justify-center text-xs bg-zinc-900/40 rounded-full px-6 py-2 border border-zinc-800/50 mx-auto w-fit backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-zinc-700 rounded-sm"></div>
                    <span className="text-zinc-500 font-medium">Structure</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>
                    <span className="text-zinc-500 font-medium">Sensor</span>
                </div>
                {detectedCracks.length > 0 && (
                    <>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                            <span className="text-zinc-500 font-medium">Low Severity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                            <span className="text-zinc-500 font-medium">Critical</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
