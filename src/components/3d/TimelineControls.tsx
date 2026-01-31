'use client';

import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Download } from 'lucide-react';

interface TimelineControlsProps {
  onPlayPause: () => void;
  onReset: () => void;
  onExport: () => void;
  isPlaying: boolean;
  progress: number;
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
  const timelineEvents = [
    { time: 0, label: '2012', description: 'Construction Phase' },
    { time: 0.25, label: '2018', description: 'First Cracks' },
    { time: 0.5, label: 'Feb 2019', description: 'IRIS Inspection' },
    { time: 0.75, label: 'Aug 2020', description: 'Critical State' },
    { time: 1, label: 'Aug 24', description: 'Collapse' },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-4xl pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-xl p-5"
      >
        {/* Timeline scrubber */}
        <div className="mb-8 pt-2">
          <div className="relative h-1 bg-neutral-800 rounded-full overflow-hidden">
            {/* Progress bar */}
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-500 to-sky-400"
              style={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.15 }}
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
                  className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-200 ${progress >= event.time
                      ? 'bg-sky-400 border-sky-400 scale-110'
                      : 'bg-neutral-900 border-neutral-600'
                    }`}
                />

                {/* Event label */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <div
                    className={`text-xs font-mono font-medium transition-colors ${progress >= event.time ? 'text-white' : 'text-neutral-600'
                      }`}
                  >
                    {event.label}
                  </div>
                  <div
                    className={`text-[10px] text-center mt-0.5 transition-colors ${progress >= event.time ? 'text-neutral-400' : 'text-neutral-700'
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
          <div className="flex items-center gap-2.5">
            <button
              onClick={onPlayPause}
              className="
                w-10 h-10 rounded-lg
                bg-sky-500 hover:bg-sky-400
                flex items-center justify-center
                transition-all duration-150
                hover:scale-105 active:scale-95
              "
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-neutral-900" strokeWidth={2.5} />
              ) : (
                <Play className="w-4 h-4 text-neutral-900 ml-0.5" strokeWidth={2.5} />
              )}
            </button>

            <button
              onClick={onReset}
              className="
                w-10 h-10 rounded-lg
                bg-neutral-800 hover:bg-neutral-700
                border border-neutral-700
                flex items-center justify-center
                transition-all duration-150
                hover:scale-105 active:scale-95
              "
            >
              <RotateCcw className="w-4 h-4 text-neutral-400" strokeWidth={2} />
            </button>

            <div className="h-6 w-px bg-neutral-700 mx-1.5" />

            {/* Speed controls */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-neutral-500 uppercase tracking-wide mr-1">Speed</span>
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  className={`
                    px-2.5 py-1 rounded text-xs font-mono
                    transition-all duration-150
                    ${speed === s
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                      : 'bg-neutral-800 text-neutral-500 border border-neutral-700 hover:border-neutral-600 hover:text-neutral-400'
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
              px-4 py-2 rounded-lg
              bg-white hover:bg-neutral-100
              flex items-center gap-2
              transition-all duration-150
              hover:scale-[1.02] active:scale-[0.98]
            "
          >
            <Download className="w-4 h-4 text-neutral-900" strokeWidth={2} />
            <span className="text-sm font-medium text-neutral-900">Export Report</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
