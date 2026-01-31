import React from 'react';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, Activity, FileText, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

// Mock data for the specific sessions requested
const sessionData: Record<string, {
    title: string;
    location: string;
    date: string;
    status: 'Active' | 'Completed' | 'Maintenance';
    description: string;
    details: {
        structureType: string;
        material: string;
        lastInspection: string;
        riskLevel: 'Low' | 'Medium' | 'High';
        inspector: string;
    };
    stats: {
        healthScore: number;
        defectsDetected: number;
        avgToF: string;
    }
}> = {
    'bridge-pillar-a4': {
        title: 'Bridge Pillar A4',
        location: 'Golden Gate Ext., Sector 4',
        date: '2025-10-12',
        status: 'Maintenance',
        description: 'Reinforced concrete pillar supporting the main decorative span. Constructed in 2018. Recent ultrasonic analysis indicates minor surface cracking near the base, likely due to thermal expansion cycles.',
        details: {
            structureType: 'Support Pillar',
            material: 'Reinforced Concrete (C45)',
            lastInspection: '2025-10-10',
            riskLevel: 'Medium',
            inspector: 'Raja Admin'
        },
        stats: {
            healthScore: 82,
            defectsDetected: 3,
            avgToF: '45.2 µs'
        }
    },
    'tunnel-section-3n-b': {
        title: 'Tunnel Section 3N-B',
        location: 'Northbound Metro Line, Km 3.2',
        date: '2025-11-05',
        status: 'Active',
        description: 'Northbound tunnel segment, approximately 300m from the main entrance. Lining consists of shotcrete with steel rib reinforcements. Sensors have detected moderate water seepage in quadrant 2, requiring ongoing monitoring.',
        details: {
            structureType: 'Tunnel Lining',
            material: 'Shotcrete & Steel',
            lastInspection: '2025-11-01',
            riskLevel: 'Low',
            inspector: 'Sarah Tech'
        },
        stats: {
            healthScore: 94,
            defectsDetected: 1,
            avgToF: '38.5 µs'
        }
    },
    'highway-overpass-9': {
        title: 'Highway Overpass 9',
        location: 'Interstate 95 Junction',
        date: '2025-09-20',
        status: 'Active',
        description: 'Pre-stressed concrete box girder overpass subject to high daily traffic loads. Expansion joints are being closely monitored for wear. Acoustic emission testing shows normal structural behavior under load.',
        details: {
            structureType: 'Overpass / Girder',
            material: 'Pre-stressed Concrete',
            lastInspection: '2025-09-15',
            riskLevel: 'Low',
            inspector: 'Mike Engineer'
        },
        stats: {
            healthScore: 98,
            defectsDetected: 0,
            avgToF: '41.0 µs'
        }
    },
    'foundation-grid-12': {
        title: 'Foundation Grid 12',
        location: 'Skyline Tower Site',
        date: '2025-12-01',
        status: 'Completed',
        description: 'Deep pile foundation grid for the new high-rise structure. Soil grouping identified as Type C. Settlement sensors are active and reporting stable values. sonic integrity testing confirmed pile continuity.',
        details: {
            structureType: 'Deep Foundation',
            material: 'Concrete Piles',
            lastInspection: '2025-11-28',
            riskLevel: 'Low',
            inspector: 'GeoTeam Alpha'
        },
        stats: {
            healthScore: 100,
            defectsDetected: 0,
            avgToF: '52.1 µs'
        }
    }
};

export default function SessionDetailPage({ params }: { params: { id: string } }) {
    const id = params.id;
    const data = sessionData[id];

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
                <h1 className="text-2xl font-bold mb-4">Session Not Found</h1>
                <p className="text-zinc-400 mb-6">The requested session "{id}" does not exist.</p>
                <Link href="/dashboard">
                    <Button variant="outline" className="text-black bg-white hover:bg-zinc-200">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white p-6 md:p-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10 space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <Link href="/dashboard" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors mb-2">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold tracking-tight text-white">{data.title}</h1>
                                <Badge variant={data.status === 'Active' ? 'default' : data.status === 'Maintenance' ? 'destructive' : 'secondary'} className="text-sm">
                                    {data.status}
                                </Badge>
                            </div>
                            <div className="flex items-center text-zinc-400 text-sm gap-4">
                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {data.location}</span>
                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {data.date}</span>
                            </div>
                        </div>
                        <Button className="bg-white text-black hover:bg-zinc-200">
                            <FileText className="w-4 h-4 mr-2" />
                            Generate Report
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Details & Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    <Activity className="w-5 h-5" />
                                    Session Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-zinc-300 leading-relaxed">
                                <p>{data.description}</p>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Card className="bg-zinc-900/30 border-zinc-800">
                                <CardContent className="p-6 text-center">
                                    <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Health Score</p>
                                    <div className="text-3xl font-bold text-white">{data.stats.healthScore}/100</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-zinc-900/30 border-zinc-800">
                                <CardContent className="p-6 text-center">
                                    <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Defects Found</p>
                                    <div className="text-3xl font-bold text-red-400">{data.stats.defectsDetected}</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-zinc-900/30 border-zinc-800">
                                <CardContent className="p-6 text-center">
                                    <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Avg ToF</p>
                                    <div className="text-3xl font-bold text-blue-400">{data.stats.avgToF}</div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column: Key Details */}
                    <div className="space-y-6">
                        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-white text-lg">Specifications</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between border-b border-zinc-800 pb-2">
                                    <span className="text-zinc-500 text-sm">Structure Type</span>
                                    <span className="text-zinc-200 text-sm font-medium">{data.details.structureType}</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-800 pb-2">
                                    <span className="text-zinc-500 text-sm">Material</span>
                                    <span className="text-zinc-200 text-sm font-medium">{data.details.material}</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-800 pb-2">
                                    <span className="text-zinc-500 text-sm">Last Inspection</span>
                                    <span className="text-zinc-200 text-sm font-medium">{data.details.lastInspection}</span>
                                </div>
                                <div className="flex justify-between border-b border-zinc-800 pb-2">
                                    <span className="text-zinc-500 text-sm">Risk Level</span>
                                    <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${data.details.riskLevel === 'Low' ? 'bg-green-500/10 text-green-400' :
                                            data.details.riskLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                                'bg-red-500/10 text-red-400'
                                        }`}>
                                        {data.details.riskLevel}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="text-zinc-500 text-sm">Inspector</span>
                                    <span className="text-zinc-200 text-sm font-medium">{data.details.inspector}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {data.stats.defectsDetected > 0 && (
                            <Card className="bg-red-950/20 border-red-900/50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-red-400 flex items-center gap-2 text-sm">
                                        <AlertTriangle className="w-4 h-4" />
                                        Critical Alert
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-red-300/80 text-xs">
                                        {data.stats.defectsDetected} defect(s) detected during the last scan. Immediate review of sector B-2 is recommended.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
