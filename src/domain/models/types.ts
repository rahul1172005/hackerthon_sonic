export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface TestSession {
  id: string;
  title: string;
  createdAt: string;
  deviceId: string;
  status: 'active' | 'archived';
  datasets: Dataset[];
}

export interface Dataset {
  id: string; // Hash
  name: string;
  type: 'waveform' | 'velocity' | 'structure_image' | 'report';
  url: string;
  uploadedAt: string;
  metadata?: Record<string, unknown>;
}

export interface Device {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'streaming';
  lastSeen: string;
}
