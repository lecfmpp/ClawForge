import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Save, 
  FileText, 
  Shield, 
  User, 
  Cpu, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  ArrowRightLeft, 
  FolderTree,
  Copy,
  Download
} from 'lucide-react';
import Markdown from 'react-markdown';
import { Agent } from '../types';
import { COLORS, DEFAULT_SOUL, DEFAULT_IDENTITY, DEFAULT_AGENTS, DEFAULT_MEMORY } from '../constants';
import { cn } from '../lib/utils';
import { FileExplorer, FileNode } from './FileExplorer';

import { toast } from 'sonner';

interface TheForgeProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAgent: Agent) => void;
  onRefine: (fileKey: keyof Agent['files'], currentContent: string, instruction?: string) => Promise<string>;
  onGenerateAvatar: (name: string, role: string) => Promise<string>;
}

export const TheForge: React.FC<TheForgeProps> = ({ agent, isOpen, onClose, onSave, onRefine, onGenerateAvatar }) => {
  const [activeTab, setActiveTab] = useState<keyof Agent['files'] | 'workflow'>('soul');
  const [editedAgent, setEditedAgent] = useState<Agent | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [refinementInstruction, setRefinementInstruction] = useState('');

  React.useEffect(() => {
    if (agent) {
      setEditedAgent(agent);
    }
  }, [agent]);

  if (!agent || !editedAgent) return null;

  const handleCopy = () => {
    if (activeTab === 'workflow') return;
    navigator.clipboard.writeText(editedAgent.files[activeTab]);
    toast.success('Content copied to clipboard!');
  };

  const handleExport = () => {
    if (activeTab === 'workflow') return;
    const content = editedAgent.files[activeTab];
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editedAgent.name.toLowerCase()}_${activeTab}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File exported as .md successfully!');
  };

  const agentFileTree: FileNode[] = [
    {
      id: 'agent-root',
      name: editedAgent.name,
      type: 'folder',
      category: 'agents',
      description: 'The root directory for this agent. Contains all logic, identity, and memory files.',
      isOpen: true,
      children: [
        {
          id: 'soul',
          name: 'soul.md',
          type: 'file',
          category: 'agents',
          description: 'The core behavioral logic and boundaries of the agent. Defines how it thinks and acts.'
        },
        {
          id: 'identity',
          name: 'identity.md',
          type: 'file',
          category: 'agents',
          description: 'The personality, mission, and role definition. Used for consistent interaction styles.'
        },
        {
          id: 'agents',
          name: 'agents.md',
          type: 'file',
          category: 'agents',
          description: 'The delegation manual. Defines how this agent interacts with other agents in the squad.'
        },
        {
          id: 'memory',
          name: 'memory.md',
          type: 'file',
          category: 'agents',
          description: 'Long-term context and project-specific learnings that persist across sessions.'
        },
        {
          id: 'workflow-folder',
          name: 'workflow',
          type: 'folder',
          category: 'files',
          description: 'Technical configuration for inputs, outputs, and tool integrations.',
          children: [
            {
              id: 'workflow',
              name: 'config.json',
              type: 'file',
              category: 'defaultFiles',
              description: 'Machine-readable configuration for the orchestration engine.'
            }
          ]
        }
      ]
    },
    {
      id: 'logs-root',
      name: 'logs',
      type: 'folder',
      category: 'logs',
      description: 'Execution logs and audit trails for this agent\'s activities.',
      children: [
        {
          id: 'latest-log',
          name: 'latest.log',
          type: 'file',
          category: 'logs',
          description: 'The most recent execution trace.'
        }
      ]
    },
    {
      id: 'memories-root',
      name: 'memories',
      type: 'folder',
      category: 'memories',
      description: 'Vector embeddings and structured knowledge bases for the agent.',
      children: [
        {
          id: 'knowledge-base',
          name: 'kb_v1.db',
          type: 'file',
          category: 'memories',
          description: 'Persistent knowledge storage.'
        }
      ]
    }
  ];

  const handleFileClick = (node: FileNode) => {
    if (node.type === 'file') {
      setActiveTab(node.id as any);
    }
  };

  const handleFileChange = (content: string) => {
    if (activeTab === 'workflow') return;
    setEditedAgent({ 
      ...editedAgent, 
      files: { ...editedAgent.files, [activeTab]: content } 
    });
  };

  const handleRefineClick = async () => {
    if (activeTab === 'workflow') return;
    
    if (!refinementInstruction.trim()) {
      toast.error('Please provide instructions for the AI Assistant before proceeding.');
      return;
    }

    setIsRefining(true);
    try {
      const refined = await onRefine(activeTab, editedAgent.files[activeTab], refinementInstruction);
      handleFileChange(refined);
      setRefinementInstruction(''); // Clear after success
      toast.success('Infrastructure refined successfully!');
    } catch (error) {
      toast.error('Failed to refine infrastructure. Please try again.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleAvatarGen = async () => {
    setIsGeneratingAvatar(true);
    try {
      const newAvatar = await onGenerateAvatar(editedAgent.name, editedAgent.role);
      setEditedAgent({ ...editedAgent, avatarUrl: newAvatar });
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const applyTemplate = () => {
    if (activeTab === 'workflow') return;
    const templates = {
      soul: DEFAULT_SOUL,
      identity: DEFAULT_IDENTITY,
      agents: DEFAULT_AGENTS,
      memory: DEFAULT_MEMORY
    };
    handleFileChange(templates[activeTab]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[800px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 overflow-hidden">
                    <img src={editedAgent.avatarUrl} alt={editedAgent.name} className="w-full h-full object-cover" />
                  </div>
                  <button 
                    onClick={handleAvatarGen}
                    disabled={isGeneratingAvatar}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#EE423E] text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {isGeneratingAvatar ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ImageIcon className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">{editedAgent.name}</h2>
                  <p className="text-xs font-bold text-[#EE423E] uppercase tracking-widest">{editedAgent.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg flex items-center gap-2">
                  <FolderTree className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">OpenClaw Structure</span>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Left Side: File Explorer */}
              <div className="w-64 border-r border-gray-100 bg-gray-50/30 overflow-y-auto p-4">
                <div className="mb-4 px-2">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Infrastructure</h3>
                </div>
                <FileExplorer 
                  data={agentFileTree} 
                  onFileClick={handleFileClick}
                />
              </div>

              {/* Right Side: Editor Area */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {activeTab === 'workflow' ? (
                  <div className="p-8 space-y-8 overflow-y-auto">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white">
                        <ArrowRightLeft className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">Workflow Configuration</h3>
                        <p className="text-xs text-gray-500">Define technical inputs, outputs, and skills.</p>
                      </div>
                    </div>
                    {/* Inputs */}
                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inputs</h3>
                        <button 
                          onClick={() => setEditedAgent({ ...editedAgent, inputs: [...editedAgent.inputs, ''] })}
                          className="p-1 text-[#EE423E] hover:bg-[#EE423E]/5 rounded"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {editedAgent.inputs.map((input, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input 
                              value={input}
                              onChange={(e) => {
                                const newInputs = [...editedAgent.inputs];
                                newInputs[idx] = e.target.value;
                                setEditedAgent({ ...editedAgent, inputs: newInputs });
                              }}
                              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-mono"
                              placeholder="e.g. meta_ads_data.json"
                            />
                            <button 
                              onClick={() => {
                                const newInputs = editedAgent.inputs.filter((_, i) => i !== idx);
                                setEditedAgent({ ...editedAgent, inputs: newInputs });
                              }}
                              className="p-2 text-gray-300 hover:text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Outputs */}
                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Outputs</h3>
                        <button 
                          onClick={() => setEditedAgent({ ...editedAgent, outputs: [...editedAgent.outputs, ''] })}
                          className="p-1 text-[#EE423E] hover:bg-[#EE423E]/5 rounded"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {editedAgent.outputs.map((output, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input 
                              value={output}
                              onChange={(e) => {
                                const newOutputs = [...editedAgent.outputs];
                                newOutputs[idx] = e.target.value;
                                setEditedAgent({ ...editedAgent, outputs: newOutputs });
                              }}
                              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-mono"
                              placeholder="e.g. strategy_brief.md"
                            />
                            <button 
                              onClick={() => {
                                const newOutputs = editedAgent.outputs.filter((_, i) => i !== idx);
                                setEditedAgent({ ...editedAgent, outputs: newOutputs });
                              }}
                              className="p-2 text-gray-300 hover:text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Tools */}
                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tools & Skills</h3>
                        <button 
                          onClick={() => setEditedAgent({ ...editedAgent, skills: [...editedAgent.skills, ''] })}
                          className="p-1 text-[#EE423E] hover:bg-[#EE423E]/5 rounded"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {editedAgent.skills.map((skill, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input 
                              value={skill}
                              onChange={(e) => {
                                const newSkills = [...editedAgent.skills];
                                newSkills[idx] = e.target.value;
                                setEditedAgent({ ...editedAgent, skills: newSkills });
                              }}
                              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-mono"
                              placeholder="e.g. /meta_ads_extractor"
                            />
                            <button 
                              onClick={() => {
                                const newSkills = editedAgent.skills.filter((_, i) => i !== idx);
                                setEditedAgent({ ...editedAgent, skills: newSkills });
                              }}
                              className="p-2 text-gray-300 hover:text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="relative flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">{activeTab.toUpperCase()}.md</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={handleCopy}
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={handleExport}
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
                          title="Export as .md"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={applyTemplate}
                          className="text-[10px] font-bold text-[#EE423E] uppercase tracking-widest hover:underline"
                        >
                          Apply Template
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 p-6 relative overflow-hidden">
                      <textarea
                        value={editedAgent.files[activeTab as keyof Agent['files']]}
                        onChange={(e) => handleFileChange(e.target.value)}
                        className="w-full h-full resize-none font-mono text-sm text-gray-700 focus:outline-none leading-relaxed"
                        placeholder={`Edit ${activeTab.toUpperCase()}.md...`}
                      />
                      
                      {/* AI Refinement Widget */}
                      <div className="absolute bottom-8 right-8 flex flex-col items-end gap-3">
                        <AnimatePresence>
                          {refinementInstruction.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl"
                            >
                              Ready to Refine
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <div className="flex items-center gap-2">
                          <input 
                            type="text"
                            value={refinementInstruction}
                            onChange={(e) => setRefinementInstruction(e.target.value)}
                            placeholder="Tell the AI what to change..."
                            className="w-64 px-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#EE423E]/20 transition-all"
                          />
                          <button
                            onClick={handleRefineClick}
                            disabled={isRefining}
                            className={cn(
                              "w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all shrink-0",
                              isRefining ? "bg-gray-100 animate-pulse" : "bg-[#EE423E] hover:scale-110 active:scale-95"
                            )}
                          >
                            <Sparkles className={cn("w-5 h-5", isRefining ? "text-gray-400" : "text-white")} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">W-Security Scanned</span>
                </div>
              </div>
              <button
                onClick={() => onSave(editedAgent)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#EE423E] text-white rounded-xl font-bold text-sm hover:bg-[#d63a36] transition-colors shadow-md shadow-[#EE423E]/20"
              >
                <Save className="w-4 h-4" />
                Save Infrastructure
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
