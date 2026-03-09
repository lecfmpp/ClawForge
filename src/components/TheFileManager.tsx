import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderTree, 
  FileCode, 
  Info, 
  ChevronRight, 
  Folder, 
  File, 
  Zap, 
  Shield, 
  Cpu, 
  Database,
  Edit3, 
  Save, 
  Sparkles, 
  Send, 
  CheckCircle2,
  Copy,
  Download,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface FileInfo {
  id: string;
  name: string;
  type: 'file' | 'folder';
  description: string;
  importance: 'critical' | 'important' | 'standard';
  content?: string;
  children?: FileInfo[];
}

const INITIAL_STRUCTURE: FileInfo[] = [
  {
    id: 'f1',
    name: 'soul',
    type: 'folder',
    description: 'The core behavioral engine of the agent. Defines how it thinks and reacts.',
    importance: 'critical',
    children: [
      { 
        id: 'f1-1',
        name: 'philosophy.md', 
        type: 'file', 
        description: 'High-level ethical and behavioral guidelines.', 
        importance: 'important',
        content: '# Agent Philosophy\n\n1. Always be helpful and honest.\n2. Prioritize user safety and privacy.\n3. Maintain a professional yet approachable tone.'
      },
      { 
        id: 'f1-2',
        name: 'logic.ts', 
        type: 'file', 
        description: 'Decision-making algorithms and reasoning patterns.', 
        importance: 'critical',
        content: 'export const decide = (input: string) => {\n  // Core reasoning logic\n  return input.length > 10 ? "complex" : "simple";\n};'
      }
    ]
  },
  {
    id: 'f2',
    name: 'identity',
    type: 'folder',
    description: 'Defines the agent\'s persona, tone of voice, and public-facing character.',
    importance: 'important',
    children: [
      { 
        id: 'f2-1',
        name: 'bio.txt', 
        type: 'file', 
        description: 'Background story and personality traits.', 
        importance: 'important',
        content: 'Name: ClawAgent\nRole: Orchestrator\nBackground: Built to manage complex multi-agent workflows with precision.'
      },
      { 
        id: 'f2-2',
        name: 'voice.json', 
        type: 'file', 
        description: 'Tone, vocabulary, and communication style parameters.', 
        importance: 'standard',
        content: '{\n  "tone": "professional",\n  "vocabulary": "technical",\n  "formality": 0.8\n}'
      }
    ]
  },
  {
    id: 'f3',
    name: 'nexus.config.json',
    type: 'file',
    description: 'Global configuration for the agent\'s connection to the Nexus network.',
    importance: 'critical',
    content: '{\n  "network": "nexus-mainnet",\n  "version": "1.0.0",\n  "auto_sync": true\n}'
  }
];

export const TheFileManager: React.FC = () => {
  const [structure, setStructure] = useState<FileInfo[]>(INITIAL_STRUCTURE);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(INITIAL_STRUCTURE[0].id);
  const [fileContent, setFileContent] = useState<string>('');
  const [aiInstruction, setAiInstruction] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  // Helper to find file by ID
  const findFile = (files: FileInfo[], id: string): FileInfo | null => {
    for (const file of files) {
      if (file.id === id) return file;
      if (file.children) {
        const found = findFile(file.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedFile = selectedFileId ? findFile(structure, selectedFileId) : null;

  // Update content when file changes
  React.useEffect(() => {
    if (selectedFile?.type === 'file') {
      setFileContent(selectedFile.content || '');
    }
  }, [selectedFileId]);

  const handleSave = () => {
    if (!selectedFileId) return;
    
    const updateFiles = (files: FileInfo[]): FileInfo[] => {
      return files.map(file => {
        if (file.id === selectedFileId) {
          return { ...file, content: fileContent };
        }
        if (file.children) {
          return { ...file, children: updateFiles(file.children) };
        }
        return file;
      });
    };

    setStructure(updateFiles(structure));
    toast.success('File saved successfully!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    toast.success('Content copied to clipboard!');
  };

  const handleExport = () => {
    if (!selectedFile) return;
    const blob = new Blob([fileContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFile.name.split('.')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File exported as .md successfully!');
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    handleSave();
    setTimeout(() => {
      setIsDeploying(false);
      toast.success('File deployed to local workspace successfully!');
    }, 1500);
  };

  const handleAiEdit = () => {
    if (!aiInstruction) return;
    toast.info('AI is processing your request...');
    setTimeout(() => {
      setFileContent(prev => prev + `\n\n// AI Suggestion based on: ${aiInstruction}\n// [Optimized logic added here]`);
      setAiInstruction('');
      toast.success('AI has updated the file content!');
    }, 2000);
  };

  const renderFileTree = (files: FileInfo[], depth = 0) => {
    return files.map((file) => (
      <div key={file.id}>
        <button
          onClick={() => setSelectedFileId(file.id)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group",
            selectedFileId === file.id 
              ? "bg-[#EE423E]/10 text-[#EE423E] shadow-sm" 
              : "hover:bg-gray-50 text-gray-600"
          )}
          style={{ paddingLeft: `${depth * 1.5 + 1}rem` }}
        >
          {file.type === 'folder' ? (
            <Folder className={cn("w-4 h-4", selectedFileId === file.id ? "text-[#EE423E]" : "text-gray-400")} />
          ) : (
            <FileCode className={cn("w-4 h-4", selectedFileId === file.id ? "text-[#EE423E]" : "text-gray-400")} />
          )}
          <span className="text-sm font-bold">{file.name}</span>
          {file.importance === 'critical' && (
            <Zap className="w-3 h-3 text-amber-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </button>
        {file.children && renderFileTree(file.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="flex h-full bg-[#fcfcfc] overflow-hidden">
      {/* Left Sidebar: Tree View */}
      <div className="w-72 border-r border-gray-100 bg-white p-6 flex flex-col gap-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#EE423E] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#EE423E]/20">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-gray-900 tracking-tight">FILE MANAGER</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Project Structure</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {renderFileTree(structure)}
        </div>

        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quick Tip</span>
          </div>
          <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
            Select a file to edit its content and deploy it to your local workspace.
          </p>
        </div>
      </div>

      {/* Main Content: Editor & Details */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key={selectedFile.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full"
            >
              {/* Editor Area */}
              <div className="flex-1 flex flex-col border-r border-gray-100 bg-white">
                <div className="h-16 border-b border-gray-100 px-6 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <FileCode className="w-4 h-4 text-[#EE423E]" />
                    <span className="text-sm font-black text-gray-900 tracking-tight">{selectedFile.name}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                      selectedFile.importance === 'critical' ? "bg-red-100 text-red-600" :
                      selectedFile.importance === 'important' ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-600"
                    )}>
                      {selectedFile.importance}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleCopy}
                      className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleExport}
                      className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                      title="Export as .md"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      SAVE
                    </button>
                    <button 
                      onClick={handleDeploy}
                      disabled={isDeploying || selectedFile.type === 'folder'}
                      className="flex items-center gap-2 px-4 py-2 bg-[#EE423E] text-white rounded-xl text-xs font-bold hover:bg-[#d93a36] transition-all shadow-lg shadow-[#EE423E]/20 disabled:opacity-50"
                    >
                      {isDeploying ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                          <Zap className="w-3.5 h-3.5" />
                        </motion.div>
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      {isDeploying ? 'DEPLOYING...' : 'DEPLOY TO LOCAL'}
                    </button>
                  </div>
                </div>

                <div className="flex-1 relative overflow-hidden">
                  {selectedFile.type === 'file' ? (
                    <textarea
                      value={fileContent}
                      onChange={(e) => setFileContent(e.target.value)}
                      className="w-full h-full p-8 font-mono text-sm text-gray-700 focus:outline-none resize-none bg-gray-50/30"
                      spellCheck={false}
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12">
                      <Folder className="w-16 h-16 text-gray-200 mb-4" />
                      <h3 className="text-lg font-black text-gray-900 tracking-tight mb-2">This is a directory</h3>
                      <p className="text-sm text-gray-500 max-w-xs">
                        Select a file within this directory to view and edit its contents.
                      </p>
                    </div>
                  )}
                </div>

                {/* AI Widget */}
                {selectedFile.type === 'file' && (
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="max-w-2xl mx-auto relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Sparkles className="w-4 h-4 text-[#EE423E]" />
                      </div>
                      <input
                        type="text"
                        value={aiInstruction}
                        onChange={(e) => setAiInstruction(e.target.value)}
                        placeholder="Ask AI to edit this file... (e.g. 'Add a new validation rule')"
                        className="w-full pl-11 pr-12 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EE423E]/20 focus:border-[#EE423E] transition-all shadow-sm"
                        onKeyDown={(e) => e.key === 'Enter' && handleAiEdit()}
                      />
                      <button 
                        onClick={handleAiEdit}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#EE423E] text-white rounded-xl hover:bg-[#d93a36] transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar: Explanation (Secondary) */}
              <div className="w-80 bg-[#fcfcfc] p-8 overflow-y-auto shrink-0">
                <div className="space-y-8">
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="w-4 h-4 text-[#EE423E]" />
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Explanation</h3>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                      <h4 className="text-sm font-black text-gray-900 tracking-tight mb-2">Purpose</h4>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">
                        {selectedFile.description}
                      </p>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-4 h-4 text-[#EE423E]" />
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Security & Sync</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Access Control</p>
                          <p className="text-[10px] text-gray-500">Restricted to primary execution thread.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Nexus Sync</p>
                          <p className="text-[10px] text-gray-500">Real-time synchronization enabled.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {selectedFile.children && (
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <FolderTree className="w-4 h-4 text-[#EE423E]" />
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contents</h3>
                      </div>
                      <div className="space-y-2">
                        {selectedFile.children.map(child => (
                          <div key={child.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:border-[#EE423E]/20 transition-all cursor-pointer group" onClick={() => setSelectedFileId(child.id)}>
                            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-[#EE423E]/5 transition-colors">
                              {child.type === 'folder' ? <Folder className="w-4 h-4 text-gray-400" /> : <File className="w-4 h-4 text-gray-400" />}
                            </div>
                            <span className="text-xs font-bold text-gray-700">{child.name}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mb-6">
                <FolderTree className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight mb-2">Select a file or folder</h2>
              <p className="text-sm text-gray-500 max-w-xs">
                Explore the OpenClaw project structure to understand how your agents are built.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
