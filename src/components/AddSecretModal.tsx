import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Save, Info, Eye, EyeOff } from 'lucide-react';
import { Secret } from '../types';

interface AddSecretModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (secret: Secret) => void;
}

export const AddSecretModal: React.FC<AddSecretModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    value: '',
    description: '',
  });
  const [showValue, setShowValue] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSecret: Secret = {
      id: `secret-${Date.now()}`,
      name: formData.name,
      key: formData.key,
      value: formData.value,
      description: formData.description,
    };
    onAdd(newSecret);
    onClose();
    setFormData({ name: '', key: '', value: '', description: '' });
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
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Add New Secret</h2>
                <p className="text-xs font-bold text-[#EE423E] uppercase tracking-widest">Secure API Keys & Tokens</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Display Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. OpenAI Production Key"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE423E]/10 focus:border-[#EE423E] transition-all font-bold text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Environment Key</label>
                <input
                  required
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="e.g. OPENAI_API_KEY"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE423E]/10 focus:border-[#EE423E] transition-all font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secret Value</label>
                <div className="relative">
                  <input
                    required
                    type={showValue ? "text" : "password"}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="sk-..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE423E]/10 focus:border-[#EE423E] transition-all font-mono text-sm pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowValue(!showValue)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-400"
                  >
                    {showValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What is this secret used for?"
                  className="w-full h-20 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EE423E]/10 focus:border-[#EE423E] transition-all text-sm resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-300" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Encrypted at rest</span>
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 bg-[#EE423E] text-white rounded-2xl font-bold text-sm hover:bg-[#d63a36] transition-all shadow-lg shadow-[#EE423E]/20"
                >
                  <Save className="w-4 h-4" />
                  Save Secret
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
