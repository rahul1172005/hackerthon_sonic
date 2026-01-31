/**
 * IRIS AI Backend API Service
 * Connects to FastAPI backend for crack detection analysis
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Type definitions for API responses
export interface AnalysisResult {
  status: string;
  analysis: {
    crack_detected: boolean;
    confidence: number;
    severity: 'None' | 'Minor' | 'Moderate' | 'Severe';
    risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
    structural_integrity_percent: number;
    attenuation_score: number;
  };
  recommendations: {
    action: string;
    methods: string[];
    cost_estimate: string;
    urgency: string;
    structural_impact: string;
    immediate_action_required: boolean;
    estimated_lifespan: string;
  };
  progression: {
    timeline: string[];
    severity_forecast: number[];
    risk_forecast: string[];
    model: string;
  };
  visualization: {
    long_wave: {
      x: number[];
      y: number[];
    };
    shear_wave: {
      x: number[];
      y: number[];
    };
    crack_zones: Array<{
      x: number;
      y: number;
      intensity: number;
      attenuation: number;
    }>;
    sample_rate: number;
    position: {
      x: number;
      y: number;
    };
  };
  processing_time_ms: number;
}

export interface HealthCheckResult {
  status: string;
  model_loaded: boolean;
  features_loaded: boolean;
  num_features: number;
  num_trees: number;
}

export interface PredictResult {
  status: string;
  crack_detected: boolean;
  confidence: number;
  processing_time_ms: number;
  note: string;
}

/**
 * IRIS AI API Client
 */
export const irisApi = {
  /**
   * Health check - verify backend is running
   */
  checkHealth: async (): Promise<HealthCheckResult> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('Backend server is not responding. Please ensure the API is running at ' + API_BASE_URL);
    }
  },

  /**
   * Simple prediction - single file upload
   */
  predictCrack: async (file: File): Promise<PredictResult> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Prediction failed:', error);
      throw new Error(error.response?.data?.detail || 'Prediction failed');
    }
  },

  /**
   * Full analysis - upload all 4 wave types
   * This is the main endpoint for comprehensive crack detection
   */
  analyzeStructure: async (files: {
    long_rot00: File;
    long_rot90: File;
    shear_rot00: File;
    shear_rot90: File;
  }): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append('long_rot00', files.long_rot00);
    formData.append('long_rot90', files.long_rot90);
    formData.append('shear_rot00', files.shear_rot00);
    formData.append('shear_rot90', files.shear_rot90);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });
      return response.data;
    } catch (error: any) {
      console.error('Analysis failed:', error);
      if (error.code === 'ECONNABORTED') {
        throw new Error('Analysis timeout - file too large or server overloaded');
      }
      throw new Error(error.response?.data?.detail || 'Analysis failed');
    }
  },

  /**
   * Get base URL for reference
   */
  getBaseUrl: () => API_BASE_URL,
};

/**
 * Risk level color mapping for UI
 */
export const getRiskLevelColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'Low':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'Medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'High':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'Critical':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

/**
 * Severity badge color mapping
 */
export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'None':
      return 'bg-green-500';
    case 'Minor':
      return 'bg-yellow-500';
    case 'Moderate':
      return 'bg-orange-500';
    case 'Severe':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export default irisApi;
