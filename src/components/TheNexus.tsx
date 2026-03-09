import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Stage, Layer, Rect, Text, Group, Arrow, Circle } from 'react-konva';
import { Agent, Connection, Project } from '../types';
import { COLORS } from '../constants';
import { cn } from '../lib/utils';
import { Zap, Globe, FileCode, Folder, ExternalLink, ArrowRight, Cpu, Play, Terminal, Cloud } from 'lucide-react';
import { toast } from 'sonner';

interface TheNexusProps {
  agents: Agent[];
  connections: Connection[];
  project: Project;
  onAgentMove: (id: string, x: number, y: number) => void;
  onAgentClick: (agent: Agent) => void;
  onAgentForge: (agent: Agent) => void;
  onAccessOutcome?: () => void;
}

export const TheNexus: React.FC<TheNexusProps> = ({ 
  agents, 
  connections, 
  project, 
  onAgentMove, 
  onAgentClick, 
  onAgentForge,
  onAccessOutcome 
}) => {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [draggedAgentId, setDraggedAgentId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRunWorkflow = () => {
    if (isRunning) return;
    setIsRunning(true);
    toast.info('Initializing OpenClaw orchestration...');
    
    // Simulate step-by-step execution
    setTimeout(() => toast.success('Agent squad synchronized.'), 1000);
    setTimeout(() => toast.info('Executing skills across nodes...'), 2500);
    setTimeout(() => {
      setIsRunning(false);
      toast.success('Workflow execution complete! Outcome generated.');
    }, 4500);
  };

  const handleAccessOutcome = () => {
    if (onAccessOutcome) {
      onAccessOutcome();
    } else if (project.outcome?.value) {
      if (project.outcome.type === 'url') {
        window.open(project.outcome.value, '_blank');
      } else {
        toast.info(`Accessing ${project.outcome.type}: ${project.outcome.value}`);
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper to calculate curved path points
  const getCurvePoints = (fromX: number, fromY: number, toX: number, toY: number) => {
    const midX = (fromX + toX) / 2;
    return [fromX, fromY, midX, fromY, midX, toY, toX, toY];
  };

  const renderOutcomeIcon = (type: string) => {
    switch (type) {
      case 'url': return <Globe className="w-4 h-4" />;
      case 'file': return <FileCode className="w-4 h-4" />;
      case 'folder': return <Folder className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  if (agents.length === 0) {
    return (
      <div className="w-full h-full bg-[#fcfcfc] flex items-center justify-center relative overflow-hidden">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `radial-gradient(${COLORS.primary} 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }} 
        />
        
        <div className="relative z-10 max-w-lg w-full px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white border-2 border-dashed border-gray-200 rounded-[40px] p-16 text-center hover:border-[#EE423E]/40 transition-all group cursor-pointer shadow-2xl shadow-gray-200/50"
            onClick={() => (window as any).openWorkflowWizard?.()}
          >
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-[#EE423E]/10 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-500" />
              <div className="absolute inset-0 bg-[#EE423E]/5 rounded-3xl -rotate-6 group-hover:-rotate-12 transition-transform duration-500" />
              <div className="relative w-full h-full bg-white rounded-3xl border-2 border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-500">
                <Zap className="w-12 h-12 text-[#EE423E]" />
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-3">Forge Your First Workflow</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-10 px-4">
              Connect specialized agents to automate complex tasks. Start with our guided workflow architect to build your first AI squad.
            </p>
            
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-[#EE423E] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#d63a36] transition-all shadow-xl shadow-[#EE423E]/30 hover:-translate-y-1 active:translate-y-0">
              Launch Workflow Wizard
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
          
          <div className="mt-8 flex items-center justify-center gap-8 opacity-40 grayscale">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Multi-Agent</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Auto-Scale</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full bg-[#fcfcfc] relative overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `radial-gradient(${COLORS.primary} 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} 
      />

      {/* Header Controls */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-30 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="px-4 py-2 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 bg-[#EE423E]/5 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#EE423E]" />
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-900 tracking-tight">{project.name}</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{agents.length} Agents Active</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pointer-events-auto">
          <button 
            onClick={() => toast.info('Syncing with OpenClaw terminal...')}
            className="px-4 py-2 bg-white border border-gray-100 rounded-xl font-bold text-[10px] uppercase tracking-widest text-gray-500 hover:text-gray-900 hover:border-gray-200 transition-all flex items-center gap-2 shadow-sm"
          >
            <Terminal className="w-3.5 h-3.5" />
            Sync Terminal
          </button>
          <button 
            onClick={handleRunWorkflow}
            disabled={isRunning}
            className={cn(
              "px-6 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg",
              isRunning 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-[#EE423E] text-white hover:bg-[#d63a36] shadow-[#EE423E]/20"
            )}
          >
            {isRunning ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            {isRunning ? 'Executing...' : 'Deploy Workflow'}
          </button>
        </div>
      </div>

      <Stage width={dimensions.width} height={dimensions.height} draggable>
        <Layer>
          {/* Connections */}
          {connections.map((conn) => {
            const fromAgent = agents.find(a => a.id === conn.from);
            const toAgent = agents.find(a => a.id === conn.to);
            if (!fromAgent || !toAgent) return null;

            const startX = fromAgent.position.x + 200;
            const startY = fromAgent.position.y + 50;
            const endX = toAgent.position.x;
            const endY = toAgent.position.y + 50;

            return (
              <Arrow
                key={conn.id}
                points={getCurvePoints(startX, startY, endX, endY)}
                stroke={COLORS.primary}
                strokeWidth={2}
                opacity={0.4}
                pointerLength={8}
                pointerWidth={8}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
              />
            );
          })}

          {/* Agents */}
          {agents.map((agent) => (
            <Group
              key={agent.id}
              x={agent.position.x}
              y={agent.position.y}
              draggable
              onDragStart={() => setDraggedAgentId(agent.id)}
              onDragEnd={(e) => {
                setDraggedAgentId(null);
                onAgentMove(agent.id, e.target.x(), e.target.y());
              }}
              onClick={() => onAgentClick(agent)}
              onMouseEnter={(e) => {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = 'pointer';
              }}
              onMouseLeave={(e) => {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = 'default';
              }}
            >
              <Rect
                width={200}
                height={100}
                fill="white"
                stroke={draggedAgentId === agent.id ? COLORS.primary : COLORS.border}
                strokeWidth={draggedAgentId === agent.id ? 2 : 1}
                cornerRadius={12}
                shadowBlur={draggedAgentId === agent.id ? 15 : 10}
                shadowColor="black"
                shadowOpacity={0.05}
                shadowOffset={{ x: 0, y: 4 }}
              />
              <Rect
                width={4}
                height={100}
                fill={COLORS.primary}
                cornerRadius={[12, 0, 0, 12]}
              />
              <Text
                text={agent.name}
                x={15}
                y={18}
                fontSize={13}
                fontStyle="bold"
                fill={COLORS.text.primary}
                fontFamily="Inter"
              />
              <Text
                text={agent.role}
                x={15}
                y={36}
                fontSize={9}
                fill={COLORS.primary}
                fontStyle="bold"
                textTransform="uppercase"
                letterSpacing={1}
                fontFamily="Inter"
              />
              
              {/* Action Buttons */}
              <Group y={65} x={15}>
                <Group 
                  onClick={(e) => {
                    e.cancelBubble = true;
                    onAgentClick(agent);
                  }}
                >
                  <Rect width={80} height={24} fill="#EE423E" cornerRadius={6} />
                  <Text text="CONFIG" x={18} y={8} fontSize={8} fontStyle="bold" fill="white" fontFamily="Inter" />
                </Group>
                <Group 
                  x={90}
                  onClick={(e) => {
                    e.cancelBubble = true;
                    onAgentForge(agent);
                  }}
                >
                  <Rect width={80} height={24} fill="#111827" cornerRadius={6} />
                  <Text text="FORGE" x={22} y={8} fontSize={8} fontStyle="bold" fill="white" fontFamily="Inter" />
                </Group>
              </Group>

              {/* Magnet Connection Points */}
              <Circle
                x={200}
                y={50}
                radius={4}
                fill={COLORS.primary}
                opacity={0.6}
              />
              <Circle
                x={0}
                y={50}
                radius={4}
                fill={COLORS.primary}
                opacity={0.6}
              />
            </Group>
          ))}
        </Layer>
      </Stage>

      {/* Outcome Card Overlay */}
      {project.outcome && (
        <div className="absolute bottom-8 right-8 w-72 bg-white border-2 border-[#EE423E] rounded-2xl shadow-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 z-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#EE423E] rounded-xl flex items-center justify-center text-white">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 tracking-tight">WORKFLOW OUTCOME</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Final Result</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                {renderOutcomeIcon(project.outcome.type)}
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{project.outcome.type}</span>
              </div>
              <p className="text-sm font-mono text-gray-900 break-all">{project.outcome.value}</p>
            </div>
            
            <p className="text-xs text-gray-600 leading-relaxed">
              {project.outcome.description}
            </p>
            
            <button 
              onClick={handleAccessOutcome}
              className="w-full py-2.5 bg-[#EE423E] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#D33532] transition-colors shadow-lg shadow-[#EE423E]/20"
            >
              Access Outcome
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2">
        <button 
          onClick={() => (window as any).openAgentWizard?.()}
          className="px-6 py-3 bg-[#EE423E] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#d63a36] transition-all shadow-xl shadow-[#EE423E]/20 flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Add Agent
        </button>
        <div className="px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Nexus Engine v2.0
        </div>
      </div>
    </div>
  );
};
