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
      const duration = 1500;
      const steps = 40;
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

  const statusConfig = {
    safe: {
      bg: 'bg-emerald-950/40',
      text: 'text-emerald-400',
      border: 'border-emerald-800/50',
      label: 'STABLE'
    },
    warning: {
      bg: 'bg-amber-950/40',
      text: 'text-amber-400',
      border: 'border-amber-800/50',
      label: 'WARNING'
    },
    critical: {
      bg: 'bg-red-950/40',
      text: 'text-red-400',
      border: 'border-red-800/50',
      label: 'CRITICAL'
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-neutral-900/80 backdrop-blur-lg border border-neutral-800 rounded-lg p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-neutral-400 text-xs uppercase tracking-widest font-medium">
          {label}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded ${config.bg} ${config.text} ${config.border} border font-mono`}>
          {config.label}
        </span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-4xl text-white font-mono font-semibold tabular-nums tracking-tight">
          {displayValue}
        </span>
        {unit && <span className="text-lg text-neutral-500 font-mono">{unit}</span>}
      </div>
    </motion.div>
  );
};

interface ProgressBarProps {
  label: string;
  value: number;
  color?: string;
  delay?: number;
}

const ProgressBar = ({ label, value, color = '#0ea5e9', delay = 0 }: ProgressBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-neutral-900/80 backdrop-blur-lg border border-neutral-800 rounded-lg p-5"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-neutral-400 text-xs uppercase tracking-widest font-medium">
          {label}
        </span>
        <span className="text-white text-sm font-mono font-semibold">{value}%</span>
      </div>

      <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: delay + 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
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
  const isUrgent = months <= 6;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`
        backdrop-blur-lg rounded-lg p-5 relative overflow-hidden
        ${isUrgent
          ? 'bg-red-950/50 border border-red-900/60'
          : 'bg-neutral-900/80 border border-neutral-800'
        }
      `}
    >
      <div className="relative z-10">
        <span className={`text-xs uppercase tracking-widest font-medium block mb-3 ${isUrgent ? 'text-red-400' : 'text-neutral-400'}`}>
          Predicted Time to Failure
        </span>

        <div className="flex items-baseline gap-2">
          <span className={`text-5xl font-mono font-bold tabular-nums ${isUrgent ? 'text-red-400' : 'text-white'}`}>
            {months}
          </span>
          <span className={`text-lg font-mono ${isUrgent ? 'text-red-400/70' : 'text-neutral-500'}`}>months</span>
        </div>

        <p className="text-neutral-500 text-xs mt-3">
          Based on crack progression analysis
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
    <div className="absolute inset-0 pointer-events-none p-6">
      {/* Top left - Main metrics */}
      <div className="absolute top-20 left-6 w-72 space-y-3 pointer-events-auto">
        <MetricCard
          label="Structural Integrity"
          value={structuralIntegrity}
          unit="%"
          status={structuralIntegrity < 50 ? 'critical' : structuralIntegrity < 70 ? 'warning' : 'safe'}
          delay={0}
        />

        <ProgressBar
          label="Crack Severity"
          value={crackSeverity}
          color={crackSeverity > 70 ? '#dc2626' : crackSeverity > 40 ? '#d97706' : '#10b981'}
          delay={0.1}
        />
      </div>

      {/* Top right - Building info */}
      <div className="absolute top-20 right-6 w-72 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-neutral-900/80 backdrop-blur-lg border border-neutral-800 rounded-lg p-5"
        >
          <h3 className="text-white text-base font-semibold mb-4">Building Information</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Name</span>
              <span className="text-white font-medium">Tariq Garden</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Location</span>
              <span className="text-neutral-300 font-mono text-xs">Mahad, Maharashtra</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Structure</span>
              <span className="text-neutral-300 font-mono text-xs">G+5 RCC Frame</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Age</span>
              <span className="text-neutral-300 font-mono text-xs">6 years</span>
            </div>
            <div className="h-px bg-neutral-800 my-2" />
            <div className="flex justify-between">
              <span className="text-neutral-500">Critical Point</span>
              <span className="text-red-400 font-mono text-xs font-medium">Column C3 (GF)</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom right - Time to failure */}
      <div className="absolute bottom-28 right-6 w-72 pointer-events-auto">
        <TimeToFailure months={timeToFailure} delay={0.2} />
      </div>

      {/* Bottom left - Legend */}
      <div className="absolute bottom-28 left-6 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-neutral-900/80 backdrop-blur-lg border border-neutral-800 rounded-lg p-4"
        >
          <span className="text-neutral-500 text-xs uppercase tracking-widest font-medium block mb-3">Legend</span>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-neutral-300 rounded-full" />
              <span className="text-neutral-400">Structure Frame</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-red-500 rounded-full" />
              <span className="text-neutral-400">Critical Crack</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-amber-500 rounded-full" />
              <span className="text-neutral-400">Moderate Crack</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
