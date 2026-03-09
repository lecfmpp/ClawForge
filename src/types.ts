export type ModelType = 'Kimi K2.5' | 'Deepseek v3' | 'Haiku' | 'Gemini 2.0 Flash';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'communication' | 'data' | 'development' | 'marketing' | 'other';
  config: Record<string, any>;
}

export interface Secret {
  id: string;
  name: string;
  key: string;
  value: string;
  description: string;
  lastUsed?: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  scope: 'agent' | 'node' | 'gateway' | 'global';
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  model: ModelType;
  trustLevel: number; // 0-100
  skills: string[];
  inputs: string[];
  outputs: string[];
  tools: string[]; // Tool IDs
  secrets: string[]; // Secret IDs
  permissions: string[]; // Permission IDs
  context?: {
    text?: string;
    files?: { name: string; type: string; size: number; content?: string }[];
  };
  files: {
    soul: string;
    identity: string;
    agents: string;
    memory: string;
  };
  position: { x: number; y: number };
}

export interface Connection {
  id: string;
  from: string;
  to: string;
}

export interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: number;
  agentId?: string;
}

export interface ChatSession {
  id: string;
  name: string;
  agentId: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface SystemStatus {
  openClaw: 'connected' | 'disconnected' | 'connecting';
  gateway: 'online' | 'offline' | 'busy';
  channels: {
    id: string;
    name: string;
    status: 'active' | 'inactive';
  }[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  agents: Agent[];
  connections: Connection[];
  globalUserContext: string;
  outcome?: {
    title: string;
    type: 'url' | 'code' | 'folder';
    value: string;
    description: string;
  };
  createdAt: number;
  updatedAt: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  location: string;
  marketingPriorities: string[];
}
