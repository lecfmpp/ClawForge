import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Zap, Cpu, Globe, Sparkles, Shield, Layers, Plus, Trash2 } from 'lucide-react';
import { Agent, Connection } from '../../types';
import { COLORS, DEFAULT_SOUL, DEFAULT_IDENTITY, DEFAULT_AGENTS, DEFAULT_MEMORY } from '../../constants';
import { cn } from '../../lib/utils';

interface WorkflowWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (agents: Agent[], connections: Connection[], outcome: any) => void;
}

const STEPS = [
  { id: 'template', title: 'Choose Blueprint', description: 'Select a pre-configured workflow template.' },
  { id: 'agents', title: 'Configure Squad', description: 'Customize the agents in your workflow.' },
  { id: 'outcome', title: 'Define Outcome', description: 'What is the final goal of this orchestration?' }
];

const TEMPLATES = [
  {
    id: 'marketing',
    title: 'Growth Funnel',
    icon: Zap,
    description: 'Automated research, strategy, and ad creation pipeline.',
    agents: [
      { name: 'W-Research', role: 'Researcher', model: 'Deepseek v3' },
      { name: 'W-Strat', role: 'Strategist', model: 'Kimi K2.5' },
      { name: 'W-Create', role: 'Creator', model: 'Kimi K2.5' }
    ],
    outcome: {
      title: 'Growth Dashboard',
      type: 'url',
      value: 'https://growth-funnel-alpha.openclaw.io',
      description: 'Live marketing dashboard and campaign tracker.'
    }
  },
  {
    id: 'dev',
    title: 'Code Architect',
    icon: Cpu,
    description: 'Requirements analysis, architecture design, and code generation.',
    agents: [
      { name: 'Dev-Analyst', role: 'Researcher', model: 'Deepseek v3' },
      { name: 'Dev-Architect', role: 'Strategist', model: 'Kimi K2.5' },
      { name: 'Dev-Coder', role: 'Creator', model: 'Haiku' }
    ],
    outcome: {
      title: 'Project Repository',
      type: 'folder',
      value: '/workspaces/dev-architect/output',
      description: 'Complete project structure and source code.'
    }
  }
];

export const WorkflowWizard: React.FC<WorkflowWizardProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [outcome, setOutcome] = useState({
    title: '',
    type: 'url' as 'url' | 'code' | 'folder',
    value: '',
    description: ''
  });

  const handleTemplateSelect = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setAgents(template.agents.map((a, idx) => ({
        ...a,
        id: `agent-${Date.now()}-${idx}`,
        position: { x: 100 + idx * 300, y: 150 }
      })));
      if (template.outcome) {
        setOutcome(template.outcome as any);
      }
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const finalAgents: Agent[] = agents.map(a => ({
        ...a,
        avatarUrl: `https://picsum.photos/seed/${a.name}/400/200`,
        trustLevel: 50,
        skills: [],
        inputs: [],
        outputs: [],
        tools: [],
        secrets: [],
        permissions: [],
        files: {
          soul: DEFAULT_SOUL,
          identity: DEFAULT_IDENTITY,
          agents: DEFAULT_AGENTS,
          memory: DEFAULT_MEMORY
        }
      }));

      const connections: Connection[] = [];
      for (let i = 0; i < finalAgents.length - 1; i++) {
        connections.push({
          id: `conn-${Date.now()}-${i}`,
          from: finalAgents[i].id,
          to: finalAgents[i+1].id
        });
      }

      onComplete(finalAgents, connections, outcome);
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-3xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-[#EE423E]/10 text-[#EE423E] text-[10px] font-black uppercase tracking-widest rounded-full">
                Workflow Architect
              </span>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">{STEPS[currentStep].title}</h2>
            </div>
            <p className="text-sm text-gray-500">{STEPS[currentStep].description}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {currentStep === 0 && (
                <div className="grid grid-cols-2 gap-6">
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => handleTemplateSelect(tpl.id)}
                      className={cn(
                        "p-8 rounded-[24px] border-2 text-left transition-all group relative overflow-hidden",
                        selectedTemplate === tpl.id 
                          ? "border-[#EE423E] bg-[#EE423E]/5 shadow-xl shadow-[#EE423E]/10" 
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      <tpl.icon className={cn(
                        "w-10 h-10 mb-6 transition-all",
                        selectedTemplate === tpl.id ? "text-[#EE423E]" : "text-gray-400 group-hover:text-gray-600"
                      )} />
                      <h4 className="text-lg font-black text-gray-900 mb-2">{tpl.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed mb-6">{tpl.description}</p>
                      
                      <div className="flex items-center gap-1">
                        {tpl.agents.map((_, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white -ml-2 first:ml-0" />
                        ))}
                        <span className="text-[10px] font-bold text-gray-400 ml-2">{tpl.agents.length} Agents</span>
                      </div>
                    </button>
                  ))}
                  
                  <button className="p-8 rounded-[24px] border-2 border-dashed border-gray-200 text-center hover:border-[#EE423E]/30 transition-all group">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#EE423E]/5 transition-all">
                      <Plus className="w-6 h-6 text-gray-300 group-hover:text-[#EE423E]" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">Custom Blueprint</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Build from scratch</p>
                  </button>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {agents.map((agent, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 group">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 shrink-0">
                          <Layers className="w-6 h-6 text-[#EE423E]" />
                        </div>
                        <div className="flex-1">
                          <input 
                            type="text"
                            value={agent.name}
                            onChange={(e) => {
                              const newAgents = [...agents];
                              newAgents[idx].name = e.target.value;
                              setAgents(newAgents);
                            }}
                            className="bg-transparent font-bold text-gray-900 outline-none focus:text-[#EE423E] transition-colors"
                          />
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{agent.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500">
                            {agent.model}
                          </span>
                          <button 
                            onClick={() => setAgents(agents.filter((_, i) => i !== idx))}
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => setAgents([...agents, { name: 'New Agent', role: 'Researcher', model: 'Deepseek v3', id: `agent-${Date.now()}`, position: { x: 100, y: 100 } }])}
                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-400 hover:border-[#EE423E]/30 hover:text-[#EE423E] transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Agent to Squad
                  </button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="p-8 bg-gray-900 rounded-[32px] text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Zap className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-black tracking-tight mb-2">Final Orchestration</h3>
                      <p className="text-gray-400 text-sm mb-8">Define the ultimate goal of this agent squad.</p>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Outcome Title</label>
                          <input 
                            type="text"
                            value={outcome.title}
                            onChange={(e) => setOutcome({ ...outcome, title: e.target.value })}
                            placeholder="e.g. Marketing Campaign Dashboard"
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#EE423E] transition-all font-bold text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Type</label>
                            <select 
                              value={outcome.type}
                              onChange={(e) => setOutcome({ ...outcome, type: e.target.value as any })}
                              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#EE423E] transition-all font-bold text-white appearance-none"
                            >
                              <option value="url" className="bg-gray-900">URL</option>
                              <option value="folder" className="bg-gray-900">Folder</option>
                              <option value="code" className="bg-gray-900">Code</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Value</label>
                            <input 
                              type="text"
                              value={outcome.value}
                              onChange={(e) => setOutcome({ ...outcome, value: e.target.value })}
                              placeholder="e.g. https://..."
                              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#EE423E] transition-all font-bold text-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                          <textarea 
                            value={outcome.description}
                            onChange={(e) => setOutcome({ ...outcome, description: e.target.value })}
                            placeholder="Describe what this outcome represents..."
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#EE423E] transition-all font-bold text-white resize-none h-24"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'High Precision', icon: Shield },
                      { label: 'Max Velocity', icon: Zap },
                      { label: 'Cost Optimized', icon: Globe }
                    ].map((opt) => (
                      <div key={opt.label} className="p-4 rounded-2xl border border-gray-100 text-center">
                        <opt.icon className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{opt.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <button 
            onClick={handleBack}
            disabled={currentStep === 0}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all",
              currentStep === 0 ? "opacity-0 pointer-events-none" : "text-gray-500 hover:bg-white hover:shadow-sm"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <button 
            onClick={handleNext}
            disabled={currentStep === 0 && !selectedTemplate || currentStep === 1 && agents.length === 0}
            className="flex items-center gap-2 px-8 py-3 bg-[#EE423E] text-white rounded-xl font-bold text-sm hover:bg-[#d63a36] transition-all shadow-lg shadow-[#EE423E]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === STEPS.length - 1 ? 'Forge Workflow' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
