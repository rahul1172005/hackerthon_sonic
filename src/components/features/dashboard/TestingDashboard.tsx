'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Activity, ArrowUpRight, Aperture, Layers, ScanLine,
    Share2, Cpu, FileText, Settings, ShieldCheck,
    Video as VideoIcon, Box, Upload, Database, Download,
    AlertCircle, CheckCircle, BarChart3, Play, Square, RotateCcw, AlertTriangle,
    Zap, FileSpreadsheet, RefreshCw, StopCircle, Loader2, Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { irisApi, AnalysisResult as MLAnalysisResult, getRiskLevelColor, getSeverityColor } from '@/lib/irisApi';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

// New Simulation Components
import { ConcreteStructure } from '../testing/ConcreteStructure';
import { DataVisualization, SensorDataPoint } from '../testing/DataVisualization';
import { CrackAnalysis } from '../testing/CrackAnalysis';
import { MLAnalysisPanel } from '../testing/MLAnalysisPanel';

// NDT Testing Data Interface
interface NDTDataRow {
    id: string;
    timestamp: string;
    location: string;

    // Time of Flight (ToF) measurements
    tof: number; // microseconds (µs)

    // Attenuation measurements
    attenuation: number; // dB/m

    // Frequency analysis
    frequency: number; // MHz
    frequencyDistortion: number; // %

    // Signal quality
    amplitude: number; // %
    signalToNoise: number; // dB

    // Material properties
    velocity: number; // m/s
    impedance: number; // MRayl

    // Defect detection
    depth: number; // mm
    defectSize: number; // mm

    // Additional metadata
    structureType: string;
    temperature: number; // °C
    notes: string;
}

interface AnalysisResult {
    avgVelocity: number;
    avgAttenuation: number;
    avgToF: number;
    healthScore: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    defectsFound: number;
    signalQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

interface DetectionProcess {
    isRunning: boolean;
    currentStep: number;
    progress: number;
    detectedCracks: Array<{
        id: string;
        x: number;
        y: number;
        width: number;
        depth: number;
        severity: "low" | "medium" | "high";
    }>;
}

export function TestingDashboard() {
    const [mode, setMode] = useState<'csv' | 'manual' | 'live' | 'ml'>('manual');

    // --- DATA STATE ---
    const [data, setData] = useState<NDTDataRow[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [manualEntry, setManualEntry] = useState<Partial<NDTDataRow>>({
        location: '',
        tof: 0,
        attenuation: 0,
        frequency: 5.0,
        frequencyDistortion: 0,
        amplitude: 100,
        signalToNoise: 40,
        velocity: 4000,
        impedance: 10,
        depth: 0,
        defectSize: 0,
        structureType: 'Concrete',
        temperature: 20,
        notes: ''
    });

    // --- LIVE TESTING STATE ---
    const [isRecording, setIsRecording] = useState(false);
    const [liveData, setLiveData] = useState<NDTDataRow[]>([]);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);


    // --- SIMULATION MODE STATE ---
    const [process, setProcess] = useState<DetectionProcess>({
        isRunning: false,
        currentStep: 0,
        progress: 0,
        detectedCracks: [],
    });
    const [sensorData, setSensorData] = useState<SensorDataPoint[]>([]);

    // --- ML ANALYSIS STATE ---
    const [mlLoading, setMlLoading] = useState(false);
    const [mlError, setMlError] = useState<string | null>(null);
    const [mlResult, setMlResult] = useState<MLAnalysisResult | null>(null);
    const [uploadedMLFiles, setUploadedMLFiles] = useState<{
        long_rot00?: File;
        long_rot90?: File;
        shear_rot00?: File;
        shear_rot90?: File;
    }>({});

    // --- SIMULATION LOGIC ---
    const startProcess = () => {
        setProcess(prev => ({ ...prev, isRunning: true, currentStep: 1, progress: 0 }));
        setSensorData([]);
    };

    const stopProcess = () => {
        setProcess(prev => ({ ...prev, isRunning: false, currentStep: 0, progress: 0 }));
    };

    const resetProcess = () => {
        setProcess({ isRunning: false, currentStep: 0, progress: 0, detectedCracks: [] });
        setSensorData([]);
    };

    useEffect(() => {
        if (!process.isRunning) return;

        const interval = setInterval(() => {
            setProcess((prev) => {
                const newProgress = Math.min(prev.progress + 1, 100);
                let newStep = prev.currentStep;
                let detectedCracks = prev.detectedCracks;

                // Progress through steps
                if (newProgress > 20 && prev.currentStep === 1) newStep = 2;
                if (newProgress > 40 && prev.currentStep === 2) newStep = 3;
                if (newProgress > 60 && prev.currentStep === 3) newStep = 4;
                if (newProgress > 80 && prev.currentStep === 4) newStep = 5;

                // Add detected cracks at 70% progress
                if (newProgress > 70 && detectedCracks.length === 0) {
                    detectedCracks = [
                        { id: "crack-1", x: 150, y: 80, width: 2, depth: 12, severity: "medium" },
                        { id: "crack-2", x: 280, y: 60, width: 1.5, depth: 8, severity: "low" },
                        { id: "crack-3", x: 220, y: 95, width: 3, depth: 18, severity: "high" },
                    ];
                }

                if (newProgress >= 100) {
                    return { ...prev, progress: 100, currentStep: 6, isRunning: false, detectedCracks };
                }

                return { ...prev, progress: newProgress, currentStep: newStep, detectedCracks };
            });

            // Generate sensor data
            if (process.currentStep >= 2) {
                const baseFreq = 2.5; // MHz
                const noise = () => (Math.random() - 0.5) * 0.1;
                setSensorData((prev) => {
                    const newData: SensorDataPoint = {
                        time: prev.length,
                        sensor1: baseFreq + Math.sin(prev.length * 0.1) * 0.2 + noise(),
                        sensor2: baseFreq + Math.sin(prev.length * 0.15) * 0.3 + noise(),
                        sensor3: baseFreq + Math.sin(prev.length * 0.12) * 0.25 + noise(),
                        sensor4: baseFreq + Math.sin(prev.length * 0.08) * 0.15 + noise(),
                    };
                    return [...prev.slice(-50), newData];
                });
            }
        }, 100);

        return () => clearInterval(interval);
    }, [process.isRunning, process.currentStep]);


    // --- DATA HANDLING LOGIC ---
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            // CSV Parser for NDT data
            const rows = text.split('\n').slice(1).filter(row => row.trim());
            const parsedData: NDTDataRow[] = rows.map((row, index) => {
                const cols = row.split(',');
                return {
                    id: cols[0] || `NDT-${Date.now()}-${index}`,
                    timestamp: cols[1] || new Date().toISOString(),
                    location: cols[2] || 'Unknown',
                    tof: parseFloat(cols[3]) || 0,
                    attenuation: parseFloat(cols[4]) || 0,
                    frequency: parseFloat(cols[5]) || 5.0,
                    frequencyDistortion: parseFloat(cols[6]) || 0,
                    amplitude: parseFloat(cols[7]) || 100,
                    signalToNoise: parseFloat(cols[8]) || 40,
                    velocity: parseFloat(cols[9]) || 4000,
                    impedance: parseFloat(cols[10]) || 10,
                    depth: parseFloat(cols[11]) || 0,
                    defectSize: parseFloat(cols[12]) || 0,
                    structureType: cols[13] || 'Concrete',
                    temperature: parseFloat(cols[14]) || 20,
                    notes: cols[15] || ''
                };
            });
            setData(prev => [...prev, ...parsedData]);
            analyzeData([...data, ...parsedData]);
        };
        reader.readAsText(file);

        // Reset the input value so the same file can be uploaded again
        if (e.target) {
            e.target.value = '';
        }
    };

    // Drag and drop handlers
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const text = event.target?.result as string;
                    const rows = text.split('\n').slice(1).filter(row => row.trim());
                    const parsedData: NDTDataRow[] = rows.map((row, index) => {
                        const cols = row.split(',');
                        return {
                            id: cols[0] || `NDT-${Date.now()}-${index}`,
                            timestamp: cols[1] || new Date().toISOString(),
                            location: cols[2] || 'Unknown',
                            tof: parseFloat(cols[3]) || 0,
                            attenuation: parseFloat(cols[4]) || 0,
                            frequency: parseFloat(cols[5]) || 5.0,
                            frequencyDistortion: parseFloat(cols[6]) || 0,
                            amplitude: parseFloat(cols[7]) || 100,
                            signalToNoise: parseFloat(cols[8]) || 40,
                            velocity: parseFloat(cols[9]) || 4000,
                            impedance: parseFloat(cols[10]) || 10,
                            depth: parseFloat(cols[11]) || 0,
                            defectSize: parseFloat(cols[12]) || 0,
                            structureType: cols[13] || 'Concrete',
                            temperature: parseFloat(cols[14]) || 20,
                            notes: cols[15] || ''
                        };
                    });
                    setData(prev => [...prev, ...parsedData]);
                    analyzeData([...data, ...parsedData]);
                };
                reader.readAsText(file);
            }
        }
    };

    const handleManualAdd = () => {
        if (!manualEntry.location) return;
        const newRow: NDTDataRow = {
            id: `NDT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            location: manualEntry.location || '',
            tof: Number(manualEntry.tof) || 0,
            attenuation: Number(manualEntry.attenuation) || 0,
            frequency: Number(manualEntry.frequency) || 5.0,
            frequencyDistortion: Number(manualEntry.frequencyDistortion) || 0,
            amplitude: Number(manualEntry.amplitude) || 100,
            signalToNoise: Number(manualEntry.signalToNoise) || 40,
            velocity: Number(manualEntry.velocity) || 4000,
            impedance: Number(manualEntry.impedance) || 10,
            depth: Number(manualEntry.depth) || 0,
            defectSize: Number(manualEntry.defectSize) || 0,
            structureType: manualEntry.structureType || 'Concrete',
            temperature: Number(manualEntry.temperature) || 20,
            notes: manualEntry.notes || ''
        };
        const newData = [...data, newRow];
        setData(newData);
        analyzeData(newData);

        // Reset form
        setManualEntry({
            location: '',
            tof: 0,
            attenuation: 0,
            frequency: 5.0,
            frequencyDistortion: 0,
            amplitude: 100,
            signalToNoise: 40,
            velocity: 4000,
            impedance: 10,
            depth: 0,
            defectSize: 0,
            structureType: 'Concrete',
            temperature: 20,
            notes: ''
        });
    };

    // --- LIVE RECORDING FUNCTIONS ---
    const [serialPort, setSerialPort] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(false);
    const readerRef = useRef<any>(null);

    const connectToArduino = async () => {
        try {
            // Check if Web Serial API is supported
            if (!('serial' in navigator)) {
                alert('Web Serial API is not supported in your browser. Please use Chrome, Edge, or Opera.');
                return;
            }

            // Request a port and open a connection
            const port = await (navigator as any).serial.requestPort();
            await port.open({ baudRate: 9600 }); // Adjust baud rate to match your Arduino

            setSerialPort(port);
            setIsConnected(true);

            // Start reading data
            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
            const reader = textDecoder.readable.getReader();
            readerRef.current = reader;

            // Read data continuously
            let buffer = '';
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += value;
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep incomplete line in buffer

                for (const line of lines) {
                    if (line.trim()) {
                        parseArduinoData(line.trim());
                    }
                }
            }
        } catch (error) {
            console.error('Error connecting to Arduino:', error);
            alert('Failed to connect to Arduino. Please make sure it is connected and try again.');
        }
    };

    const parseArduinoData = (data: string) => {
        try {
            // Expected format from Arduino: "tof,attenuation,frequency,amplitude,snr,velocity"
            // Example: "12.5,15.3,5.0,95,42.5,4200"
            const values = data.split(',').map(v => parseFloat(v.trim()));

            if (values.length >= 6 && !values.some(isNaN)) {
                const newReading: NDTDataRow = {
                    id: `LIVE-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    location: `Sensor-Point`,
                    tof: values[0] || 0,
                    attenuation: values[1] || 0,
                    frequency: values[2] || 5.0,
                    frequencyDistortion: values[3] || 0,
                    amplitude: values[4] || 100,
                    signalToNoise: values[5] || 40,
                    velocity: values[6] || 4000,
                    impedance: values[7] || 10,
                    depth: values[8] || 0,
                    defectSize: values[9] || 0,
                    structureType: 'Concrete',
                    temperature: values[10] || 20,
                    notes: 'Live sensor reading'
                };

                setLiveData(prev => [...prev, newReading]);
                setData(prev => [...prev, newReading]);
            }
        } catch (error) {
            console.error('Error parsing Arduino data:', error);
        }
    };

    const startRecording = async () => {
        if (!isConnected) {
            await connectToArduino();
        }
        setIsRecording(true);
        setLiveData([]);
    };

    const stopRecording = async () => {
        setIsRecording(false);

        // Analyze all recorded data
        if (liveData.length > 0) {
            analyzeData([...data, ...liveData]);
        }
    };

    const disconnectArduino = async () => {
        try {
            if (readerRef.current) {
                await readerRef.current.cancel();
                readerRef.current = null;
            }
            if (serialPort) {
                await serialPort.close();
                setSerialPort(null);
            }
            setIsConnected(false);
            setIsRecording(false);
        } catch (error) {
            console.error('Error disconnecting from Arduino:', error);
        }
    };

    const clearLiveData = () => {
        setLiveData([]);
        setData(prev => prev.filter(d => !d.id.startsWith('LIVE-')));
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnectArduino();
        };
    }, []);


    const analyzeData = (dataset: NDTDataRow[]) => {
        setIsAnalyzing(true);
        setTimeout(() => {
            if (dataset.length === 0) return;

            const avgVel = dataset.reduce((acc, curr) => acc + curr.velocity, 0) / dataset.length;
            const avgAtt = dataset.reduce((acc, curr) => acc + curr.attenuation, 0) / dataset.length;
            const avgToF = dataset.reduce((acc, curr) => acc + curr.tof, 0) / dataset.length;
            const avgSNR = dataset.reduce((acc, curr) => acc + curr.signalToNoise, 0) / dataset.length;
            const lowAmpItems = dataset.filter(d => d.amplitude < 40).length;
            const highDistortion = dataset.filter(d => d.frequencyDistortion > 10).length;

            let risk: 'Low' | 'Medium' | 'High' = 'Low';
            let score = 'A';
            let signalQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Excellent';

            // Signal quality assessment
            if (avgSNR >= 40) signalQuality = 'Excellent';
            else if (avgSNR >= 30) signalQuality = 'Good';
            else if (avgSNR >= 20) signalQuality = 'Fair';
            else signalQuality = 'Poor';

            // Risk assessment
            if (avgVel < 3000 || lowAmpItems > 5 || avgAtt > 50 || highDistortion > 3) {
                risk = 'High';
                score = 'D';
            } else if (avgVel < 4000 || avgAtt > 30 || highDistortion > 1) {
                risk = 'Medium';
                score = 'B';
            }

            setAnalysis({
                avgVelocity: Math.round(avgVel),
                avgAttenuation: Math.round(avgAtt * 10) / 10,
                avgToF: Math.round(avgToF * 100) / 100,
                healthScore: score,
                riskLevel: risk,
                defectsFound: lowAmpItems,
                signalQuality
            });
            setIsAnalyzing(false);
        }, 800);
    };

    const exportData = () => {
        if (data.length === 0) return;
        const csvContent = "data:text/csv;charset=utf-8,"
            + "ID,Timestamp,Location,ToF(µs),Attenuation(dB/m),Frequency(MHz),Freq.Distortion(%),Amplitude(%),SNR(dB),Velocity(m/s),Impedance(MRayl),Depth(mm),DefectSize(mm),Type,Temperature(°C),Notes\n"
            + data.map(row => `${row.id},${row.timestamp},${row.location},${row.tof},${row.attenuation},${row.frequency},${row.frequencyDistortion},${row.amplitude},${row.signalToNoise},${row.velocity},${row.impedance},${row.depth},${row.defectSize},${row.structureType},${row.temperature},"${row.notes}"`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "ndt_analysis_results.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- ML ANALYSIS HANDLERS ---
    const handleMLFileChange = (fileType: keyof typeof uploadedMLFiles, file: File | null) => {
        if (file) {
            setUploadedMLFiles(prev => ({ ...prev, [fileType]: file }));
        }
    };

    const handleMLAnalyze = async () => {
        if (!uploadedMLFiles.long_rot00 || !uploadedMLFiles.long_rot90 ||
            !uploadedMLFiles.shear_rot00 || !uploadedMLFiles.shear_rot90) {
            setMlError('Please upload all 4 wave files (.npy format)');
            return;
        }

        setMlLoading(true);
        setMlError(null);

        try {
            const result = await irisApi.analyzeStructure({
                long_rot00: uploadedMLFiles.long_rot00,
                long_rot90: uploadedMLFiles.long_rot90,
                shear_rot00: uploadedMLFiles.shear_rot00,
                shear_rot90: uploadedMLFiles.shear_rot90,
            });

            setMlResult(result);
        } catch (err: any) {
            setMlError(err.message || 'Analysis failed. Ensure backend is running at http://localhost:8000');
        } finally {
            setMlLoading(false);
        }
    };

    const allMLFilesUploaded = uploadedMLFiles.long_rot00 && uploadedMLFiles.long_rot90 &&
                                uploadedMLFiles.shear_rot00 && uploadedMLFiles.shear_rot90;

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Enhanced Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight text-white">
                            NDT Data Analysis
                        </h1>
                        <p className="text-zinc-400 text-base max-w-2xl">
                            {mode === 'manual'
                                ? "Enter ultrasonic testing parameters including ToF, attenuation, frequency distortion, and signal quality metrics for comprehensive structural analysis."
                                : mode === 'csv'
                                ? "Import CSV files containing NDT test data for batch analysis and structural health assessment."
                                : mode === 'live'
                                ? "Connect to Arduino sensors for real-time ultrasonic wave data collection and live structural monitoring."
                                : "Upload ultrasonic wave .npy files for AI-powered crack detection with 96% accuracy using Random Forest machine learning."}
                        </p>
                    </div>

                    <div className="flex bg-zinc-900/80 backdrop-blur-sm p-1.5 rounded-xl border border-zinc-800 shadow-lg">
                        <button
                            onClick={() => setMode('manual')}
                            className={cn(
                                "px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2.5",
                                mode === 'manual'
                                    ? "bg-white text-black shadow-lg"
                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                            )}
                        >

                            Manual Entry
                        </button>
                        <button
                            onClick={() => setMode('csv')}
                            className={cn(
                                "px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2.5",
                                mode === 'csv'
                                    ? "bg-white text-black shadow-lg"
                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                            )}
                        >
                            CSV Import
                        </button>
                        <button
                            onClick={() => setMode('live')}
                            className={cn(
                                "px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2.5",
                                mode === 'live'
                                    ? "bg-white text-black shadow-lg"
                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                            )}
                        >
                            Live Testing
                        </button>
                        <button
                            onClick={() => setMode('ml')}
                            className={cn(
                                "px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2.5",
                                mode === 'ml'
                                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                            )}
                        >
                            <Brain className="w-4 h-4" />
                            AI Analysis
                        </button>
                    </div>
                </div>

                {mode === 'manual' ? (
                    <div className="space-y-6">
                        {/* NDT Data Input Panel */}
                        <Card className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-900/80 border-zinc-800 shadow-2xl overflow-hidden">
                            <CardHeader className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-20">
                                <div>
                                    <CardTitle className="text-white text-xl font-bold flex items-center gap-2">

                                        NDT Testing Parameters
                                    </CardTitle>
                                    <p className="text-zinc-500 text-sm mt-1">Enter ultrasonic testing measurements for structural analysis of <span className="text-white font-mono">Bridge Pillar A4</span> or similar assets.</p>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">

                                {/* Section 1: Location & Metadata */}
                                <div className="bg-zinc-950/30 p-6 rounded-xl border border-zinc-800/50 transition-colors">
                                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2 transition-colors">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs text-zinc-400 font-mono">1</span>
                                        Test Location & Metadata
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="text-zinc-400 text-sm font-medium mb-2 block">Location Identifier *</label>
                                            <Input
                                                placeholder="e.g., Column A-1, Beam B-2"
                                                className="bg-zinc-900/50 border-zinc-800 text-white focus-visible:ring-zinc-500/50 focus-visible:border-zinc-500/50 transition-all h-11"
                                                value={manualEntry.location || ''}
                                                onChange={e => setManualEntry({ ...manualEntry, location: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-zinc-400 text-sm font-medium mb-2 block">Structure Type</label>
                                            <div className="relative">

                                                <select
                                                    className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-md pl-10 pr-3 py-2 h-11 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:border-zinc-500/50 transition-all appearance-none"
                                                    value={manualEntry.structureType || 'Concrete'}
                                                    onChange={e => setManualEntry({ ...manualEntry, structureType: e.target.value })}
                                                >
                                                    <option value="Concrete">Concrete Structure</option>
                                                    <option value="Steel">Steel Component</option>
                                                    <option value="Composite">Composite Material</option>
                                                    <option value="Masonry">Masonry / Brick</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-zinc-400 text-sm font-medium mb-2 block">Temperature (°C)</label>
                                            <div className="relative">

                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="20.0"
                                                    className="bg-zinc-900/50 border-zinc-800 text-white pl-10 focus-visible:ring-zinc-500/50 focus-visible:border-zinc-500/50 transition-all h-11"
                                                    value={manualEntry.temperature || ''}
                                                    onChange={e => setManualEntry({ ...manualEntry, temperature: parseFloat(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Time of Flight & Velocity */}
                                <div className="bg-zinc-950/30 p-6 rounded-xl border border-zinc-800/50 transition-colors">
                                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2 transition-colors">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs text-zinc-400 font-mono">2</span>
                                        Wave Propagation Measurements
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-zinc-400 text-sm font-medium mb-2 block flex justify-between">
                                                <span>Time of Flight (ToF)</span>
                                                <span className="text-zinc-500 text-xs font-mono">microseconds (µs)</span>
                                            </label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="bg-zinc-900/50 border-zinc-800 text-white focus-visible:ring-zinc-500/50 focus-visible:border-zinc-500/50 transition-all h-11 font-mono"
                                                value={manualEntry.tof || ''}
                                                onChange={e => setManualEntry({ ...manualEntry, tof: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-zinc-400 text-sm font-medium mb-2 block flex justify-between">
                                                <span>Pulse Velocity</span>
                                                <span className="text-zinc-500 text-xs font-mono">meters/second (m/s)</span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute right-3 top-3 text-zinc-600 text-xs font-mono">m/s</span>
                                                <Input
                                                    type="number"
                                                    step="10"
                                                    placeholder="4000"
                                                    className="bg-zinc-900/50 border-zinc-800 text-white focus-visible:ring-zinc-500/50 focus-visible:border-zinc-500/50 transition-all h-11 font-mono"
                                                    value={manualEntry.velocity || ''}
                                                    onChange={e => setManualEntry({ ...manualEntry, velocity: parseFloat(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Signal Quality & Frequency */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-zinc-950/30 p-6 rounded-xl border border-zinc-800/50 transition-colors h-full">
                                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2 transition-colors">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs text-zinc-400 font-mono">3</span>
                                            Signal Integrity
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-zinc-400 text-sm font-medium mb-2 block">Attenuation (dB/m)</label>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="0.0"
                                                    className="bg-zinc-900/50 border-zinc-800 text-white h-10 font-mono"
                                                    value={manualEntry.attenuation || ''}
                                                    onChange={e => setManualEntry({ ...manualEntry, attenuation: parseFloat(e.target.value) })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-zinc-400 text-sm font-medium mb-2 block">Amplitude (%)</label>
                                                    <Input
                                                        type="number"
                                                        step="1"
                                                        placeholder="100"
                                                        className="bg-zinc-900/50 border-zinc-800 text-white h-10 font-mono"
                                                        value={manualEntry.amplitude || ''}
                                                        onChange={e => setManualEntry({ ...manualEntry, amplitude: parseFloat(e.target.value) })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-zinc-400 text-sm font-medium mb-2 block">SNR (dB)</label>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        placeholder="40.0"
                                                        className="bg-zinc-900/50 border-zinc-800 text-white h-10 font-mono"
                                                        value={manualEntry.signalToNoise || ''}
                                                        onChange={e => setManualEntry({ ...manualEntry, signalToNoise: parseFloat(e.target.value) })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-950/30 p-6 rounded-xl border border-zinc-800/50 transition-colors h-full">
                                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2 transition-colors">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs text-zinc-400 font-mono">4</span>
                                            Frequency & Impedance
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-zinc-400 text-sm font-medium mb-2 block">Frequency (MHz)</label>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="5.0"
                                                    className="bg-zinc-900/50 border-zinc-800 text-white h-10 font-mono"
                                                    value={manualEntry.frequency || ''}
                                                    onChange={e => setManualEntry({ ...manualEntry, frequency: parseFloat(e.target.value) })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-zinc-400 text-sm font-medium mb-2 block">Distortion (%)</label>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        placeholder="0.0"
                                                        className="bg-zinc-900/50 border-zinc-800 text-white h-10 font-mono"
                                                        value={manualEntry.frequencyDistortion || ''}
                                                        onChange={e => setManualEntry({ ...manualEntry, frequencyDistortion: parseFloat(e.target.value) })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-zinc-400 text-sm font-medium mb-2 block">Impedance</label>
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        placeholder="10.0"
                                                        className="bg-zinc-900/50 border-zinc-800 text-white h-10 font-mono"
                                                        value={manualEntry.impedance || ''}
                                                        onChange={e => setManualEntry({ ...manualEntry, impedance: parseFloat(e.target.value) })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 5: Defect Analysis */}
                                <div className="bg-red-950/10 p-6 rounded-xl border border-red-900/30 transition-colors">
                                    <h3 className="text-red-400 font-semibold mb-4 flex items-center gap-2">

                                        Defect Characterization
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-zinc-400 text-sm font-medium mb-2 block">Defect Depth (mm)</label>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                placeholder="0.0"
                                                className="bg-zinc-900/50 border-zinc-800 text-white focus-visible:ring-red-500/50 focus-visible:border-red-500/50 transition-all h-11 font-mono"
                                                value={manualEntry.depth || ''}
                                                onChange={e => setManualEntry({ ...manualEntry, depth: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-zinc-400 text-sm font-medium mb-2 block">Estimated Size (mm)</label>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                placeholder="0.0"
                                                className="bg-zinc-900/50 border-zinc-800 text-white focus-visible:ring-red-500/50 focus-visible:border-red-500/50 transition-all h-11 font-mono"
                                                value={manualEntry.defectSize || ''}
                                                onChange={e => setManualEntry({ ...manualEntry, defectSize: parseFloat(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="bg-zinc-950/30 p-4 rounded-xl border border-zinc-800/50">
                                    <label className="text-zinc-400 text-sm font-medium mb-2 block flex items-center gap-2">

                                        Field Notes
                                    </label>
                                    <textarea
                                        className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-md px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all resize-y"
                                        placeholder="Enter any additional observations, environmental conditions, or non-standard procedures..."
                                        value={manualEntry.notes || ''}
                                        onChange={e => setManualEntry({ ...manualEntry, notes: e.target.value })}
                                    />
                                </div>

                                {/* Footer Actions */}
                                <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setManualEntry({
                                            location: '',
                                            tof: 0,
                                            attenuation: 0,
                                            frequency: 5.0,
                                            frequencyDistortion: 0,
                                            amplitude: 100,
                                            signalToNoise: 40,
                                            velocity: 4000,
                                            impedance: 10,
                                            depth: 0,
                                            defectSize: 0,
                                            structureType: 'Concrete',
                                            temperature: 20,
                                            notes: ''
                                        })}
                                        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                                    >

                                        Reset Form
                                    </Button>
                                    <Button
                                        onClick={handleManualAdd}
                                        disabled={!manualEntry.location}
                                        size="lg"
                                        className={cn(
                                            "bg-white text-black hover:bg-zinc-200 shadow-lg shadow-zinc-900/50 transition-all duration-200 px-8 h-12 text-base font-semibold",
                                            !manualEntry.location && "opacity-50 cursor-not-allowed"
                                        )}
                                    >

                                        Submit Test Record
                                    </Button>
                                </div>

                            </CardContent>
                        </Card>

                        {/* Data Display & Analysis Results */}
                        {data.length > 0 && (
                            <>
                                {/* Analysis Results Summary */}
                                {analysis && (
                                    <Card className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-900/80 border-zinc-800 shadow-2xl">
                                        <CardHeader className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-white text-xl font-bold flex items-center gap-2">

                                                        Analysis Results
                                                    </CardTitle>
                                                    <p className="text-zinc-500 text-sm mt-1">Comprehensive NDT data analysis summary</p>
                                                </div>
                                                <Badge className={cn(
                                                    "text-sm px-4 py-2",
                                                    analysis.riskLevel === 'Low' ? "bg-zinc-900 text-zinc-300 border-zinc-800" :
                                                        analysis.riskLevel === 'Medium' ? "bg-zinc-900 text-zinc-300 border-zinc-800" :
                                                            "bg-zinc-900 text-zinc-300 border-zinc-800"
                                                )}>
                                                    Risk: {analysis.riskLevel}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                <div className="bg-zinc-950/50 p-6 rounded-lg border border-zinc-800">
                                                    <div className="text-zinc-400 text-sm mb-2">Avg. Velocity</div>
                                                    <div className="text-white text-3xl font-bold">{analysis.avgVelocity}</div>
                                                    <div className="text-zinc-500 text-xs mt-1">m/s</div>
                                                </div>
                                                <div className="bg-zinc-950/50 p-6 rounded-lg border border-zinc-800">
                                                    <div className="text-zinc-400 text-sm mb-2">Avg. Attenuation</div>
                                                    <div className="text-white text-3xl font-bold">{analysis.avgAttenuation}</div>
                                                    <div className="text-zinc-500 text-xs mt-1">dB/m</div>
                                                </div>
                                                <div className="bg-zinc-950/50 p-6 rounded-lg border border-zinc-800">
                                                    <div className="text-zinc-400 text-sm mb-2">Avg. ToF</div>
                                                    <div className="text-white text-3xl font-bold">{analysis.avgToF}</div>
                                                    <div className="text-zinc-500 text-xs mt-1">µs</div>
                                                </div>
                                                <div className="bg-zinc-950/50 p-6 rounded-lg border border-zinc-800">
                                                    <div className="text-zinc-400 text-sm mb-2">Signal Quality</div>
                                                    <div className={cn(
                                                        "text-3xl font-bold",
                                                        analysis.signalQuality === 'Excellent' ? "text-zinc-300" :
                                                            analysis.signalQuality === 'Good' ? "text-zinc-300" :
                                                                analysis.signalQuality === 'Fair' ? "text-zinc-300" :
                                                                    "text-zinc-300"
                                                    )}>{analysis.signalQuality}</div>
                                                    <div className="text-zinc-500 text-xs mt-1">Overall</div>
                                                </div>
                                            </div>
                                            <div className="mt-6 flex items-center justify-between p-4 bg-zinc-950/30 rounded-lg border border-zinc-800">
                                                <div>
                                                    <div className="text-zinc-400 text-sm">Health Score</div>
                                                    <div className="text-white text-2xl font-bold mt-1">Grade {analysis.healthScore}</div>
                                                </div>
                                                <div>
                                                    <div className="text-zinc-400 text-sm">Defects Found</div>
                                                    <div className="text-white text-2xl font-bold mt-1">{analysis.defectsFound}</div>
                                                </div>
                                                <Button
                                                    onClick={exportData}
                                                    className="bg-white text-black hover:bg-zinc-200 shadow-lg"
                                                >

                                                    Export Data
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Data Table */}
                                <Card className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-900/80 border-zinc-800 shadow-2xl">
                                    <CardHeader className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-white text-xl font-bold flex items-center gap-2">

                                                    Test Data Records
                                                </CardTitle>
                                                <p className="text-zinc-500 text-sm mt-1">All entered NDT measurements</p>
                                            </div>
                                            <Badge className="bg-zinc-900 text-zinc-300 border-zinc-800 text-sm px-4 py-2">
                                                {data.length} Records
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="rounded-lg border border-zinc-800/50 overflow-x-auto bg-zinc-950/50">
                                            <Table>
                                                <TableHeader className="bg-zinc-900">
                                                    <TableRow className="border-zinc-800">
                                                        <TableHead className="text-zinc-300 font-semibold">Location</TableHead>
                                                        <TableHead className="text-zinc-300 font-semibold">ToF (µs)</TableHead>
                                                        <TableHead className="text-zinc-300 font-semibold">Atten. (dB/m)</TableHead>
                                                        <TableHead className="text-zinc-300 font-semibold">Freq. (MHz)</TableHead>
                                                        <TableHead className="text-zinc-300 font-semibold">SNR (dB)</TableHead>
                                                        <TableHead className="text-zinc-300 font-semibold">Velocity (m/s)</TableHead>
                                                        <TableHead className="text-zinc-300 font-semibold">Type</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {data.map((row, i) => (
                                                        <TableRow key={row.id} className="border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                                                            <TableCell className="text-zinc-200 font-medium">{row.location}</TableCell>
                                                            <TableCell className="text-zinc-300 font-mono">{row.tof.toFixed(2)}</TableCell>
                                                            <TableCell className="text-zinc-300 font-mono">{row.attenuation.toFixed(1)}</TableCell>
                                                            <TableCell className="text-zinc-300 font-mono">{row.frequency.toFixed(1)}</TableCell>
                                                            <TableCell className="text-zinc-300 font-mono">{row.signalToNoise.toFixed(1)}</TableCell>
                                                            <TableCell className="text-zinc-300 font-mono">{row.velocity}</TableCell>
                                                            <TableCell className="text-zinc-400">{row.structureType}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>
                ) : mode === 'csv' ? (
                    <div className="space-y-8">
                        {/* Enhanced Upload Area */}
                        <Card
                            className={cn(
                                "bg-gradient-to-br from-zinc-900/50 via-zinc-900/30 to-zinc-900/50 border-zinc-800 border-dashed border-2 hover:border-zinc-800/50 hover:bg-zinc-900/60 transition-all duration-300 cursor-pointer group shadow-2xl",
                                isDragging && "border-zinc-500 bg-zinc-900/20 scale-[1.02]"
                            )}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="csv-upload"
                                    ref={fileInputRef}
                                />
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="cursor-pointer flex flex-col items-center w-full"
                                >
                                    <div className={cn(
                                        "w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-800/20 to-zinc-800/10 border border-zinc-800/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-zinc-500/30 transition-all duration-300",
                                        isDragging && "scale-110 shadow-lg shadow-zinc-500/50"
                                    )}>
                                        <Upload className={cn(
                                            "w-10 h-10 text-white group-hover:text-zinc-300 transition-colors",
                                            isDragging && "text-zinc-300 animate-pulse"
                                        )} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">
                                        {isDragging ? "Drop CSV file here" : "Upload NDT Test Data CSV"}
                                    </h3>
                                    <p className="text-zinc-400 text-base mb-6 text-center max-w-2xl leading-relaxed">
                                        {isDragging ? (
                                            <span className="text-zinc-300 font-semibold">Release to upload</span>
                                        ) : (
                                            <>
                                                Drag and drop your CSV file here or click to browse.<br />
                                                <span className="text-zinc-500 text-sm mt-2 block">
                                                    Expected format: ID, Timestamp, Location, ToF(µs), Attenuation(dB/m), Frequency(MHz), Freq.Distortion(%), Amplitude(%), SNR(dB), Velocity(m/s), Impedance(MRayl), Depth(mm), DefectSize(mm), Type, Temperature(°C), Notes
                                                </span>
                                            </>
                                        )}
                                    </p>
                                    {!isDragging && (
                                        <Button
                                            size="lg"
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fileInputRef.current?.click();
                                            }}
                                            className="bg-white text-black hover:bg-zinc-200 shadow-lg transition-all duration-200 px-8"
                                        >

                                            Select CSV File
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Enhanced Data Table */}
                        {data.length > 0 && (
                            <Card className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-900/80 border-zinc-800 shadow-2xl">
                                <CardHeader className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-white text-lg font-bold flex items-center gap-2">

                                                Uploaded Data Analysis
                                            </CardTitle>
                                            <p className="text-zinc-500 text-sm mt-1">All {data.length} uploaded records</p>
                                        </div>
                                        <Badge className="bg-zinc-900 text-zinc-300 border-zinc-800">
                                            {data.length} Records
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="rounded-lg border border-zinc-800/50 overflow-x-auto bg-zinc-950/50 max-h-[600px] overflow-y-auto">
                                        <Table>
                                            <TableHeader className="bg-zinc-900 sticky top-0">
                                                <TableRow className="border-zinc-800 hover:bg-zinc-900">
                                                    {Object.keys(data[0]).map((header) => (
                                                        <TableHead key={header} className="text-zinc-300 font-semibold uppercase text-xs tracking-wider">
                                                            {header}
                                                        </TableHead>
                                                    ))}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data.map((row, i) => (
                                                    <TableRow key={i} className="border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                                                        {Object.values(row).map((cell: any, j) => (
                                                            <TableCell key={j} className="text-zinc-200 font-mono text-sm">
                                                                {typeof cell === 'number' ? cell.toFixed(2) : cell}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                ) : mode === 'live' ? (
                    <div className="space-y-6">
                        {/* Live Recording Control Panel */}
                        <Card className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-900/80 border-zinc-800 shadow-2xl">
                            <CardHeader className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-white text-xl font-bold flex items-center gap-2">

                                            Live Sensor Recording
                                        </CardTitle>
                                        <p className="text-zinc-500 text-sm mt-1">
                                            {isConnected
                                                ? isRecording
                                                    ? "Recording real-time ultrasonic sensor data from Arduino..."
                                                    : "Arduino connected. Click 'Start Recording' to begin."
                                                : "Click 'Start Recording' to connect to your Arduino sensor"}
                                        </p>
                                    </div>
                                    <Badge className={cn(
                                        "text-sm px-4 py-2",
                                        isConnected
                                            ? "bg-zinc-900 text-zinc-300 border-zinc-800"
                                            : "bg-zinc-800/30 text-zinc-400 border-zinc-700"
                                    )}>
                                        {isConnected ? "🟢 Connected" : "⚪ Disconnected"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        {isRecording ? (
                                            <>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                                                    <span className="text-white font-semibold">RECORDING</span>
                                                </div>
                                                <div className="text-zinc-400">
                                                    <span className="text-zinc-300 font-mono text-2xl font-bold">{liveData.length}</span>
                                                    <span className="text-sm ml-2">readings captured</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-zinc-400 flex items-center gap-2">

                                                <span>Ready to record</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        {!isRecording ? (
                                            <Button
                                                onClick={startRecording}
                                                size="lg"
                                                className="bg-white text-black hover:bg-zinc-200 shadow-lg transition-all duration-200 px-8"
                                            >

                                                {isConnected ? "Start Recording" : "Connect & Record"}
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={stopRecording}
                                                size="lg"
                                                variant="outline"
                                                className="border-zinc-800 bg-red-950/20 text-zinc-300 hover:bg-red-950/40 hover:text-red-300 hover:border-red-700 px-8"
                                            >

                                                Stop Recording
                                            </Button>
                                        )}
                                        {isConnected && !isRecording && (
                                            <Button
                                                onClick={disconnectArduino}
                                                variant="outline"
                                                className="border-zinc-800 bg-amber-950/20 text-zinc-300 hover:bg-amber-950/40 hover:text-amber-300 hover:border-amber-700"
                                            >

                                                Disconnect
                                            </Button>
                                        )}
                                        {liveData.length > 0 && (
                                            <Button
                                                onClick={clearLiveData}
                                                variant="outline"
                                                className="border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                                            >

                                                Clear Data
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Live Data Stream */}
                                {isRecording && liveData.length > 0 && (
                                    <div className="mt-6 p-4 bg-zinc-950/50 rounded-lg border border-zinc-800">
                                        <div className="text-zinc-400 text-sm mb-3 flex items-center gap-2">

                                            Latest Reading
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <div className="text-zinc-500 text-xs">ToF</div>
                                                <div className="text-white font-mono text-lg">{liveData[liveData.length - 1]?.tof.toFixed(2)} µs</div>
                                            </div>
                                            <div>
                                                <div className="text-zinc-500 text-xs">Attenuation</div>
                                                <div className="text-white font-mono text-lg">{liveData[liveData.length - 1]?.attenuation.toFixed(1)} dB/m</div>
                                            </div>
                                            <div>
                                                <div className="text-zinc-500 text-xs">SNR</div>
                                                <div className="text-white font-mono text-lg">{liveData[liveData.length - 1]?.signalToNoise.toFixed(1)} dB</div>
                                            </div>
                                            <div>
                                                <div className="text-zinc-500 text-xs">Velocity</div>
                                                <div className="text-white font-mono text-lg">{Math.round(liveData[liveData.length - 1]?.velocity)} m/s</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Live Data Table */}
                        {liveData.length > 0 && (
                            <Card className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-900/80 border-zinc-800 shadow-2xl">
                                <CardHeader className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">

                                                Live Sensor Data
                                            </CardTitle>
                                            <p className="text-zinc-500 text-sm mt-1">Real-time NDT measurements from connected sensor</p>
                                        </div>
                                        <Badge className="bg-zinc-900 text-zinc-300 border-zinc-800 text-sm px-4 py-2">
                                            {liveData.length} Readings
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="rounded-lg border border-zinc-800/50 overflow-x-auto bg-zinc-950/50 max-h-[500px] overflow-y-auto">
                                        <Table>
                                            <TableHeader className="bg-zinc-900 sticky top-0">
                                                <TableRow className="border-zinc-800">
                                                    <TableHead className="text-zinc-300 font-semibold">Time</TableHead>
                                                    <TableHead className="text-zinc-300 font-semibold">Location</TableHead>
                                                    <TableHead className="text-zinc-300 font-semibold">ToF (µs)</TableHead>
                                                    <TableHead className="text-zinc-300 font-semibold">Atten. (dB/m)</TableHead>
                                                    <TableHead className="text-zinc-300 font-semibold">Freq. (MHz)</TableHead>
                                                    <TableHead className="text-zinc-300 font-semibold">SNR (dB)</TableHead>
                                                    <TableHead className="text-zinc-300 font-semibold">Velocity (m/s)</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {liveData.slice().reverse().map((row, i) => (
                                                    <TableRow
                                                        key={row.id}
                                                        className={cn(
                                                            "border-zinc-800/50 hover:bg-zinc-900/50 transition-colors",
                                                            i === 0 && "bg-emerald-950/10"
                                                        )}
                                                    >
                                                        <TableCell className="text-zinc-400 text-xs font-mono">
                                                            {new Date(row.timestamp).toLocaleTimeString()}
                                                        </TableCell>
                                                        <TableCell className="text-zinc-200 font-medium">{row.location}</TableCell>
                                                        <TableCell className="text-zinc-300 font-mono">{row.tof.toFixed(2)}</TableCell>
                                                        <TableCell className="text-zinc-300 font-mono">{row.attenuation.toFixed(1)}</TableCell>
                                                        <TableCell className="text-zinc-300 font-mono">{row.frequency.toFixed(1)}</TableCell>
                                                        <TableCell className="text-zinc-300 font-mono">{row.signalToNoise.toFixed(1)}</TableCell>
                                                        <TableCell className="text-zinc-300 font-mono">{Math.round(row.velocity)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                ) : mode === 'ml' ? (
                    <MLAnalysisPanel
                        uploadedFiles={uploadedMLFiles}
                        onFileChange={handleMLFileChange}
                        onAnalyze={handleMLAnalyze}
                        loading={mlLoading}
                        error={mlError}
                        result={mlResult}
                    />
                ) : null}
            </div>
        </div >
    );
}
