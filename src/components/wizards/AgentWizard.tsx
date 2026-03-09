import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Sparkles, User, Shield, Cpu, Zap, Check, Globe, Search, Briefcase, Code, Palette, Megaphone, BarChart, Users, FileText, Layout, Upload, File, Trash2 } from 'lucide-react';
import { Agent } from '../../types';
import { COLORS, DEFAULT_SOUL, DEFAULT_IDENTITY, DEFAULT_AGENTS, DEFAULT_MEMORY } from '../../constants';
import { cn } from '../../lib/utils';

interface AgentWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (agent: Agent) => void;
  availableSecrets?: { id: string; name: string; key: string; value: string }[];
}

const STEPS = [
  { id: 'role', title: 'Define Role', description: 'What is the primary purpose of this agent?' },
  { id: 'identity', title: 'Identity', description: 'Give your agent a name and personality.' },
  { id: 'context', title: 'Context & Knowledge', description: 'Provide background info or files to customize your agent.' },
  { id: 'capabilities', title: 'Capabilities', description: 'Select models and initial skill sets.' },
  { id: 'review', title: 'Review', description: 'Confirm your agent configuration.' }
];

const PREBUILT_ROLES = [
  { id: 'graphic_designer', label: 'Graphic Designer', icon: Palette, desc: 'Visual identity and asset creation' },
  { id: 'performance_ads', label: 'Performance Ads Manager', icon: Megaphone, desc: 'Paid traffic and ROI optimization' },
  { id: 'seo_analyst', label: 'SEO Analyst', icon: Search, desc: 'Search visibility and ranking strategy' },
  { id: 'landing_page', label: 'Landing Page Builder', icon: Layout, desc: 'Conversion-focused page architecture' },
  { id: 'backend_dev', label: 'Software Developer Backend', icon: Code, desc: 'Server-side logic and API systems' },
  { id: 'frontend_dev', label: 'Software Developer Frontend', icon: Layout, desc: 'User interface and client-side logic' },
  { id: 'accounting', label: 'Accounting', icon: FileText, desc: 'Financial records and bookkeeping' },
  { id: 'financial_assistant', label: 'Financial Assistant', icon: BarChart, desc: 'Budgeting and financial planning' },
  { id: 'hr_manager', label: 'HR Manager', icon: Users, desc: 'Talent acquisition and team culture' },
  { id: 'ceo_assistant', label: 'CEO Assistant', icon: Briefcase, desc: 'Executive support and strategic ops' },
  { id: 'cto_assistant', label: 'CTO Assistant', icon: Cpu, desc: 'Technical leadership and R&D support' },
  { id: 'marketing_assistant', label: 'Marketing Assistant', icon: Megaphone, desc: 'Campaign support and distribution' },
  { id: 'youtube_analytics', label: 'YouTube Analytics Assistant', icon: BarChart, desc: 'Video performance and audience growth' },
  { id: 'tiktok_researcher', label: 'TikTok Researcher', icon: Search, desc: 'Trend analysis and viral research' },
  { id: 'reddit_researcher', label: 'Reddit Researcher', icon: Search, desc: 'Community insights and sentiment analysis' },
  { id: 'copywriter', label: 'Copywriter', icon: FileText, desc: 'Persuasive writing and storytelling' },
  { id: 'ui_designer', label: 'User Interface Designer', icon: Palette, desc: 'Visual design systems and interfaces' },
  { id: 'ux_designer', label: 'User Experience Designer', icon: Users, desc: 'User journeys and interaction flows' },
  { id: 'researcher', label: 'Researcher', icon: Globe, desc: 'Gathers and synthesizes web data' },
  { id: 'strategist', label: 'Strategist', icon: Shield, desc: 'Plans and optimizes workflows' },
  { id: 'creator', label: 'Creator', icon: Sparkles, desc: 'Generates content and assets' },
  { id: 'executor', label: 'Executor', icon: Zap, desc: 'Performs API actions and deployments' }
];

export const AgentWizard: React.FC<AgentWizardProps> = ({ isOpen, onClose, onComplete, availableSecrets = [] }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    model: 'Deepseek v3' as Agent['model'],
    skills: [] as string[],
    contextText: '',
    contextFiles: [] as { name: string; type: string; size: number }[],
  });

  const filteredRoles = useMemo(() => {
    return PREBUILT_ROLES.filter(role => 
      role.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const newAgent: Agent = {
        id: `agent-${Date.now()}`,
        name: formData.name,
        role: formData.role,
        avatarUrl: `https://picsum.photos/seed/${formData.name}/400/200`,
        model: formData.model,
        trustLevel: 50,
        skills: formData.skills,
        inputs: [],
        outputs: [],
        tools: [],
        secrets: [],
        permissions: [],
        context: {
          text: formData.contextText,
          files: formData.contextFiles
        },
        position: { x: 100, y: 100 },
        files: {
          soul: DEFAULT_SOUL,
          identity: DEFAULT_IDENTITY,
          agents: DEFAULT_AGENTS,
          memory: DEFAULT_MEMORY
        }
      };
      onComplete(newAgent);
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
        className="relative w-full max-w-3xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col h-[85vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-[#EE423E]/10 text-[#EE423E] text-[10px] font-black uppercase tracking-widest rounded-full">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">{STEPS[currentStep].title}</h2>
            </div>
            <p className="text-sm text-gray-500">{STEPS[currentStep].description}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-gray-100 flex">
          {STEPS.map((_, idx) => (
            <div 
              key={idx}
              className={cn(
                "flex-1 transition-all duration-500",
                idx <= currentStep ? "bg-[#EE423E]" : "bg-transparent"
              )}
            />
          ))}
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
                <div className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for a role (e.g. SEO, Designer, Developer...)"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#EE423E] focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {filteredRoles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setFormData({ ...formData, role: role.label })}
                        className={cn(
                          "p-6 rounded-2xl border-2 text-left transition-all group",
                          formData.role === role.label 
                            ? "border-[#EE423E] bg-[#EE423E]/5 shadow-lg shadow-[#EE423E]/10" 
                            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        <role.icon className={cn(
                          "w-8 h-8 mb-4 transition-all",
                          formData.role === role.label ? "text-[#EE423E]" : "text-gray-400 group-hover:text-gray-600"
                        )} />
                        <h4 className="font-bold text-gray-900 mb-1">{role.label}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{role.desc}</p>
                      </button>
                    ))}
                    {filteredRoles.length === 0 && (
                      <div className="col-span-2 py-12 text-center">
                        <p className="text-gray-400 font-bold">No roles found matching "{searchQuery}"</p>
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="mt-2 text-[#EE423E] text-xs font-bold uppercase tracking-widest"
                        >
                          Clear Search
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Agent Designation</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. W-Research-01"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#EE423E] focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900"
                      />
                    </div>
                  </div>
                  <div className="p-6 bg-[#EE423E]/5 rounded-2xl border border-[#EE423E]/10">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                        <Sparkles className="w-6 h-6 text-[#EE423E]" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-gray-900 mb-1">Personality Matrix</h5>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Your agent will be initialized with a professional, task-oriented persona based on the {formData.role || 'selected'} role.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contextual Knowledge</label>
                    <textarea 
                      value={formData.contextText}
                      onChange={(e) => setFormData({ ...formData, contextText: e.target.value })}
                      placeholder="Paste instructions, background info, or specific knowledge for this agent..."
                      className="w-full h-40 p-6 bg-gray-50 border-2 border-transparent focus:border-[#EE423E] focus:bg-white rounded-2xl outline-none transition-all font-medium text-sm text-gray-900 resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reference Files</label>
                    <div className="grid grid-cols-1 gap-3">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-[#EE423E]/40 transition-all group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#EE423E] mb-2" />
                          <p className="text-xs font-bold text-gray-500">Click to upload PDF, Images, or Text</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          multiple 
                          onChange={(e) => {
                            if (e.target.files) {
                              const newFiles = Array.from(e.target.files).map(f => ({
                                name: f.name,
                                type: f.type,
                                size: f.size
                              }));
                              setFormData({ ...formData, contextFiles: [...formData.contextFiles, ...newFiles] });
                            }
                          }}
                        />
                      </label>

                      {formData.contextFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                              <File className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{file.name}</p>
                              <p className="text-[10px] text-gray-400 uppercase font-bold">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setFormData({
                              ...formData,
                              contextFiles: formData.contextFiles.filter((_, i) => i !== idx)
                            })}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Neural Model</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Deepseek v3', 'Kimi K2.5', 'Haiku'].map((m) => (
                        <button
                          key={m}
                          onClick={() => setFormData({ ...formData, model: m as Agent['model'] })}
                          className={cn(
                            "py-3 rounded-xl border-2 font-bold text-xs transition-all",
                            formData.model === m 
                              ? "border-[#EE423E] bg-[#EE423E] text-white shadow-lg shadow-[#EE423E]/20" 
                              : "border-gray-100 text-gray-500 hover:border-gray-200"
                          )}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Initial Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {['/web_search', '/data_analysis', '/content_gen', '/api_call', '/file_ops'].map((skill) => (
                        <button
                          key={skill}
                          onClick={() => {
                            const newSkills = formData.skills.includes(skill)
                              ? formData.skills.filter(s => s !== skill)
                              : [...formData.skills, skill];
                            setFormData({ ...formData, skills: newSkills });
                          }}
                          className={cn(
                            "px-4 py-2 rounded-full border text-[10px] font-bold transition-all",
                            formData.skills.includes(skill)
                              ? "bg-gray-900 border-gray-900 text-white"
                              : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
                          )}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Secrets Status */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Required Secrets Status</label>
                    <div className="space-y-3">
                      {formData.skills.map(skill => {
                        const requiredSecret = skill === '/api_call' ? 'Meta API Key' : 
                                             skill === '/web_search' ? 'Google Search API' : null;
                        if (!requiredSecret) return null;

                        const secret = availableSecrets.find(s => s.name === requiredSecret);
                        const isValid = secret && secret.value && secret.value.length > 0;

                        return (
                          <div key={skill} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <Shield className="w-4 h-4 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-900">{requiredSecret}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Required for {skill}</p>
                              </div>
                            </div>
                            <div className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                              isValid ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                            )}>
                              {isValid ? 'Valid' : 'Not Set'}
                            </div>
                          </div>
                        );
                      })}
                      {formData.skills.every(s => s !== '/api_call' && s !== '/web_search') && (
                        <p className="text-xs text-gray-400 italic ml-1">No specific secrets required for selected skills.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                        <User className="w-10 h-10 text-[#EE423E]" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{formData.name || 'Unnamed Agent'}</h3>
                        <p className="text-sm font-bold text-[#EE423E] uppercase tracking-widest">{formData.role}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Model</h5>
                        <p className="text-sm font-bold text-gray-900">{formData.model}</p>
                      </div>
                      <div>
                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Skills</h5>
                        <p className="text-sm font-bold text-gray-900">{formData.skills.length} Active</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-emerald-700 font-medium">
                      Configuration validated. Ready for deployment to The Nexus.
                    </p>
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
            disabled={currentStep === 0 && !formData.role || currentStep === 1 && !formData.name}
            className="flex items-center gap-2 px-8 py-3 bg-[#EE423E] text-white rounded-xl font-bold text-sm hover:bg-[#d63a36] transition-all shadow-lg shadow-[#EE423E]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === STEPS.length - 1 ? 'Deploy Agent' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
