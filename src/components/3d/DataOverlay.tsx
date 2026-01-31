'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MetricCardProps {
  label: string;
  value: number | string;
  unit?: string;
  status?: 'safe' | 'warning' | 'critical';
  delay?: number;
}

const MetricCard = ({ label, value, unit, status = 'safe', delay = 0 }: MetricCardProps) => {
  const [displayValue, setDisplayValue] = useState(typeof value === 'number' ? 0 : value);

  useEffect(() => {
    if (typeof value === 'number') {
      // Animated counter
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [value]);

  const statusColors = {
    safe: 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30',
    warning: 'bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/30',
    critical: 'bg-[#ff0051]/10 text-[#ff0051] border-[#ff0051]/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="
        bg-[#141414]/60 backdrop-blur-xl
        border border-[#ffffff]/10
        rounded-lg p-6
        hover:border-[#00d4ff]/30 transition-colors duration-300
      "
    >
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-[#a3a3a3] text-xs uppercase tracking-[0.1em] font-medium">
          {label}
        </span>
        <span
          className={`
          text-xs px-2 py-1 rounded border font-mono
          ${statusColors[status]}
        `}
        >
          {status.toUpperCase()}
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-5xl text-[#ffffff] font-mono font-bold tabular-nums">
          {displayValue}
        </span>
        {unit && <span className="text-lg text-[#525252] font-mono">{unit}</span>}
      </div>
    </motion.div>
  );
};

interface ProgressBarProps {
  label: string;
  value: number; // 0 to 100
  color?: string;
  delay?: number;
}

const ProgressBar = ({ label, value, color = '#00d4ff', delay = 0 }: ProgressBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#141414]/60 backdrop-blur-xl border border-[#ffffff]/10 rounded-lg p-6"
    >
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[#a3a3a3] text-xs uppercase tracking-[0.1em] font-medium">
          {label}
        </span>
        <span className="text-[#ffffff] text-sm font-mono font-bold">{value}%</span>
      </div>

      <div className="h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: delay + 0.3, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
};

interface TimeToFailureProps {
  months: number;
  delay?: number;
}

const TimeToFailure = ({ months, delay = 0 }: TimeToFailureProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="
        bg-[#ff0051]/5 backdrop-blur-xl
        border border-[#ff0051]/30
        rounded-lg p-6
        relative overflow-hidden
      "
    >
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-[#ff0051]/10"
      />

      <div className="relative z-10">
        <span className="text-[#ff0051] text-xs uppercase tracking-[0.1em] font-medium block mb-4">
          ⚠️ TIME TO FAILURE
        </span>

        <div className="flex items-baseline gap-3">
          <span className="text-6xl text-[#ff0051] font-mono font-bold tabular-nums">
            {months}
          </span>
          <span className="text-xl text-[#ff0051]/70 font-mono">MONTHS</span>
        </div>

        <p className="text-[#a3a3a3] text-xs mt-4">
          Predicted collapse window based on current crack progression
        </p>
      </div>
    </motion.div>
  );
};

interface DataOverlayProps {
  structuralIntegrity: number;
  crackSeverity: number;
  timeToFailure: number;
  riskLevel: 'safe' | 'warning' | 'critical';
}

export const DataOverlay = ({
  structuralIntegrity = 67,
  crackSeverity = 73,
  timeToFailure = 18,
  riskLevel = 'warning',
}: DataOverlayProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top left - Main metrics */}
      <div className="absolute top-8 left-8 w-80 space-y-4 pointer-events-auto">
        <MetricCard
          label="Structural Integrity"
          value={structuralIntegrity}
          unit="%"
          status={structuralIntegrity < 50 ? 'critical' : structuralIntegrity < 70 ? 'warning' : 'safe'}
          delay={0}
        />

        <ProgressBar
          label="Crack Severity Score"
          value={crackSeverity}
          color={crackSeverity > 70 ? '#ff0051' : crackSeverity > 40 ? '#fbbf24' : '#10b981'}
          delay={0.1}
        />
      </div>

      {/* Top right - Building info */}
      <div className="absolute top-8 right-8 w-80 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#141414]/60 backdrop-blur-xl border border-[#ffffff]/10 rounded-lg p-6"
        >
          <h3 className="text-[#ffffff] text-lg font-semibold mb-4">Tariq Garden</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#a3a3a3]">Location</span>
              <span className="text-[#ffffff] font-mono">Mahad, Maharashtra</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a3a3a3]">Type</span>
              <span className="text-[#ffffff] font-mono">G+5 RCC Frame</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a3a3a3]">Age</span>
              <span className="text-[#ffffff] font-mono">6 years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a3a3a3]">Critical Column</span>
              <span className="text-[#ff0051] font-mono font-bold">C3 (Ground Floor)</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom center - Time to failure */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-96 pointer-events-auto">
        <TimeToFailure months={timeToFailure} delay={0.3} />
      </div>

      {/* Bottom left - Legend */}
      <div className="absolute bottom-8 left-8 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-[#141414]/60 backdrop-blur-xl border border-[#ffffff]/10 rounded-lg p-4"
        >
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#ffffff] opacity-80 rounded-sm" />
              <span className="text-[#a3a3a3]">Building Structure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#ff0051] rounded-sm" />
              <span className="text-[#a3a3a3]">Critical Crack</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#fbbf24] rounded-sm" />
              <span className="text-[#a3a3a3]">Moderate Crack</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
