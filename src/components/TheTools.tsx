import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Plus, Search, ExternalLink, Trash2, Settings2, Shield } from 'lucide-react';
import { Tool } from '../types';
import { cn } from '../lib/utils';

interface TheToolsProps {
  tools: Tool[];
  onAddTool: (tool: Tool) => void;
  onDeleteTool: (id: string) => void;
  onOpenAddModal?: () => void;
}

export const TheTools: React.FC<TheToolsProps> = ({ tools, onAddTool, onDeleteTool, onOpenAddModal }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Tools & Integrations</h2>
          <p className="text-gray-500 mt-1 text-sm">Manage the capabilities available to your agents.</p>
        </div>
        <button 
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-[#EE423E] text-white rounded-2xl font-bold text-sm hover:bg-[#d63a36] transition-all shadow-lg shadow-[#EE423E]/20"
        >
          <Plus className="w-4 h-4" />
          Register New Tool
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text"
          placeholder="Search tools by name or capability..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EE423E]/10 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <motion.div
            key={tool.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 group-hover:bg-[#EE423E] group-hover:text-white transition-colors">
                <Wrench className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600">
                  <Settings2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onDeleteTool(tool.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-black text-gray-900 mb-2">{tool.name}</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6 line-clamp-2">
              {tool.description}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Tool</span>
              </div>
              <button className="text-[10px] font-black text-[#EE423E] uppercase tracking-widest flex items-center gap-1 hover:underline">
                Documentation
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}

        {filteredTools.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No tools found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or register a new tool.</p>
          </div>
        )}
      </div>
    </div>
  );
};
