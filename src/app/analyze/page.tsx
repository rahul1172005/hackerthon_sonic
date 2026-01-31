'use client';

import React, { useState } from 'react';
import { irisApi, AnalysisResult, getRiskLevelColor, getSeverityColor } from '@/lib/irisApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, AlertTriangle, CheckCircle, TrendingUp, Loader2 } from 'lucide-react';

export default function AnalyzePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{
    long_rot00?: File;
    long_rot90?: File;
    shear_rot00?: File;
    shear_rot90?: File;
  }>({});

  const handleFileChange = (fileType: keyof typeof uploadedFiles, file: File | null) => {
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [fileType]: file }));
    }
  };

  const handleAnalyze = async () => {
    // Validate all files are uploaded
    if (!uploadedFiles.long_rot00 || !uploadedFiles.long_rot90 ||
        !uploadedFiles.shear_rot00 || !uploadedFiles.shear_rot90) {
      setError('Please upload all 4 wave files');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const analysis = await irisApi.analyzeStructure({
        long_rot00: uploadedFiles.long_rot00,
        long_rot90: uploadedFiles.long_rot90,
        shear_rot00: uploadedFiles.shear_rot00,
        shear_rot90: uploadedFiles.shear_rot90,
      });

      setResult(analysis);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const allFilesUploaded = uploadedFiles.long_rot00 && uploadedFiles.long_rot90 &&
                           uploadedFiles.shear_rot00 && uploadedFiles.shear_rot90;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">IRIS AI - Structural Analysis</h1>
        <p className="text-muted-foreground">
          Upload ultrasonic wave data files (.npy format) for AI-powered crack detection
        </p>
      </div>

      {/* File Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Wave Data Files
          </CardTitle>
          <CardDescription>
            Upload all 4 ultrasonic wave files for comprehensive analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Long Wave Rot 0° */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Longitudinal Wave (0°)
                {uploadedFiles.long_rot00 && <CheckCircle className="inline w-4 h-4 ml-2 text-green-500" />}
              </label>
              <input
                type="file"
                accept=".npy"
                onChange={(e) => handleFileChange('long_rot00', e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border rounded-md"
              />
              {uploadedFiles.long_rot00 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {uploadedFiles.long_rot00.name} ({(uploadedFiles.long_rot00.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Long Wave Rot 90° */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Longitudinal Wave (90°)
                {uploadedFiles.long_rot90 && <CheckCircle className="inline w-4 h-4 ml-2 text-green-500" />}
              </label>
              <input
                type="file"
                accept=".npy"
                onChange={(e) => handleFileChange('long_rot90', e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border rounded-md"
              />
              {uploadedFiles.long_rot90 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {uploadedFiles.long_rot90.name} ({(uploadedFiles.long_rot90.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Shear Wave Rot 0° */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Shear Wave (0°)
                {uploadedFiles.shear_rot00 && <CheckCircle className="inline w-4 h-4 ml-2 text-green-500" />}
              </label>
              <input
                type="file"
                accept=".npy"
                onChange={(e) => handleFileChange('shear_rot00', e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border rounded-md"
              />
              {uploadedFiles.shear_rot00 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {uploadedFiles.shear_rot00.name} ({(uploadedFiles.shear_rot00.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Shear Wave Rot 90° */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Shear Wave (90°)
                {uploadedFiles.shear_rot90 && <CheckCircle className="inline w-4 h-4 ml-2 text-green-500" />}
              </label>
              <input
                type="file"
                accept=".npy"
                onChange={(e) => handleFileChange('shear_rot90', e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border rounded-md"
              />
              {uploadedFiles.shear_rot90 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {uploadedFiles.shear_rot90.name} ({(uploadedFiles.shear_rot90.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!allFilesUploaded || loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Analyze Structure
              </>
            )}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Detection Result Banner */}
          <Card className={`border-2 ${result.analysis.crack_detected ? 'border-red-500' : 'border-green-500'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {result.analysis.crack_detected ? (
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                  ) : (
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">
                      {result.analysis.crack_detected ? 'Crack Detected' : 'No Crack Detected'}
                    </h2>
                    <p className="text-muted-foreground">
                      Confidence: {result.analysis.confidence.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getSeverityColor(result.analysis.severity) + ' text-white text-lg px-4 py-2'}>
                    {result.analysis.severity}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Processed in {result.processing_time_ms.toFixed(0)}ms
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border-2 ${getRiskLevelColor(result.analysis.risk_level)}`}>
                  <p className="text-sm font-medium">Risk Level</p>
                  <p className="text-2xl font-bold">{result.analysis.risk_level}</p>
                </div>
                <div className="p-4 rounded-lg border-2 bg-blue-50 border-blue-200">
                  <p className="text-sm font-medium text-blue-900">Structural Integrity</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {result.analysis.structural_integrity_percent}%
                  </p>
                </div>
                <div className="p-4 rounded-lg border-2 bg-purple-50 border-purple-200">
                  <p className="text-sm font-medium text-purple-900">Attenuation Score</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {result.analysis.attenuation_score.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Action</CardTitle>
              <CardDescription>{result.recommendations.urgency}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{result.recommendations.action}</h3>
                <Badge variant={result.recommendations.immediate_action_required ? 'destructive' : 'default'}>
                  {result.recommendations.immediate_action_required ? '⚠️ IMMEDIATE ACTION REQUIRED' : 'Scheduled Repair'}
                </Badge>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Repair Methods:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {result.recommendations.methods.map((method, i) => (
                    <li key={i} className="text-muted-foreground">{method}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium">Cost Estimate</p>
                  <p className="text-lg font-semibold">{result.recommendations.cost_estimate}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium">Structural Impact</p>
                  <p className="text-lg font-semibold">{result.recommendations.structural_impact}</p>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm font-medium text-yellow-900">Estimated Lifespan (Without Intervention)</p>
                <p className="text-lg font-semibold text-yellow-900">{result.recommendations.estimated_lifespan}</p>
              </div>
            </CardContent>
          </Card>

          {/* Crack Progression Forecast */}
          <Card>
            <CardHeader>
              <CardTitle>Crack Progression Forecast</CardTitle>
              <CardDescription>Predicted severity over time ({result.progression.model})</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.progression.timeline.map((time, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-24 font-medium">{time}</div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full ${
                            result.progression.severity_forecast[i] < 0.3 ? 'bg-green-500' :
                            result.progression.severity_forecast[i] < 0.6 ? 'bg-yellow-500' :
                            result.progression.severity_forecast[i] < 0.85 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(result.progression.severity_forecast[i] * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-32 text-right">
                      <Badge variant={
                        result.progression.risk_forecast[i] === 'Low' ? 'default' :
                        result.progression.risk_forecast[i] === 'Medium' ? 'secondary' :
                        result.progression.risk_forecast[i] === 'High' ? 'default' :
                        'destructive'
                      }>
                        {result.progression.risk_forecast[i]}
                      </Badge>
                    </div>
                    <div className="w-16 text-right text-sm text-muted-foreground">
                      {(result.progression.severity_forecast[i] * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Visualization Info */}
          <Card>
            <CardHeader>
              <CardTitle>Wave Analysis Data</CardTitle>
              <CardDescription>Position analyzed: X={result.visualization.position.x}, Y={result.visualization.position.y}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Longitudinal Wave</h4>
                  <p className="text-sm text-muted-foreground">
                    {result.visualization.long_wave.x.length} data points sampled
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Peak amplitude: {Math.max(...result.visualization.long_wave.y.map(Math.abs)).toFixed(2)}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Shear Wave</h4>
                  <p className="text-sm text-muted-foreground">
                    {result.visualization.shear_wave.x.length} data points sampled
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Peak amplitude: {Math.max(...result.visualization.shear_wave.y.map(Math.abs)).toFixed(2)}
                  </p>
                </div>
              </div>

              {result.visualization.crack_zones.length > 0 && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                  <h4 className="font-medium text-orange-900">Crack Zones Detected</h4>
                  {result.visualization.crack_zones.map((zone, i) => (
                    <p key={i} className="text-sm text-orange-800">
                      Position ({zone.x}, {zone.y}): Intensity {(zone.intensity * 100).toFixed(1)}%, Attenuation {zone.attenuation.toFixed(2)}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
