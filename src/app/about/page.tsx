import React from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Target, Users, Code2, Globe, ArrowRight, Zap } from 'lucide-react';

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
                        <h1 className="text-6xl font-bold tracking-tighter mb-8">
                            Building the future of <br />
                            <span className="text-white">
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
                        <div className="space-y-6">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold">Our Mission</h2>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                To replace subjective, manual inspections with objective, data-driven decisions. By digitizing the Non-Destructive Testing (NDT) workflow, we enable engineers to detect flaws earlier, assess risks accurately, and maintain infrastructure safely.
                            </p>
                        </div>
                        <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-start gap-4">
                                    <span className="text-4xl font-bold text-white">01</span>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">Digitize</h3>
                                        <p className="text-zinc-500">Convert analog signals to digital intelligence.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="text-4xl font-bold text-white">02</span>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">Analyze</h3>
                                        <p className="text-zinc-500">Apply AI to detect patterns and defects.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="text-4xl font-bold text-white">03</span>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">Preserve</h3>
                                        <p className="text-zinc-500">Extend asset lifespan through predictive maintenance.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tech Stack Grid */}
                    <div className="mb-32">
                        <h2 className="text-3xl font-bold mb-12 text-center">Powered by Modern Technology</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <TechItem icon={Code2} label="Next.js 15" desc="React Framework" />
                            <TechItem icon={Globe} label="Tailwind CSS" desc="Utility-First Design" />
                            <TechItem icon={Zap} label="Arduino" desc="Hardware Interface" />
                            <TechItem icon={Users} label="Recharts" desc="Data Visualization" />
                        </div>
                    </div>

                    {/* Team / Story */}
                    <div className="bg-gradient-to-br from-zinc-900 via-black to-zinc-900 rounded-3xl p-12 border border-zinc-800 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                            <h2 className="text-3xl font-bold text-white">Ready to modernize your testing?</h2>
                            <p className="text-zinc-400">
                                Join the new standard of Non-Destructive Testing. Precise, portable, and powerful.
                            </p>
                            <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-zinc-200 transition-colors inline-flex items-center gap-2">
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
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:border-zinc-700 transition-colors group">
            <Icon className="w-8 h-8 text-zinc-500 group-hover:text-white transition-colors mb-4" />
            <h3 className="font-bold text-white mb-1">{label}</h3>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">{desc}</p>
        </div>
    )
}
