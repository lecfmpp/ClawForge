import React from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import { Project } from '../types';

interface DeploymentMapProps {
  project: Project;
}

export const DeploymentMap: React.FC<DeploymentMapProps> = ({ project }) => {
  return (
    <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#EE423E]/10 flex items-center justify-center">
          <Folder className="w-4 h-4 text-[#EE423E]" />
        </div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Deployment Map</h3>
      </div>

      <div className="space-y-1 font-mono text-xs">
        <div className="flex items-center gap-2 text-gray-400">
          <span>/Users/leandro/OpenClaw_Teams/</span>
        </div>
        
        <div className="pl-4 border-l border-gray-100 ml-2 py-1 space-y-1">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <Folder className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{project.name}/</span>
          </div>

          <div className="pl-4 border-l border-gray-100 ml-2 py-1 space-y-1">
            <div className="flex items-center gap-2 text-gray-500">
              <File className="w-3.5 h-3.5" />
              <span>openclaw.json</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <File className="w-3.5 h-3.5" />
              <span>.env</span>
            </div>

            <div className="flex items-center gap-2 text-gray-900 font-bold mt-2">
              <Folder className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>main_workspace/</span>
            </div>
            <div className="pl-4 border-l border-gray-100 ml-2 py-1 space-y-1">
              <div className="flex items-center gap-2 text-gray-500">
                <File className="w-3.5 h-3.5" />
                <span>IDENTITY.md</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <File className="w-3.5 h-3.5" />
                <span>SOUL.md</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <File className="w-3.5 h-3.5" />
                <span>USER.md</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <File className="w-3.5 h-3.5" />
                <span>AGENTS.md</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-900 font-bold mt-2">
              <Folder className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>agents/</span>
            </div>
            <div className="pl-4 border-l border-gray-100 ml-2 py-1 space-y-1">
              {project.agents.map((agent) => (
                <div key={agent.id} className="flex items-center gap-2 text-gray-500">
                  <Folder className="w-3.5 h-3.5" />
                  <span>{agent.name}/</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
