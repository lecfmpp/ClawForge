import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, LayoutGrid, List, FolderTree, Share2, Download, Zap } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TheNexus } from './components/TheNexus';
import { TheWorkflows } from './components/TheWorkflows';
import { TheForge } from './components/TheForge';
import { AgentCard } from './components/AgentCard';
import { DeploymentMap } from './components/DeploymentMap';
import { AgentWizard } from './components/wizards/AgentWizard';
import { WorkflowWizard } from './components/wizards/WorkflowWizard';
import { Project, Agent, Connection, Tool, Secret, Permission, SystemStatus } from './types';
import { DEFAULT_SOUL, DEFAULT_IDENTITY, DEFAULT_AGENTS, DEFAULT_MEMORY } from './constants';
import { refineAgentFile, generateAgentAvatar } from './services/geminiService';
import { cn } from './lib/utils';
import { TheTools } from './components/TheTools';
import { ThePermissions } from './components/ThePermissions';
import { TheSecrets } from './components/TheSecrets';
import { TheFileManager } from './components/TheFileManager';
import { TheChat } from './components/TheChat';
import { AgentConfigModal } from './components/AgentConfigModal';

const MOCK_TOOLS: Tool[] = [
  { id: 't1', name: 'Meta Ads Extractor', description: 'Extracts performance data from Meta Ads Manager.', icon: 'Wrench', category: 'marketing', config: {} },
  { id: 't2', name: 'Competitor Spy', description: 'Monitors competitor ad creative and spend.', icon: 'Wrench', category: 'marketing', config: {} },
  { id: 't3', name: 'Funnel Builder', description: 'Generates high-converting landing page structures.', icon: 'Wrench', category: 'marketing', config: {} },
  { id: 't4', name: 'Slack Notifier', description: 'Sends real-time campaign alerts to Slack channels.', icon: 'Wrench', category: 'communication', config: {} }
];

const MOCK_SECRETS: Secret[] = [
  { id: 's1', name: 'Meta API Key', key: 'META_API_TOKEN', value: 'xoxb-1234567890-abcdef', description: 'Production API token for Meta Ads Manager.', lastUsed: Date.now() },
  { id: 's2', name: 'Slack Webhook', key: 'SLACK_WEBHOOK_URL', value: 'https://hooks.slack.com/services/T000/B000/XXXX', description: 'Webhook for #marketing-alerts channel.' }
];

const MOCK_PERMISSIONS: Permission[] = [
  { id: 'p1', name: 'External API Access', description: 'Allows agents to make requests to external domains.', enabled: true, scope: 'agent' },
  { id: 'p2', name: 'File System Write', description: 'Allows agents to create and modify files in the workspace.', enabled: true, scope: 'node' },
  { id: 'p3', name: 'Database Access', description: 'Allows agents to read and write to the vector knowledge base.', enabled: false, scope: 'gateway' },
  { id: 'p4', name: 'Model Switching', description: 'Allows agents to dynamically switch between LLM models.', enabled: true, scope: 'agent' }
];

const MOCK_PROJECTS: Project[] = [
  {
    id: 'wisefunnel',
    name: 'WiseFunnel',
    description: 'B2B Marketing Automation Team',
    globalUserContext: 'Leandro Campos, Kitchener, Canada. B2B Marketing priorities.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    connections: [
      { id: 'c1', from: 'w-research', to: 'w-strat' },
      { id: 'c2', from: 'w-strat', to: 'w-create' },
      { id: 'c3', from: 'w-create', to: 'wise-exec' },
    ],
    agents: [
      {
        id: 'w-research',
        name: 'W-Research',
        role: 'Market Researcher',
        avatarUrl: 'https://picsum.photos/seed/research/400/200',
        model: 'Deepseek v3',
        trustLevel: 95,
        skills: ['/meta_ads_extractor', '/competitor_spy'],
        inputs: [],
        outputs: [],
        tools: [],
        secrets: [],
        permissions: [],
        position: { x: 100, y: 100 },
        files: { soul: DEFAULT_SOUL, identity: DEFAULT_IDENTITY, agents: DEFAULT_AGENTS, memory: DEFAULT_MEMORY }
      },
      {
        id: 'w-strat',
        name: 'W-Strat',
        role: 'Growth Strategist',
        avatarUrl: 'https://picsum.photos/seed/strat/400/200',
        model: 'Kimi K2.5',
        trustLevel: 88,
        skills: ['/funnel_builder', '/offer_optimizer'],
        inputs: [],
        outputs: [],
        tools: [],
        secrets: [],
        permissions: [],
        position: { x: 400, y: 100 },
        files: { soul: DEFAULT_SOUL, identity: DEFAULT_IDENTITY, agents: DEFAULT_AGENTS, memory: DEFAULT_MEMORY }
      },
      {
        id: 'w-create',
        name: 'W-Create',
        role: 'Creative Director',
        avatarUrl: 'https://picsum.photos/seed/create/400/200',
        model: 'Kimi K2.5',
        trustLevel: 92,
        skills: ['/ad_copy_gen', '/image_prompter'],
        inputs: [],
        outputs: [],
        tools: [],
        secrets: [],
        permissions: [],
        position: { x: 700, y: 100 },
        files: { soul: DEFAULT_SOUL, identity: DEFAULT_IDENTITY, agents: DEFAULT_AGENTS, memory: DEFAULT_MEMORY }
      },
      {
        id: 'wise-exec',
        name: 'Wise-Exec',
        role: 'Campaign Executor',
        avatarUrl: 'https://picsum.photos/seed/exec/400/200',
        model: 'Haiku',
        trustLevel: 75,
        skills: ['/meta_api_push', '/slack_notifier'],
        inputs: [],
        outputs: [],
        tools: [],
        secrets: [],
        permissions: [],
        position: { x: 1000, y: 100 },
        files: { soul: DEFAULT_SOUL, identity: DEFAULT_IDENTITY, agents: DEFAULT_AGENTS, memory: DEFAULT_MEMORY }
      }
    ]
  },
  {
    id: 'labscubed',
    name: 'LabsCubed',
    description: 'Industrial Materials R&D Team',
    globalUserContext: 'Leandro Campos, Kitchener, Canada. Industrial Materials R&D.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    agents: [],
    connections: []
  }
];

import { AddToolModal } from './components/AddToolModal';
import { AddSecretModal } from './components/AddSecretModal';
import { Toaster, toast } from 'sonner';
import { Cpu, Globe, Network, ShieldCheck } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(MOCK_PROJECTS[0].id);
  const [viewMode, setViewMode] = useState<'workflows' | 'nexus' | 'grid' | 'deployment' | 'tools' | 'permissions' | 'secrets' | 'fileManager' | 'chat'>('workflows');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isForgeOpen, setIsForgeOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isAgentWizardOpen, setIsAgentWizardOpen] = useState(false);
  const [isWorkflowWizardOpen, setIsWorkflowWizardOpen] = useState(false);
  const [isAddToolModalOpen, setIsAddToolModalOpen] = useState(false);
  const [isAddSecretModalOpen, setIsAddSecretModalOpen] = useState(false);

  const [tools, setTools] = useState<Tool[]>(MOCK_TOOLS);
  const [secrets, setSecrets] = useState<Secret[]>(MOCK_SECRETS);
  const [permissions, setPermissions] = useState<Permission[]>(MOCK_PERMISSIONS);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    openClaw: 'connected',
    gateway: 'online',
    channels: [
      { id: 'ch1', name: 'Slack', status: 'active' },
      { id: 'ch2', name: 'Discord', status: 'inactive' }
    ]
  });

  const activeProject = projects.find(p => p.id === activeProjectId) || null;

  useEffect(() => {
    (window as any).openWorkflowWizard = () => setIsWorkflowWizardOpen(true);
    (window as any).openAgentWizard = () => setIsAgentWizardOpen(true);
    (window as any).openAddToolModal = () => setIsAddToolModalOpen(true);
    (window as any).openAddSecretModal = () => setIsAddSecretModalOpen(true);
  }, []);

  const handleAddAgent = (agent: Agent) => {
    if (!activeProject) return;
    // Position new agent to the right of existing ones
    const maxX = activeProject.agents.reduce((max, a) => Math.max(max, a.position.x), 0);
    const newAgent = { ...agent, position: { x: maxX + 300, y: 100 } };
    
    setProjects(projects.map(p => 
      p.id === activeProjectId ? { ...p, agents: [...p.agents, newAgent] } : p
    ));
  };

  const handleAddWorkflow = (newAgents: Agent[], newConnections: Connection[]) => {
    if (!activeProject) return;
    // Position new agents to the right
    const maxX = activeProject.agents.reduce((max, a) => Math.max(max, a.position.x), 0);
    const positionedAgents = newAgents.map((a, idx) => ({
      ...a,
      position: { x: maxX + 300 + idx * 300, y: 100 }
    }));

    setProjects(projects.map(p => 
      p.id === activeProjectId ? { 
        ...p, 
        agents: [...p.agents, ...positionedAgents],
        connections: [...p.connections, ...newConnections]
      } : p
    ));
    setViewMode('nexus');
  };

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsConfigModalOpen(true);
  };

  const handleUpdateAgentConfig = (agentId: string, updates: Partial<Agent>) => {
    if (!activeProjectId) return;
    setProjects(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          agents: p.agents.map(a => a.id === agentId ? { ...a, ...updates } : a)
        };
      }
      return p;
    }));
    toast.success('Agent configuration updated.');
  };

  const handleAgentForge = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsForgeOpen(true);
  };

  const handleAgentMove = (id: string, x: number, y: number) => {
    if (!activeProject) return;
    setProjects(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          agents: p.agents.map(a => a.id === id ? { ...a, position: { x, y } } : a)
        };
      }
      return p;
    }));
  };

  const handleSaveAgent = (updatedAgent: Agent) => {
    if (!activeProject) return;
    setProjects(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        const agentExists = p.agents.some(a => a.id === updatedAgent.id);
        return {
          ...p,
          agents: agentExists 
            ? p.agents.map(a => a.id === updatedAgent.id ? updatedAgent : a)
            : [...p.agents, updatedAgent]
        };
      }
      return p;
    }));
    setIsForgeOpen(false);
    toast.success(`${updatedAgent.name} has been forged and saved.`);
  };

  const handleAgentComplete = (agent: Agent) => {
    if (!activeProject) return;
    setProjects(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          agents: [...p.agents, agent]
        };
      }
      return p;
    }));
    toast.success(`${agent.name} added to squad.`);
  };

  const handleWorkflowComplete = (newAgents: Agent[], newConnections: Connection[], outcome: any) => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: 'New Growth Funnel',
      description: 'Custom automated marketing pipeline.',
      agents: newAgents,
      connections: newConnections,
      globalUserContext: 'Automated growth funnel context.',
      outcome: outcome,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    setViewMode('nexus');
    toast.success('New workflow forged and deployed to The Nexus.');
  };

  const handleGenerateAvatar = async (name: string, role: string) => {
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `https://picsum.photos/seed/${name}-${role}-${Date.now()}/400/400`;
  };

  const handleRefine = async (fileKey: keyof Agent['files'], content: string, instruction?: string) => {
    if (!selectedAgent) return content;
    return await refineAgentFile(selectedAgent.name, selectedAgent.role, fileKey, content, instruction);
  };

  const handleNewProject = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: 'New Project',
      description: 'A new agent orchestration project.',
      agents: [],
      connections: [],
      globalUserContext: 'New workspace context.',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    setViewMode('workflows');
    toast.success('New workspace created.');
  };

  const handleExport = () => {
    if (!activeProject) return;
    
    const exportData = {
      version: '1.0.0',
      timestamp: Date.now(),
      project: activeProject,
      tools,
      secrets: secrets.map(s => ({ ...s, value: 'REDACTED' })), // Security first
      permissions
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `openclaw-${activeProject.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Project exported successfully for local OpenClaw runtime.');
  };

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans selection:bg-[#EE423E]/10 selection:text-[#EE423E]">
      <Toaster position="top-right" richColors />
      <Sidebar 
        projects={projects} 
        activeProjectId={activeProjectId} 
        onProjectSelect={setActiveProjectId}
        onNewProject={handleNewProject}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-6">
            <h2 className="text-sm font-bold text-gray-900 tracking-tight">
              {activeProject?.name}
            </h2>
            <div className="h-4 w-px bg-gray-200" />
            
            {/* Status Chips */}
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
                systemStatus.openClaw === 'connected' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
              )}>
                <Zap className="w-3 h-3" />
                OpenClaw: {systemStatus.openClaw}
              </div>
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
                systemStatus.gateway === 'online' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-gray-50 text-gray-600 border-gray-100"
              )}>
                <Globe className="w-3 h-3" />
                Gateway: {systemStatus.gateway}
              </div>
              {systemStatus.channels.map(channel => (
                <div key={channel.id} className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
                  channel.status === 'active' ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-gray-50 text-gray-400 border-gray-100"
                )}>
                  <Network className="w-3 h-3" />
                  {channel.name}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsWorkflowWizardOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#EE423E]/10 text-[#EE423E] rounded-xl font-bold text-xs hover:bg-[#EE423E]/20 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              Forge Workflow
            </button>
            <button 
              onClick={() => setIsAgentWizardOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black transition-all shadow-lg shadow-black/10"
            >
              <Plus className="w-3.5 h-3.5" />
              Forge Agent
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
              <Share2 className="w-4 h-4" />
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-[#EE423E] text-white rounded-xl font-bold text-xs hover:bg-[#d63a36] transition-all shadow-lg shadow-[#EE423E]/20"
            >
              <Download className="w-3.5 h-3.5" />
              Export for Local
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {viewMode === 'workflows' && (
              <motion.div
                key="workflows"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <TheWorkflows 
                  projects={projects}
                  onProjectSelect={(id) => {
                    setActiveProjectId(id);
                    setViewMode('nexus');
                  }}
                  onNewWorkflow={() => setIsWorkflowWizardOpen(true)}
                />
              </motion.div>
            )}

            {viewMode === 'nexus' && activeProject && (
              <motion.div
                key="nexus"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="w-full h-full"
              >
                <TheNexus 
                  agents={activeProject.agents} 
                  connections={activeProject.connections}
                  project={activeProject}
                  onAgentMove={handleAgentMove}
                  onAgentClick={handleAgentClick}
                  onAgentForge={handleAgentForge}
                />
              </motion.div>
            )}

            {viewMode === 'grid' && activeProject && (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto h-full"
              >
                {activeProject.agents.map((agent) => (
                  <AgentCard 
                    key={agent.id} 
                    agent={agent} 
                    onClick={() => handleAgentClick(agent)}
                  />
                ))}
                <button 
                  onClick={() => setIsAgentWizardOpen(true)}
                  className="w-full h-[280px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-[#EE423E] hover:text-[#EE423E] transition-all bg-gray-50/50"
                >
                  <Plus className="w-8 h-8" />
                  <span className="text-xs font-bold uppercase tracking-widest">Forge New Agent</span>
                </button>
              </motion.div>
            )}

            {viewMode === 'deployment' && activeProject && (
              <motion.div
                key="deployment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 overflow-y-auto h-full max-w-4xl mx-auto w-full"
              >
                <DeploymentMap project={activeProject} />
              </motion.div>
            )}

            {viewMode === 'tools' && (
              <motion.div
                key="tools"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full overflow-y-auto"
              >
                <TheTools 
                  tools={tools}
                  onAddTool={(tool) => setTools([...tools, tool])}
                  onDeleteTool={(id) => setTools(tools.filter(t => t.id !== id))}
                  onOpenAddModal={() => setIsAddToolModalOpen(true)}
                />
              </motion.div>
            )}

            {viewMode === 'permissions' && (
              <motion.div
                key="permissions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full overflow-y-auto"
              >
                <ThePermissions 
                  permissions={permissions}
                  agents={activeProject?.agents || []}
                  onTogglePermission={(id, agentId) => {
                    if (agentId) {
                      // Toggle for specific agent
                      setProjects(projects.map(p => 
                        p.id === activeProjectId ? {
                          ...p,
                          agents: p.agents.map(a => 
                            a.id === agentId ? {
                              ...a,
                              permissions: a.permissions.includes(id)
                                ? a.permissions.filter(pid => pid !== id)
                                : [...a.permissions, id]
                            } : a
                          )
                        } : p
                      ));
                    } else {
                      // Toggle global
                      setPermissions(permissions.map(p => 
                        p.id === id ? { ...p, enabled: !p.enabled } : p
                      ));
                    }
                  }}
                />
              </motion.div>
            )}

            {viewMode === 'secrets' && (
              <motion.div
                key="secrets"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full overflow-y-auto"
              >
                <TheSecrets 
                  secrets={secrets}
                  onAddSecret={(secret) => setSecrets([...secrets, secret])}
                  onDeleteSecret={(id) => setSecrets(secrets.filter(s => s.id !== id))}
                  onOpenAddModal={() => setIsAddSecretModalOpen(true)}
                />
              </motion.div>
            )}

            {viewMode === 'fileManager' && (
              <motion.div
                key="fileManager"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full"
              >
                <TheFileManager />
              </motion.div>
            )}

            {viewMode === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full"
              >
                <TheChat agents={activeProject?.agents || []} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {selectedAgent && (
        <AgentConfigModal 
          agent={selectedAgent}
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          onSave={handleSaveAgent}
          availableTools={tools}
          availableSecrets={secrets}
          availablePermissions={permissions}
        />
      )}

      <TheForge 
        agent={selectedAgent}
        isOpen={isForgeOpen}
        onClose={() => setIsForgeOpen(false)}
        onSave={handleSaveAgent}
        onRefine={handleRefine}
        onGenerateAvatar={generateAgentAvatar}
      />

      <AgentWizard 
        isOpen={isAgentWizardOpen}
        onClose={() => setIsAgentWizardOpen(false)}
        onComplete={handleAddAgent}
        availableSecrets={secrets}
      />

      <WorkflowWizard 
        isOpen={isWorkflowWizardOpen}
        onClose={() => setIsWorkflowWizardOpen(false)}
        onComplete={handleAddWorkflow}
      />

      <AddToolModal 
        isOpen={isAddToolModalOpen}
        onClose={() => setIsAddToolModalOpen(false)}
        onAdd={(tool) => {
          setTools([...tools, tool]);
          toast.success(`Tool ${tool.name} registered successfully.`);
        }}
      />

      <AddSecretModal 
        isOpen={isAddSecretModalOpen}
        onClose={() => setIsAddSecretModalOpen(false)}
        onAdd={(secret) => {
          setSecrets([...secrets, secret]);
          toast.success(`Secret ${secret.name} added successfully.`);
        }}
      />
    </div>
  );
}
