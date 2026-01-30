import React from 'react';
import { Activity, Database, FileText, Cpu, Zap, Shield, BarChart3, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardLayout } from '@/components/shared/DashboardLayout';

export default function FeaturesPage() {
    return (
        <DashboardLayout>
            <div className="min-h-screen bg-black text-white selection:bg-zinc-700">


                {/* Background Effects */}
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                <main className="relative z-10 pt-24 pb-16 px-6 max-w-7xl mx-auto space-y-24">

                    {/* Hero Section */}
                    <div className="text-center space-y-6 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm font-medium mb-4">
                            <Zap className="w-4 h-4" />
                            <span>v2.0 Release Features</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
                            Advanced NDT Intelligence
                        </h1>
                        <p className="text-xl text-zinc-400 leading-relaxed">
                            A comprehensive suite of tools designed for precision structural health monitoring,
                            real-time sensor analysis, and enterprise-grade reporting.
                        </p>
                    </div>

                    {/* Core Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Activity}
                            title="Live Sensor Stream"
                            description="Connect directly to ultrasonic hardware via Serial/USB. Visualize Time of Fast (ToF), attenuation, and signal velocity in real-time with sub-millisecond latency."
                            color="text-white"
                            bg="bg-zinc-900"
                            border="border-zinc-800"
                        />
                        <FeatureCard
                            icon={Database}
                            title="Automated Analysis"
                            description="Proprietary algorithms instantly classify structural integrity. Inputs like signal-to-noise ratio (SNR) and frequency distortion are processed to generate immediate Health Scores."
                            color="text-white"
                            bg="bg-zinc-900"
                            border="border-zinc-800"
                        />
                        <FeatureCard
                            icon={FileText}
                            title="CSV Batch Processing"
                            description="Drag-and-drop support for legacy data. Import thousands of test points from existing CSV records and apply modern analytics retrospectively."
                            color="text-white"
                            bg="bg-zinc-900"
                            border="border-zinc-800"
                        />
                        <FeatureCard
                            icon={ScanLine}
                            title="Defect Detection"
                            description="High-fidelity flaw visualization. Detect voids, cracks, and delamination with precision depth mapping and defect sizing tools."
                            color="text-white"
                            bg="bg-zinc-900"
                            border="border-zinc-800"
                        />
                        <FeatureCard
                            icon={BarChart3}
                            title="Dynamic Reporting"
                            description="Generate compliance-ready PDF and CSV reports. Includes detailed audit trails of all testing parameters, timestamps, and operator notes."
                            color="text-white"
                            bg="bg-zinc-900"
                            border="border-zinc-800"
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Enterprise Security"
                            description="Role-based access control (RBAC) ensures data integrity. Secure operational logs and immutable test records come standard."
                            color="text-white"
                            bg="bg-zinc-900"
                            border="border-zinc-800"
                        />
                    </div>

                    {/* Technical Specs Section */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-zinc-800/20 blur-3xl pointer-events-none"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold flex items-center gap-3">
                                    <Cpu className="w-8 h-8 text-white" />
                                    Technical Specifications
                                </h2>
                                <p className="text-zinc-400">
                                    Built on a modern stack ensuring maximizing performance and compatibility.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        { label: 'Sample Rate', value: 'Up to 200MHz' },
                                        { label: 'Data Resolution', value: '16-bit High Precision' },
                                        { label: 'Supported Protocols', value: 'UART, I2C, SPI via Serial' },
                                        { label: 'Export Formats', value: 'CSV, JSON, PDF' },
                                        { label: 'Platform', value: 'Web (Cross-browser), PWA Capable' }
                                    ].map((spec, i) => (
                                        <li key={i} className="flex justify-between items-center border-b border-zinc-800 pb-2">
                                            <span className="text-zinc-500">{spec.label}</span>
                                            <span className="text-zinc-200 font-mono">{spec.value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="relative">
                                <div className="aspect-square rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-500 ease-out">
                                    <div className="space-y-4 font-mono text-sm text-zinc-400">
                                        <div className="flex gap-2 text-zinc-400">
                                            <span>$</span>
                                            <span className="text-white">init_system --mode=live</span>
                                        </div>
                                        <div className="text-zinc-500">✓ Sensors Calibrated</div>
                                        <div className="text-zinc-500">✓ Hardware Link Established (COM3)</div>
                                        <div className="text-zinc-500">✓ AI Model Loaded (v2.4.1)</div>
                                        <div className="border-t border-zinc-800 my-4" />
                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                            <div className="bg-zinc-900 p-3 rounded border border-zinc-800">
                                                <div className="text-zinc-500">Velocity</div>
                                                <div className="text-white text-lg">4,250 m/s</div>
                                            </div>
                                            <div className="bg-zinc-900 p-3 rounded border border-zinc-800">
                                                <div className="text-zinc-500">Signal Quality</div>
                                                <div className="text-zinc-300 text-lg">98.5%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </DashboardLayout >
    );
}

function FeatureCard({ icon: Icon, title, description, color, bg, border }: any) {
    return (
        <div className={cn(
            "group relative p-8 rounded-2xl bg-zinc-950 border transition-all duration-300 hover:translate-y-[-5px]",
            "hover:shadow-2xl hover:bg-zinc-900/80",
            border,
            "border-zinc-800" // Default border overridden by prop if specific color needed, but usually just zinc-800 is cleaner with a colored glow
        )}>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", bg)}>
                <Icon className={cn("w-6 h-6", color)} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-100 transition-colors">{title}</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
                {description}
            </p>
        </div>
    );
}
