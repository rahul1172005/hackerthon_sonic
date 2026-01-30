import React from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Terminal, HelpCircle, AlertTriangle, BookOpen, ChevronRight, Play } from 'lucide-react';

export default function HelpPage() {
    return (
        <DashboardLayout>
            <div className="min-h-screen bg-black text-white selection:bg-zinc-700">


                {/* Background Effects */}
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                <main className="relative z-10 pt-24 pb-16 px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

                    {/* Main Content Column */}
                    <div className="space-y-12">

                        {/* Header */}
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center gap-3">
                                <BookOpen className="w-8 h-8 text-white" />
                                Documentation & Guide
                            </h1>
                            <p className="text-xl text-zinc-400">
                                Everything you need to set up, operate, and troubleshoot the NDT Analysis Dashboard.
                            </p>
                        </div>

                        {/* Section 1: Quick Start */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white border-l-4 border-white pl-4">1. Quick Start Guide</h2>
                            <div className="space-y-4">
                                <p className="text-zinc-400">To run the application locally, open your terminal and navigate to the project root.</p>

                                <div className="bg-[#0d1117] rounded-lg border border-zinc-800 p-4 font-mono text-sm relative group">
                                    <div className="absolute top-3 right-3 flex gap-1.5 opacity-50">
                                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                                    </div>
                                    <div className="text-zinc-500 select-none mb-2"># Install dependencies</div>
                                    <div className="text-white mb-4">$ npm install</div>

                                    <div className="text-zinc-500 select-none mb-2"># Start development server</div>
                                    <div className="text-white">$ npm run dev</div>
                                </div>
                                <p className="text-zinc-400 text-sm">
                                    The application will launch at <code className="text-white bg-zinc-900 px-1 py-0.5 rounded">http://localhost:3000</code>.
                                </p>
                            </div>
                        </section>

                        {/* Section 2: Operating Modes */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white border-l-4 border-white pl-4">2. Operating Modes</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <GuideCard
                                    title="Manual Mode"
                                    desc="For entering single data points. Best for spot checks and validating specific locations."
                                    steps={["Select 'Manual Entry' tab", "Input ToF, Velocity, and Attenuation", "Click 'Add Test Data'"]}
                                />
                                <GuideCard
                                    title="CSV Import"
                                    desc="Batch analysis of large datasets. Upload standard NDT logs for bulk processing."
                                    steps={["Export data from sensor software", "Ensure CSV matches template", "Drag & Drop file to upload"]}
                                />
                                <GuideCard
                                    title="Live Testing"
                                    desc="Real-time data stream. Requires connected hardware via Serial/USB."
                                    steps={["Connect Arduino via USB", "Grant browser serial permissions", "Click 'Start Recording'"]}
                                />
                            </div>
                        </section>

                        {/* Section 3: Troubleshooting */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white border-l-4 border-white pl-4">3. Troubleshooting</h2>
                            <div className="space-y-4">
                                <TroubleshootItem
                                    title="Port 3000 is in use"
                                    explanation="Another instance of the app is running."
                                    fix="Run `npx kill-port 3000` or simply restart your terminal."
                                />
                                <TroubleshootItem
                                    title="Serial Port Access Denied"
                                    explanation="Browser security blocked the USB connection."
                                    fix="Ensure you are using Chrome/Edge. Check that no other software (like Arduino IDE) is using the port."
                                />
                                <TroubleshootItem
                                    title="CSV Upload Failed"
                                    explanation="File format mismatch or missing headers."
                                    fix="Check the first row of your CSV. It must strictly follow the schema: ID, Timestamp, Location, etc."
                                />
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Navigation (On Page) */}
                    <aside className="hidden lg:block space-y-8 sticky top-32 h-fit">
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5" />
                                Support
                            </h3>
                            <p className="text-sm text-zinc-400 mb-6">Need technical assistance with the NDT Platform?</p>
                            <button className="w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-zinc-200 transition-colors text-sm">
                                Contact Engineering
                            </button>
                        </div>

                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                            <h3 className="font-bold text-white mb-4">Resources</h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2 text-zinc-400 hover:text-white cursor-pointer transition-colors">
                                    <Terminal className="w-4 h-4" /> API Documentation
                                </li>
                                <li className="flex items-center gap-2 text-zinc-400 hover:text-white cursor-pointer transition-colors">
                                    <Play className="w-4 h-4" /> Video Tutorials
                                </li>
                                <li className="flex items-center gap-2 text-zinc-400 hover:text-white cursor-pointer transition-colors">
                                    <AlertTriangle className="w-4 h-4" /> Known Issues
                                </li>
                            </ul>
                        </div>
                    </aside>

                </main>
            </div>
        </DashboardLayout >
    );
}

function GuideCard({ title, desc, steps }: any) {
    return (
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition-colors">
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-zinc-500 text-sm mb-4">{desc}</p>
            <ol className="space-y-2">
                {steps.map((step: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm text-zinc-300">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-900 text-zinc-500 flex items-center justify-center text-xs font-mono border border-zinc-800">{i + 1}</span>
                        {step}
                    </li>
                ))}
            </ol>
        </div>
    )
}

function TroubleshootItem({ title, explanation, fix }: any) {
    return (
        <div className="bg-zinc-950 border border-zinc-900 border-l-2 border-l-zinc-700 p-4 rounded-r-lg">
            <h4 className="text-white font-medium flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-white" />
                {title}
            </h4>
            <p className="text-zinc-400 text-sm mb-2">{explanation}</p>
            <div className="bg-zinc-900/50 p-2 rounded text-xs text-zinc-300 font-mono flex gap-2">
                <span className="text-white font-bold">FIX:</span> {fix}
            </div>
        </div>
    )
}
