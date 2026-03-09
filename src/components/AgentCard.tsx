import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Brain, Activity } from 'lucide-react';
import { Agent } from '../types';
import { cn } from '../lib/utils';

interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
  className?: string;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick, className }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, translateY: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-64 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer",
        "border-b-4 border-b-[#EE423E]/20",
        className
      )}
    >
      {/* Header */}
      <div className="relative h-32 bg-gray-50 flex items-center justify-center overflow-hidden">
        <img 
          src={agent.avatarUrl || `https://picsum.photos/seed/${agent.name}/400/200`} 
          alt={agent.name}
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        <div className="absolute bottom-2 left-4">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">{agent.name}</h3>
          <p className="text-xs font-medium text-[#EE423E] uppercase tracking-wider">{agent.role}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Trust Level</span>
            <span>{agent.trustLevel}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${agent.trustLevel}%` }}
              className="h-full bg-[#EE423E]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {agent.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="px-2 py-0.5 bg-gray-50 text-[10px] font-mono text-gray-500 rounded border border-gray-100">
              {skill}
            </span>
          ))}
          {agent.skills.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-50 text-[10px] font-mono text-gray-400 rounded border border-gray-100">
              +{agent.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">{agent.model}</span>
        </div>
        <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
      </div>
    </motion.div>
  );
};
