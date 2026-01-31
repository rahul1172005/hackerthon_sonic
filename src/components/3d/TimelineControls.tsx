'use client';

import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TimelineControlsProps {
  onPlayPause: () => void;
  onReset: () => void;
  onExport: () => void;
  isPlaying: boolean;
  progress: number; // 0 to 1
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const TimelineControls = ({
  onPlayPause,
  onReset,
  onExport,
  isPlaying,
  progress,
  speed,
  onSpeedChange,
}: TimelineControlsProps) => {
  const [timelineEvents, setTimelineEvents] = useState([
    { time: 0, label: '2012-2014', description: 'Construction (substandard concrete)' },
    { time: 0.25, label: '2018-2019', description: 'First cracks reported' },
    { time: 0.5, label: 'Feb 2019', description: 'IRIS AI Inspection (hypothetical)' },
    { time: 0.75, label: 'Aug 2020', description: 'Critical crack detected' },
    { time: 1, label: 'Aug 24, 2020', description: 'Building collapse' },
  ]);

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#141414]/80 backdrop-blur-xl border border-[#ffffff]/10 rounded-2xl p-6"
      >
        {/* Timeline scrubber */}
        <div className="mb-6">
          <div className="relative h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
            {/* Progress bar */}
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00d4ff] to-[#ff0051]"
              style={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.2 }}
            />

            {/* Event markers */}
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${event.time * 100}%` }}
              >
                {/* Marker dot */}
                <div
                  className={`w-3 h-3 rounded-full border-2 transition-colors ${
                    progress >= event.time
                      ? 'bg-[#00d4ff] border-[#00d4ff]'
                      : 'bg-[#141414] border-[#525252]'
                  }`}
                />

                {/* Event label */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <div
                    className={`text-xs font-mono transition-colors ${
                      progress >= event.time ? 'text-[#ffffff]' : 'text-[#525252]'
                    }`}
                  >
                    {event.label}
                  </div>
                  <div
                    className={`text-[10px] text-center mt-1 transition-colors ${
                      progress >= event.time ? 'text-[#a3a3a3]' : 'text-[#525252]'
                    }`}
                  >
                    {event.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Left - Playback controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={onPlayPause}
              className="
                w-12 h-12 rounded-full
                bg-[#00d4ff] hover:bg-[#00b8e6]
                flex items-center justify-center
                transition-all duration-200
                hover:scale-105 active:scale-95
              "
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-[#0a0a0a]" fill="#0a0a0a" />
              ) : (
                <Play className="w-5 h-5 text-[#0a0a0a] ml-0.5" fill="#0a0a0a" />
              )}
            </button>

            <button
              onClick={onReset}
              className="
                w-12 h-12 rounded-full
                bg-[#1f1f1f] hover:bg-[#2a2a2a]
                border border-[#ffffff]/10
                flex items-center justify-center
                transition-all duration-200
                hover:scale-105 active:scale-95
              "
            >
              <RotateCcw className="w-5 h-5 text-[#a3a3a3]" />
            </button>

            <div className="h-8 w-px bg-[#ffffff]/10 mx-2" />

            {/* Speed controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#a3a3a3] uppercase tracking-wide">Speed</span>
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-mono
                    transition-all duration-200
                    ${
                      speed === s
                        ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30'
                        : 'bg-[#1f1f1f] text-[#a3a3a3] border border-[#ffffff]/10 hover:border-[#ffffff]/20'
                    }
                  `}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Right - Export button */}
          <button
            onClick={onExport}
            className="
              px-5 py-2.5 rounded-lg
              bg-[#ffffff] hover:bg-[#e6e6e6]
              flex items-center gap-2
              transition-all duration-200
              hover:scale-105 active:scale-95
            "
          >
            <Download className="w-4 h-4 text-[#0a0a0a]" />
            <span className="text-sm font-semibold text-[#0a0a0a]">Generate Report</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
