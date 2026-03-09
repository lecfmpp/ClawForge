import React, { useState } from 'react';
import { Folder, File, Info, ChevronRight, ChevronDown, Cpu, Zap, Database, Terminal, FileText, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { COLORS } from '../constants';

export type FileCategory = 'workspace' | 'defaultFiles' | 'agents' | 'subAgents' | 'files' | 'logs' | 'memories';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  category: FileCategory;
  description: string;
  children?: FileNode[];
  isOpen?: boolean;
}

interface FileExplorerProps {
  data: FileNode[];
  onFileClick?: (node: FileNode) => void;
  className?: string;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ data, onFileClick, className }) => {
  const [nodes, setNodes] = useState<FileNode[]>(data);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  const toggleNode = (id: string) => {
    const updateNodes = (list: FileNode[]): FileNode[] => {
      return list.map(node => {
        if (node.id === id) {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: updateNodes(node.children) };
        }
        return node;
      });
    };
    setNodes(updateNodes(nodes));
  };

  const getCategoryIcon = (category: FileCategory, type: 'file' | 'folder') => {
    if (type === 'folder') {
      switch (category) {
        case 'agents': return <Cpu className="w-4 h-4" />;
        case 'subAgents': return <Cpu className="w-4 h-4 opacity-70" />;
        case 'logs': return <Terminal className="w-4 h-4" />;
        case 'memories': return <Database className="w-4 h-4" />;
        case 'files': return <Folder className="w-4 h-4" />;
        default: return <Folder className="w-4 h-4" />;
      }
    } else {
      switch (category) {
        case 'defaultFiles': return <Settings className="w-4 h-4" />;
        case 'logs': return <FileText className="w-4 h-4" />;
        case 'memories': return <Database className="w-4 h-4" />;
        case 'agents': return <Zap className="w-4 h-4" />;
        default: return <File className="w-4 h-4" />;
      }
    }
  };

  const getCategoryColor = (category: FileCategory) => {
    return (COLORS as any).categories[category] || COLORS.text.primary;
  };

  const renderNode = (node: FileNode, level: number = 0) => {
    const isFolder = node.type === 'folder';
    const color = getCategoryColor(node.category);
    const isTooltipActive = activeTooltip === node.id;

    const handleMouseEnter = (e: React.MouseEvent, nodeId: string) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPos({ 
        top: rect.top, 
        left: rect.right + 16 
      });
      setActiveTooltip(nodeId);
    };

    return (
      <div key={node.id} className="select-none">
        <div 
          className={cn(
            "group flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all hover:bg-gray-50 relative",
            isTooltipActive && "bg-gray-50 ring-1 ring-gray-100"
          )}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={(e) => {
            if (isFolder) toggleNode(node.id);
            if (onFileClick) onFileClick(node);
            setActiveTooltip(isTooltipActive ? null : node.id);
          }}
          onMouseEnter={(e) => handleMouseEnter(e, node.id)}
          onMouseLeave={() => setActiveTooltip(null)}
        >
          {isFolder && (
            <div className="text-gray-400">
              {node.isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </div>
          )}
          {!isFolder && <div className="w-3" />}
          
          <div 
            className={cn(
              "p-1 rounded-md transition-all",
              isFolder ? "bg-white shadow-sm" : "bg-transparent"
            )}
            style={{ color }}
          >
            {getCategoryIcon(node.category, node.type)}
          </div>
          
          <span className={cn(
            "text-xs font-medium truncate transition-colors",
            isFolder ? "text-gray-900 font-bold" : "text-gray-600",
            isTooltipActive && "text-[#EE423E]"
          )}>
            {node.name}
          </span>

          {/* Tooltip - Fixed positioning to avoid clipping */}
          {isTooltipActive && (
            <div 
              className="fixed z-[9999] w-72 p-5 bg-white border border-gray-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in-95 duration-200 pointer-events-none"
              style={{ 
                top: `${tooltipPos.top}px`, 
                left: `${tooltipPos.left}px` 
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>
                    {node.category}
                  </span>
                </div>
                <div className="px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{node.type}</span>
                </div>
              </div>
              
              <h4 className="text-sm font-black text-gray-900 mb-2 flex items-center gap-2">
                {getCategoryIcon(node.category, node.type)}
                {node.name}
              </h4>
              
              <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                {node.description}
              </p>

              <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Info className="w-3 h-3 text-[#EE423E]" />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">OpenClaw Standard</span>
                </div>
                <div className="text-[9px] font-bold text-gray-300 italic">v1.0</div>
              </div>
              
              {/* Arrow */}
              <div className="absolute right-full top-4 border-8 border-transparent border-r-white drop-shadow-sm" />
            </div>
          )}
        </div>

        {isFolder && node.isOpen && node.children && (
          <div className="border-l border-gray-100 ml-4">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-0.5", className)}>
      {nodes.map(node => renderNode(node))}
    </div>
  );
};
