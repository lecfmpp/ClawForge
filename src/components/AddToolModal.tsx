import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wrench, Save, Info } from 'lucide-react';
import { Tool } from '../types';
import { cn } from '../lib/utils';

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tool: Tool) => void;
}

export const AddToolModal: React.FC<AddToolModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'marketing' as Tool['category'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTool: Tool = {
      id: `tool-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      icon: 'Wrench',
      config: {}
    };
    onAdd(newTool);
    onClose();
    setFormData({ name: '', description: '', category: 'marketing' });
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-white rounded-[32px] shadow-2xl z-[101] overflow-hidden border border-gray-100"
          >
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Register New Tool</h2>
                <p className="text-xs font-bold text-[#EE423E] uppercase tracking-widest">Expand Agent Capabilities</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tool Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Meta Ads Extractor"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE423E]/10 focus:border-[#EE423E] transition-all font-bold text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this tool does and how agents should use it..."
                  className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE423E]/10 focus:border-[#EE423E] transition-all text-sm resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {['marketing', 'communication', 'analysis', 'utility'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat as any })}
                      className={cn(
                        "py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                        formData.category === cat 
                          ? "bg-gray-900 border-gray-900 text-white shadow-md" 
                          : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-300" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Requires OpenClaw Sync</span>
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 bg-[#EE423E] text-white rounded-2xl font-bold text-sm hover:bg-[#d63a36] transition-all shadow-lg shadow-[#EE423E]/20"
                >
                  <Save className="w-4 h-4" />
                  Register Tool
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
