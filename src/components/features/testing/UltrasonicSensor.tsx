import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Radio } from 'lucide-react';

interface UltrasonicSensorProps {
    x: number;
    y: number;
    active: boolean;
    isTransmitting: boolean;
    id: string;
}

export function UltrasonicSensor({ x, y, active, isTransmitting, id }: UltrasonicSensorProps) {
    return (
        <div
            className="absolute flex flex-col items-center"
            style={{ left: x - 15, top: y }}
        >
            {/* Sensor Housing */}
            <motion.div
                className={`relative w-8 h-8 rounded-xl border flex items-center justify-center backdrop-blur-sm shadow-lg ${active
                    ? 'bg-blue-600/90 border-blue-400/50 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                    : 'bg-zinc-800/90 border-zinc-700 text-zinc-500'
                    }`}
                animate={active ? {
                    boxShadow: [
                        '0 0 0 0 rgba(37, 99, 235, 0.4)',
                        '0 0 0 8px rgba(37, 99, 235, 0)',
                    ]
                } : {}}
                transition={{
                    duration: 1.5,
                    repeat: active ? Infinity : 0,
                    ease: "easeOut"
                }}
            >
                {active ? <Radio className="w-4 h-4" /> : <Zap className="w-4 h-4" />}

                {/* Transmission waves - Simplified and cleaner */}
                {isTransmitting && (
                    <>
                        {[0, 1].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute w-full h-full rounded-xl border border-blue-400/50"
                                initial={{ scale: 1, opacity: 0.8 }}
                                animate={{
                                    scale: [1, 2.5],
                                    opacity: [0.5, 0]
                                }}
                                transition={{
                                    duration: 1.5,
                                    delay: i * 0.4,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                }}
                            />
                        ))}
                    </>
                )}
            </motion.div>

            {/* Sensor Label */}
            <div className={`mt-2 text-[10px] font-mono px-1.5 py-0.5 rounded border tracking-wider ${active
                ? 'bg-blue-900/30 text-blue-300 border-blue-800/50'
                : 'bg-zinc-900/50 text-zinc-600 border-zinc-800'
                }`}>
                {id.replace('sensor-', 'S')}
            </div>

            {/* Connection line to structure */}
            <svg
                className="absolute top-8 left-1/2 transform -translate-x-1/2 -z-10"
                width="2"
                height="12"
            >
                <line
                    x1="1" y1="0" x2="1" y2="12"
                    stroke={active ? "#3b82f6" : "#52525b"}
                    strokeWidth="1.5"
                    strokeDasharray={active ? "0" : "2,2"}
                    opacity="0.8"
                />
            </svg>
        </div>
    );
}
