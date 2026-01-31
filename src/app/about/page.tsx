import React from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Target, Users, Code2, Globe, ArrowRight, Zap, Shield, ChevronRight } from 'lucide-react';

export default function AboutPage() {
    return (
        <DashboardLayout>
            <div className="min-h-screen bg-black text-white selection:bg-zinc-700">


                {/* Background Effects */}
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                <div className="fixed bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-zinc-900/10 to-transparent pointer-events-none"></div>

                <main className="relative z-10 pt-32 pb-16 px-6 max-w-5xl mx-auto">

                    {/* Header */}
                    <div className="mb-24">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium mb-6">
                            <Shield className="w-3 h-3" />
                            <span>Enterprise Grade NDT</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
                            Building the future of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                                Infrastructure Intelligence
                            </span>
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
                            We merge advanced sensor hardware with next-generation software to provide real-time, actionable insights into structural health.
                            Safety is not just a goal—it's a data point.
                        </p>
                    </div>

                    {/* Mission Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32 items-center">
                        <div className="space-y-8">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-xl shadow-zinc-900/50">
                                <Target className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold">Our Mission</h2>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                To replace subjective, manual inspections with objective, data-driven decisions. By digitizing the Non-Destructive Testing (NDT) workflow, we enable engineers to detect flaws earlier, assess risks accurately, and maintain infrastructure safely.
                            </p>
                            <div className="flex gap-4 pt-4">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-white">99.9%</span>
                                    <span className="text-sm text-zinc-500 uppercase tracking-wider">Accuracy</span>
                                </div>
                                <div className="w-px h-12 bg-zinc-800"></div>
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-white">2.5x</span>
                                    <span className="text-sm text-zinc-500 uppercase tracking-wider">Faster Reporting</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 p-1 rounded-3xl border border-zinc-800">
                            <div className="bg-zinc-950/80 rounded-[22px] p-8 space-y-8 backdrop-blur-sm">
                                <div className="flex items-start gap-5 group">
                                    <span className="text-4xl font-bold text-zinc-700 group-hover:text-white transition-colors duration-300">01</span>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">Digitize</h3>
                                        <p className="text-zinc-500 group-hover:text-zinc-400 transition-colors">Convert analog sensor signals to high-fidelity digital intelligence.</p>
                                    </div>
                                </div>
                                <div className="w-full h-px bg-zinc-900"></div>
                                <div className="flex items-start gap-5 group">
                                    <span className="text-4xl font-bold text-zinc-700 group-hover:text-white transition-colors duration-300">02</span>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">Analyze</h3>
                                        <p className="text-zinc-500 group-hover:text-zinc-400 transition-colors">Apply advanced AI algorithms to detect micropatterns and defects.</p>
                                    </div>
                                </div>
                                <div className="w-full h-px bg-zinc-900"></div>
                                <div className="flex items-start gap-5 group">
                                    <span className="text-4xl font-bold text-zinc-700 group-hover:text-white transition-colors duration-300">03</span>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">Preserve</h3>
                                        <p className="text-zinc-500 group-hover:text-zinc-400 transition-colors">Extend critical asset lifespan through predictive maintenance.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Our Journey Section */}
                    <div className="mb-32">
                        <h2 className="text-3xl font-bold mb-12 text-center">Our Journey</h2>
                        <div className="relative border-l border-zinc-800 ml-6 space-y-12">
                            <div className="relative pl-12 group">
                                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-zinc-800 group-hover:bg-white transition-colors duration-300"></div>
                                <div className="space-y-2">
                                    <span className="text-sm font-mono text-zinc-500">2024</span>
                                    <h3 className="text-xl font-bold text-white">The Inception</h3>
                                    <p className="text-zinc-400 max-w-lg">Started as a research project at MIT to solve critical infrastructure failures using low-cost sensors.</p>
                                </div>
                            </div>
                            <div className="relative pl-12 group">
                                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-zinc-800 group-hover:bg-white transition-colors duration-300"></div>
                                <div className="space-y-2">
                                    <span className="text-sm font-mono text-zinc-500">2025</span>
                                    <h3 className="text-xl font-bold text-white">First Deployment</h3>
                                    <p className="text-zinc-400 max-w-lg">Deployed successfully on the Golden Gate Bridge, analyzing over 1M+ data points daily.</p>
                                </div>
                            </div>
                            <div className="relative pl-12 group">
                                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                                <div className="space-y-2">
                                    <span className="text-sm font-mono text-white">2026</span>
                                    <h3 className="text-xl font-bold text-white">Global Scale</h3>
                                    <p className="text-zinc-400 max-w-lg">Launching v2.0 Enterprise Suite. Expanding to rail, tunnel, and pipeline monitoring worldwide.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tech Stack Grid */}
                    <div className="mb-32">
                        <h2 className="text-3xl font-bold mb-16 text-center">Powered by Modern Technology</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <TechItem icon={Code2} label="Next.js 15" desc="React Framework" />
                            <TechItem icon={Globe} label="Tailwind CSS" desc="Utility-First Design" />
                            <TechItem icon={Zap} label="Arduino" desc="Hardware Interface" />
                            <TechItem icon={Users} label="Recharts" desc="Data Visualization" />
                        </div>
                    </div>

                    {/* Team / Story */}
                    <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black rounded-[32px] p-12 border border-zinc-800 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-all duration-500"></div>
                        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                            <h2 className="text-4xl font-bold text-white">Ready to modernize your testing?</h2>
                            <p className="text-zinc-400 text-lg">
                                Join the new standard of Non-Destructive Testing. Precise, portable, and powerful.
                            </p>
                            <button className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 shadow-lg hover:shadow-white/20">
                                Explore the Dashboard <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </main>
            </div>
        </DashboardLayout >
    );
}

function TechItem({ icon: Icon, label, desc }: any) {
    return (
        <div className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-zinc-800 group-hover:border-zinc-700">
                <Icon className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-white mb-2 text-lg">{label}</h3>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">{desc}</p>
        </div>
    )
}
