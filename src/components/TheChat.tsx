import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  User, 
  Bot, 
  Terminal, 
  History, 
  Plus, 
  MoreVertical, 
  Search,
  ChevronRight,
  Cpu,
  Zap,
  Globe,
  Trash2,
  CheckCircle2,
  Info
} from 'lucide-react';
import { Agent, ChatSession, Message } from '../types';
import { cn } from '../lib/utils';

interface TheChatProps {
  agents: Agent[];
}

export const TheChat: React.FC<TheChatProps> = ({ agents }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(agents[0]?.id || null);
  const [input, setInput] = useState('');
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeSession?.messages]);

  const handleNewSession = () => {
    if (!selectedAgentId) return;
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      name: `Chat with ${agents.find(a => a.id === selectedAgentId)?.name}`,
      agentId: selectedAgentId,
      messages: [
        {
          id: 'm1',
          role: 'system',
          content: `Session started with ${agents.find(a => a.id === selectedAgentId)?.name}. OpenClaw terminal synced.`,
          timestamp: Date.now()
        }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const handleSendMessage = () => {
    if (!input.trim() || !activeSessionId) return;

    const userMessage: Message = {
      id: `m-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    const updatedSessions = sessions.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: [...s.messages, userMessage],
          updatedAt: Date.now()
        };
      }
      return s;
    });

    setSessions(updatedSessions);
    setInput('');

    // Simulate Agent Response
    setTimeout(() => {
      const agentMessage: Message = {
        id: `m-${Date.now() + 1}`,
        role: 'agent',
        content: `I'm processing your request using the OpenClaw runtime. I'll get back to you with the results shortly.`,
        timestamp: Date.now(),
        agentId: selectedAgentId || undefined
      };
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId ? { ...s, messages: [...s.messages, agentMessage] } : s
      ));
    }, 1000);
  };

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden">
      {/* Sessions Sidebar */}
      <div className="w-80 border-r border-gray-100 bg-white flex flex-col">
        <div className="p-6 border-b border-gray-50">
          <button 
            onClick={handleNewSession}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-black/10"
          >
            <Plus className="w-4 h-4" />
            New Session
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <h3 className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Recent Sessions</h3>
          {sessions.map(session => (
            <button
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={cn(
                "w-full p-4 rounded-2xl text-left transition-all group relative",
                activeSessionId === session.id 
                  ? "bg-[#EE423E]/5 border border-[#EE423E]/10" 
                  : "hover:bg-gray-50 border border-transparent"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  activeSessionId === session.id ? "bg-[#EE423E] text-white" : "bg-gray-100 text-gray-400"
                )}>
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-bold truncate",
                    activeSessionId === session.id ? "text-gray-900" : "text-gray-600"
                  )}>
                    {session.name}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </button>
          ))}
          {sessions.length === 0 && (
            <div className="text-center py-10">
              <History className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No active sessions</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white relative">
        {!activeSessionId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 bg-[#EE423E]/10 rounded-[32px] flex items-center justify-center mb-8">
              <Bot className="w-12 h-12 text-[#EE423E]" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Choose an Agent to Start</h2>
            <p className="text-gray-500 max-w-md mb-12">
              Select one of your forged agents to begin a new session. All conversations are synced with the OpenClaw terminal.
            </p>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
              {agents.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => {
                    setSelectedAgentId(agent.id);
                    handleNewSession();
                  }}
                  className="p-6 border border-gray-100 rounded-3xl hover:border-[#EE423E] hover:bg-[#EE423E]/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img src={agent.avatarUrl} alt={agent.name} className="w-12 h-12 rounded-2xl object-cover" />
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-[#EE423E] transition-colors">{agent.name}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{agent.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-gray-100 rounded-lg text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                      {agent.model}
                    </div>
                    <div className="px-2 py-1 bg-emerald-50 rounded-lg text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
                      Trust: {agent.trustLevel}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-20 border-b border-gray-50 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#EE423E]/10 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-[#EE423E]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{activeSession.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Agent Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                  className={cn(
                    "p-2 rounded-xl transition-all",
                    isTerminalOpen ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-100"
                  )}
                >
                  <Terminal className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 flex flex-col min-w-0">
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
                >
                  {activeSession.messages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={cn(
                        "flex gap-4 max-w-3xl",
                        msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                        msg.role === 'user' ? "bg-gray-900 text-white" : 
                        msg.role === 'system' ? "bg-gray-100 text-gray-400" : "bg-[#EE423E] text-white"
                      )}>
                        {msg.role === 'user' ? <User className="w-5 h-5" /> : 
                         msg.role === 'system' ? <Terminal className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>
                      <div className={cn(
                        "space-y-2",
                        msg.role === 'user' ? "text-right" : ""
                      )}>
                        <div className={cn(
                          "p-4 rounded-3xl text-sm leading-relaxed",
                          msg.role === 'user' ? "bg-gray-900 text-white rounded-tr-none" : 
                          msg.role === 'system' ? "bg-gray-50 text-gray-500 italic font-mono text-xs" : "bg-gray-100 text-gray-900 rounded-tl-none"
                        )}>
                          {msg.content}
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-8 border-t border-gray-50 bg-white">
                  <div className="max-w-4xl mx-auto space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: '/process', icon: Zap, color: 'text-amber-500' },
                        { label: '/sync', icon: Globe, color: 'text-blue-500' },
                        { label: '/deploy', icon: CheckCircle2, color: 'text-emerald-500' },
                        { label: '/logs', icon: Terminal, color: 'text-gray-500' },
                        { label: '/help', icon: Info, color: 'text-[#EE423E]' }
                      ].map((cmd) => (
                        <button
                          key={cmd.label}
                          onClick={() => setInput(prev => prev + (prev ? ' ' : '') + cmd.label)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg hover:border-[#EE423E]/20 hover:bg-[#EE423E]/5 transition-all group"
                        >
                          <cmd.icon className={cn("w-3 h-3", cmd.color)} />
                          <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-900 uppercase tracking-widest">{cmd.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Type your message or use a command..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="w-full pl-6 pr-16 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EE423E]/10 transition-all"
                      />
                      <button 
                        onClick={handleSendMessage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-[#EE423E] text-white rounded-xl hover:bg-[#d63a36] transition-all shadow-lg shadow-[#EE423E]/20"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terminal Panel */}
              <AnimatePresence>
                {isTerminalOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 400, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="border-l border-gray-100 bg-gray-900 flex flex-col overflow-hidden"
                  >
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">OpenClaw Terminal</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-[9px] font-bold text-emerald-500 uppercase">Live</span>
                      </div>
                    </div>
                    <div className="flex-1 p-4 font-mono text-[11px] text-emerald-500/80 overflow-y-auto space-y-2">
                      <p className="text-white/40">[{new Date().toLocaleTimeString()}] Initializing OpenClaw session...</p>
                      <p className="text-white/40">[{new Date().toLocaleTimeString()}] Syncing with agent {selectedAgent?.name}...</p>
                      <p className="text-emerald-400">OpenClaw v1.2.4 connected.</p>
                      <p className="text-emerald-400">Ready for instructions.</p>
                      {activeSession?.messages.filter(m => m.role === 'user').map(m => (
                        <div key={m.id} className="pt-2 border-t border-white/5">
                          <p className="text-white/60">$ process --input "{m.content.substring(0, 30)}..."</p>
                          <p className="text-emerald-500/60">{">>"} Routing through gateway...</p>
                          <p className="text-emerald-500/60">{">>"} Executing skill set...</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
