import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Plus, Search, Eye, EyeOff, Copy, Trash2, Clock, ShieldAlert } from 'lucide-react';
import { Secret } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface TheSecretsProps {
  secrets: Secret[];
  onAddSecret: (secret: Secret) => void;
  onDeleteSecret: (id: string) => void;
  onOpenAddModal?: () => void;
}

export const TheSecrets: React.FC<TheSecretsProps> = ({ secrets, onAddSecret, onDeleteSecret, onOpenAddModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());

  const toggleVisibility = (id: string) => {
    const next = new Set(visibleSecrets);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setVisibleSecrets(next);
  };

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success('Secret copied to clipboard');
  };

  const filteredSecrets = secrets.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Secrets & API Keys</h2>
          <p className="text-gray-500 mt-1 text-sm">Securely store credentials for agent tools and integrations.</p>
        </div>
        <button 
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-black/10"
        >
          <Plus className="w-4 h-4" />
          Add New Secret
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text"
          placeholder="Search secrets by name or key..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredSecrets.map((secret) => (
          <motion.div
            key={secret.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group bg-white border border-gray-100 rounded-3xl p-6 hover:border-gray-200 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-gray-900 transition-colors">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{secret.name}</h4>
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{secret.key}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 mr-4">
                  <code className="text-xs font-mono text-gray-600">
                    {visibleSecrets.has(secret.id) ? secret.value : '••••••••••••••••'}
                  </code>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => toggleVisibility(secret.id)}
                      className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {visibleSecrets.has(secret.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button 
                      onClick={() => copyToClipboard(secret.value)}
                      className="p-1.5 hover:bg-white rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onDeleteSecret(secret.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
              <p className="text-[10px] text-gray-400 leading-relaxed max-w-md">
                {secret.description}
              </p>
              <div className="flex items-center gap-2 text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                <Clock className="w-3 h-3" />
                Last used: {secret.lastUsed ? new Date(secret.lastUsed).toLocaleDateString() : 'Never'}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredSecrets.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-gray-500">No secrets found matching your search.</p>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex items-start gap-4">
        <div className="p-2 bg-amber-500 text-white rounded-xl">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-1">Security Best Practices</h4>
          <p className="text-xs text-amber-700 leading-relaxed">
            Secrets are encrypted at rest and only decrypted during agent execution. Never share your API keys or tokens in soul.md or identity.md files. Always use the secret reference key instead.
          </p>
        </div>
      </div>
    </div>
  );
};
