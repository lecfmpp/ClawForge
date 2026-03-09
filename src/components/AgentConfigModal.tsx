import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wrench, ShieldCheck, Key, Save, Info, Check } from 'lucide-react';
import { Agent, Tool, Secret, Permission } from '../types';
import { cn } from '../lib/utils';

interface AgentConfigModalProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAgent: Agent) => void;
  availableTools: Tool[];
  availableSecrets: Secret[];
  availablePermissions: Permission[];
}

export const AgentConfigModal: React.FC<AgentConfigModalProps> = ({
  agent,
  isOpen,
  onClose,
  onSave,
  availableTools,
  availableSecrets,
  availablePermissions
}) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'permissions' | 'secrets'>('tools');
  const [config, setConfig] = useState({
    tools: agent.tools || [],
    secrets: agent.secrets || [],
    permissions: agent.permissions || []
  });

  const toggleItem = (type: 'tools' | 'secrets' | 'permissions', id: string) => {
    setConfig(prev => {
      const current = prev[type];
      const next = current.includes(id) 
        ? current.filter(item => item !== id)
        : [...current, id];
      return { ...prev, [type]: next };
    });
  };

  const handleSave = () => {
    onSave({
      ...agent,
      tools: config.tools,
      secrets: config.secrets,
      permissions: config.permissions
    });
    onClose();
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] bg-white rounded-[32px] shadow-2xl z-[101] overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 overflow-hidden">
                  <img src={agent.avatarUrl} alt={agent.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Configure {agent.name}</h2>
                  <p className="text-xs font-bold text-[#EE423E] uppercase tracking-widest">Capabilities & Security</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex p-2 bg-gray-50 border-b border-gray-100">
              {[
                { id: 'tools', icon: Wrench, label: 'Tools' },
                { id: 'permissions', icon: ShieldCheck, label: 'Permissions' },
                { id: 'secrets', icon: Key, label: 'Secrets' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    activeTab === tab.id 
                      ? "bg-white text-[#EE423E] shadow-sm" 
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="h-[400px] overflow-y-auto p-6">
              {activeTab === 'tools' && (
                <div className="space-y-3">
                  {availableTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => toggleItem('tools', tool.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                        config.tools.includes(tool.id)
                          ? "bg-[#EE423E]/5 border-[#EE423E]/20"
                          : "bg-white border-gray-100 hover:border-gray-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          config.tools.includes(tool.id) ? "bg-[#EE423E] text-white" : "bg-gray-50 text-gray-400"
                        )}>
                          <Wrench className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{tool.name}</h4>
                          <p className="text-[10px] text-gray-500">{tool.description}</p>
                        </div>
                      </div>
                      {config.tools.includes(tool.id) && <Check className="w-4 h-4 text-[#EE423E]" />}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'permissions' && (
                <div className="space-y-3">
                  {availablePermissions.map((permission) => (
                    <button
                      key={permission.id}
                      onClick={() => toggleItem('permissions', permission.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                        config.permissions.includes(permission.id)
                          ? "bg-emerald-50 border-emerald-200"
                          : "bg-white border-gray-100 hover:border-gray-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          config.permissions.includes(permission.id) ? "bg-emerald-500 text-white" : "bg-gray-50 text-gray-400"
                        )}>
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{permission.name}</h4>
                          <p className="text-[10px] text-gray-500">{permission.description}</p>
                        </div>
                      </div>
                      {config.permissions.includes(permission.id) && <Check className="w-4 h-4 text-emerald-500" />}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'secrets' && (
                <div className="space-y-3">
                  {availableSecrets.map((secret) => (
                    <button
                      key={secret.id}
                      onClick={() => toggleItem('secrets', secret.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                        config.secrets.includes(secret.id)
                          ? "bg-gray-900 border-gray-800 text-white"
                          : "bg-white border-gray-100 hover:border-gray-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          config.secrets.includes(secret.id) ? "bg-white text-gray-900" : "bg-gray-50 text-gray-400"
                        )}>
                          <Key className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className={cn("text-sm font-bold", config.secrets.includes(secret.id) ? "text-white" : "text-gray-900")}>{secret.name}</h4>
                          <p className="text-[10px] text-gray-500">{secret.key}</p>
                        </div>
                      </div>
                      {config.secrets.includes(secret.id) && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-300" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Changes apply immediately</span>
              </div>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-3 bg-[#EE423E] text-white rounded-2xl font-bold text-sm hover:bg-[#d63a36] transition-all shadow-lg shadow-[#EE423E]/20"
              >
                <Save className="w-4 h-4" />
                Save Configuration
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
