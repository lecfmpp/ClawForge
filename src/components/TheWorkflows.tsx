import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Zap, ArrowRight, Layers, Cpu, Globe } from 'lucide-react';
import { Project } from '../types';
import { cn } from '../lib/utils';

interface TheWorkflowsProps {
  projects: Project[];
  onProjectSelect: (id: string) => void;
  onNewWorkflow: () => void;
}

export const TheWorkflows: React.FC<TheWorkflowsProps> = ({ projects, onProjectSelect, onNewWorkflow }) => {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#fcfcfc]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Workflow Builder</h2>
            <p className="text-sm text-gray-500">Orchestrate multiple agents into powerful automated pipelines.</p>
          </div>
          <button 
            onClick={onNewWorkflow}
            className="flex items-center gap-2 px-6 py-3 bg-[#EE423E] text-white rounded-xl font-bold text-sm hover:bg-[#d63a36] transition-all shadow-lg shadow-[#EE423E]/20"
          >
            <Plus className="w-4 h-4" />
            New Workflow
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Card */}
          <motion.button
            whileHover={{ y: -4 }}
            onClick={onNewWorkflow}
            className="group relative h-[280px] rounded-[32px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 hover:border-[#EE423E]/40 transition-all bg-white/50 hover:bg-white"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-[#EE423E]/5 transition-all">
              <Plus className="w-8 h-8 text-gray-300 group-hover:text-[#EE423E]" />
            </div>
            <div className="text-center">
              <span className="block text-sm font-black text-gray-900 mb-1">Forge New Workflow</span>
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Start from scratch</span>
            </div>
          </motion.button>

          {/* Workflow Cards */}
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              onClick={() => onProjectSelect(project.id)}
              className="group bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer overflow-hidden flex flex-col h-[280px]"
            >
              <div className="p-8 flex-1">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-[#EE423E]/5 rounded-2xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-[#EE423E]" />
                  </div>
                  <div className="flex -space-x-2">
                    {project.agents.slice(0, 3).map((agent, i) => (
                      <div 
                        key={i} 
                        className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden"
                      >
                        <img 
                          src={agent.avatarUrl} 
                          alt={agent.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                    {project.agents.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400">
                        +{project.agents.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2 group-hover:text-[#EE423E] transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                  {project.description}
                </p>
              </div>

              <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{project.agents.length} Agents</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{project.connections.length} Steps</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#EE423E] group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
