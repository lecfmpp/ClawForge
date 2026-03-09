import React, { useState } from 'react';
import { Plus, LayoutGrid, Settings, LogOut, Briefcase, ChevronLeft, ChevronRight, Menu, FolderTree, Zap, Users, Wrench, ShieldCheck, Key, MessageSquare } from 'lucide-react';
import { Project } from '../types';
import { cn } from '../lib/utils';
import { FileExplorer, FileNode } from './FileExplorer';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onProjectSelect: (id: string) => void;
  onNewProject: () => void;
  viewMode: 'workflows' | 'nexus' | 'grid' | 'deployment' | 'tools' | 'permissions' | 'secrets' | 'fileManager' | 'chat';
  onViewModeChange: (mode: 'workflows' | 'nexus' | 'grid' | 'deployment' | 'tools' | 'permissions' | 'secrets' | 'fileManager' | 'chat') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  projects, 
  activeProjectId, 
  onProjectSelect, 
  onNewProject,
  viewMode,
  onViewModeChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const activeProject = projects.find(p => p.id === activeProjectId);

  const projectStructure: FileNode[] = activeProject ? [
    {
      id: 'ws-root',
      name: activeProject.name.toLowerCase().replace(/\s+/g, '_'),
      type: 'folder',
      category: 'workspace',
      description: 'The root workspace directory. All project assets are contained here.',
      isOpen: true,
      children: [
        {
          id: 'config',
          name: 'openclaw.json',
          type: 'file',
          category: 'defaultFiles',
          description: 'Global configuration for the OpenClaw orchestration engine.'
        },
        {
          id: 'agents-dir',
          name: 'agents',
          type: 'folder',
          category: 'agents',
          description: 'Contains specialized agent definitions and their internal logic.',
          isOpen: true,
          children: activeProject.agents.map(agent => ({
            id: `agent-${agent.id}`,
            name: agent.name.toLowerCase().replace(/\s+/g, '_'),
            type: 'folder',
            category: 'agents',
            description: `The infrastructure for ${agent.name}.`,
            children: [
              { id: `soul-${agent.id}`, name: 'soul.md', type: 'file', category: 'agents', description: 'Behavioral logic.' },
              { id: `identity-${agent.id}`, name: 'identity.md', type: 'file', category: 'agents', description: 'Role & Persona.' }
            ]
          }))
        },
        {
          id: 'files-dir',
          name: 'files',
          type: 'folder',
          category: 'files',
          description: 'Shared assets, datasets, and intermediate files used by the squad.'
        },
        {
          id: 'logs-dir',
          name: 'logs',
          type: 'folder',
          category: 'logs',
          description: 'Real-time execution traces and audit logs.'
        },
        {
          id: 'memories-dir',
          name: 'memories',
          type: 'folder',
          category: 'memories',
          description: 'Persistent knowledge bases and vector storage.'
        }
      ]
    }
  ] : [];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={cn(
          "lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-300",
          isMobileOpen && "left-[220px]"
        )}
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>

      {/* Sidebar Container */}
      <div className={cn(
        "fixed lg:relative top-0 left-0 h-full bg-white border-r border-gray-100 flex flex-col transition-all duration-300 z-50 shrink-0",
        isCollapsed ? "w-20" : "w-64",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Collapse Toggle (Desktop) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-100 rounded-full items-center justify-center shadow-sm z-10 hover:bg-gray-50"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        <div className={cn("p-6 border-b border-gray-100", isCollapsed && "px-4", !isCollapsed && "pl-16 lg:pl-6")}>
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-10 h-10 bg-[#EE423E] rounded-xl flex items-center justify-center shadow-lg shadow-[#EE423E]/20">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h1 className="text-lg font-black text-gray-900 tracking-tighter whitespace-nowrap">CLAWFORGE</h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Orchestration Layer</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          {/* Workspaces (Moved to top) */}
          <div>
            <div className={cn("flex items-center justify-between px-2 mb-4", isCollapsed && "justify-center")}>
              {!isCollapsed && <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Workspaces</h3>}
              <button 
                onClick={onNewProject}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    onProjectSelect(project.id);
                    setIsMobileOpen(false);
                  }}
                  title={project.name}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left",
                    activeProjectId === project.id 
                      ? "bg-[#EE423E]/5 text-[#EE423E] font-bold" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <Briefcase className={cn("w-4 h-4 shrink-0", activeProjectId === project.id ? "text-[#EE423E]" : "text-gray-400")} />
                  {!isCollapsed && <span className="text-sm truncate">{project.name}</span>}
                  {!isCollapsed && activeProjectId === project.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#EE423E]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-1">
            <button
              onClick={() => onViewModeChange('chat')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left",
                viewMode === 'chat'
                  ? "bg-[#EE423E]/5 text-[#EE423E] font-bold" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                isCollapsed && "justify-center px-0"
              )}
            >
              <MessageSquare className={cn("w-4 h-4 shrink-0", viewMode === 'chat' ? "text-[#EE423E]" : "text-gray-400")} />
              {!isCollapsed && <span className="text-sm">Agent Chat</span>}
            </button>
            <button
              onClick={() => onViewModeChange('workflows')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left",
                viewMode === 'workflows' || viewMode === 'nexus'
                  ? "bg-[#EE423E]/5 text-[#EE423E] font-bold" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Zap className={cn("w-4 h-4 shrink-0", (viewMode === 'workflows' || viewMode === 'nexus') ? "text-[#EE423E]" : "text-gray-400")} />
              {!isCollapsed && <span className="text-sm">Workflow Builder</span>}
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left",
                viewMode === 'grid' 
                  ? "bg-[#EE423E]/5 text-[#EE423E] font-bold" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Users className={cn("w-4 h-4 shrink-0", viewMode === 'grid' ? "text-[#EE423E]" : "text-gray-400")} />
              {!isCollapsed && <span className="text-sm">The Workforce</span>}
            </button>
            <button
              onClick={() => onViewModeChange('fileManager')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left",
                viewMode === 'fileManager' 
                  ? "bg-[#EE423E]/5 text-[#EE423E] font-bold" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                isCollapsed && "justify-center px-0"
              )}
            >
              <FolderTree className={cn("w-4 h-4 shrink-0", viewMode === 'fileManager' ? "text-[#EE423E]" : "text-gray-400")} />
              {!isCollapsed && <span className="text-sm">File Manager</span>}
            </button>
            <button
              onClick={() => onViewModeChange('tools')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left",
                viewMode === 'tools' 
                  ? "bg-[#EE423E]/5 text-[#EE423E] font-bold" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Wrench className={cn("w-4 h-4 shrink-0", viewMode === 'tools' ? "text-[#EE423E]" : "text-gray-400")} />
              {!isCollapsed && <span className="text-sm">Tools</span>}
            </button>
            <button
              onClick={() => onViewModeChange('permissions')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left",
                viewMode === 'permissions' 
                  ? "bg-[#EE423E]/5 text-[#EE423E] font-bold" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                isCollapsed && "justify-center px-0"
              )}
            >
              <ShieldCheck className={cn("w-4 h-4 shrink-0", viewMode === 'permissions' ? "text-[#EE423E]" : "text-gray-400")} />
              {!isCollapsed && <span className="text-sm">Permissions</span>}
            </button>
            <button
              onClick={() => onViewModeChange('secrets')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left",
                viewMode === 'secrets' 
                  ? "bg-[#EE423E]/5 text-[#EE423E] font-bold" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Key className={cn("w-4 h-4 shrink-0", viewMode === 'secrets' ? "text-[#EE423E]" : "text-gray-400")} />
              {!isCollapsed && <span className="text-sm">Secrets</span>}
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 space-y-1">
          <button className={cn("w-full flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all", isCollapsed && "justify-center")}>
            <Settings className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
          </button>
          <button className={cn("w-full flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all", isCollapsed && "justify-center")}>
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        />
      )}
    </>
  );
};
