import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Info, Search, Lock, Unlock, Zap, Cpu, Network, Users } from 'lucide-react';
import { Permission, Agent } from '../types';
import { cn } from '../lib/utils';

interface ThePermissionsProps {
  permissions: Permission[];
  onTogglePermission: (id: string, agentId?: string) => void;
  agents: Agent[];
}

export const ThePermissions: React.FC<ThePermissionsProps> = ({ permissions, onTogglePermission, agents }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedAgentId, setSelectedAgentId] = React.useState<string | 'global'>('global');

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  const filteredPermissions = permissions.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isPermissionEnabled = (permissionId: string) => {
    if (selectedAgentId === 'global') {
      return permissions.find(p => p.id === permissionId)?.enabled ?? false;
    }
    return selectedAgent?.permissions.includes(permissionId) ?? false;
  };

  const getScopeIcon = (scope: Permission['scope']) => {
    switch (scope) {
      case 'agent': return <Cpu className="w-3.5 h-3.5" />;
      case 'node': return <Zap className="w-3.5 h-3.5" />;
      case 'gateway': return <Network className="w-3.5 h-3.5" />;
      default: return <ShieldCheck className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Governance & Permissions</h2>
          <p className="text-gray-500 mt-1 text-sm">Control what agents, nodes, and gateways are allowed to do.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">System Secure</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search permissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EE423E]/10 transition-all"
          />
        </div>
        <div className="w-full md:w-64 relative">
          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EE423E]/10 transition-all appearance-none font-bold text-sm text-gray-700"
          >
            <option value="global">Global System</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {selectedAgentId === 'global' ? 'Global Permissions' : `Permissions for ${selectedAgent?.name}`}
          </h3>
        </div>
        <div className="divide-y divide-gray-50">
          {filteredPermissions.map((permission) => {
            const enabled = isPermissionEnabled(permission.id);
            return (
              <div 
                key={permission.id}
                className="group p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "mt-1 p-2 rounded-xl transition-colors",
                    enabled ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                  )}>
                    {enabled ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900">{permission.name}</h4>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-full text-[9px] font-black text-gray-500 uppercase tracking-widest">
                        {getScopeIcon(permission.scope)}
                        {permission.scope}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 max-w-md leading-relaxed">
                      {permission.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="relative group/tooltip">
                    <Info className="w-4 h-4 text-gray-300 cursor-help hover:text-gray-400 transition-colors" />
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-gray-900 text-white text-[10px] rounded-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none shadow-xl z-10">
                      <p className="leading-relaxed">
                        {selectedAgentId === 'global' 
                          ? `This permission affects all ${permission.scope}s globally.`
                          : `This specifically overrides permissions for ${selectedAgent?.name}.`}
                      </p>
                      <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900" />
                    </div>
                  </div>

                  <button
                    onClick={() => onTogglePermission(permission.id, selectedAgentId === 'global' ? undefined : selectedAgentId)}
                    className={cn(
                      "relative w-12 h-6 rounded-full transition-all duration-300",
                      enabled ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-gray-200"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm",
                      enabled ? "translate-x-6" : "translate-x-0"
                    )} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPermissions.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-gray-500">No permissions found matching your search.</p>
          </div>
        )}
      </div>

      <div className="bg-[#EE423E]/5 border border-[#EE423E]/10 rounded-3xl p-6 flex items-start gap-4">
        <div className="p-2 bg-[#EE423E] text-white rounded-xl">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-1">
            {selectedAgentId === 'global' ? 'Global Security Override' : 'Agent Specific Governance'}
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            {selectedAgentId === 'global' 
              ? 'These settings are applied globally across the entire orchestration layer.'
              : `These permissions are specifically tailored for ${selectedAgent?.name} and override global defaults.`}
          </p>
        </div>
      </div>
    </div>
  );
};
