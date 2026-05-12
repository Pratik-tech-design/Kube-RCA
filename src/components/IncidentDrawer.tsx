import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, AlertTriangle, Info, CheckCircle2, ArrowRight, Zap, Target, Share2, MessageSquare } from 'lucide-react';
import { Incident, Severity } from '../types';
import { cn } from '../lib/utils';

interface IncidentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

export default function IncidentDrawer({ isOpen, onClose, incidents, onSelectIncident }: IncidentDrawerProps) {
  const severityColors: Record<Severity, string> = {
    info: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
    warning: 'text-accent-yellow bg-accent-yellow/10 border-accent-yellow/20',
    high: 'text-accent-orange bg-accent-orange/10 border-accent-orange/20',
    critical: 'text-accent-red bg-accent-red/10 border-accent-red/20',
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
            className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-[120] w-full max-w-md bg-[#0a0a0f] border-l border-white/10 shadow-2xl flex flex-col"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-accent-orange/20 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-accent-orange" />
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-widest uppercase">Incident Feed</h2>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">Live Status Stream</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto style-scrollbar p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Active Incidents</h3>
                <div className="px-2 py-0.5 rounded bg-accent-red/10 border border-accent-red/20 text-[9px] font-bold text-accent-red">
                   {incidents.filter(i => i.status !== 'resolved').length} ACTIONABLE
                </div>
              </div>

              <div className="space-y-4">
                {incidents.map((incident) => (
                  <div 
                    key={incident.id}
                    className={cn(
                      "group p-4 rounded-xl border transition-all cursor-pointer",
                      incident.status === 'resolved' 
                        ? "bg-white/[0.01] border-white/5 opacity-60" 
                        : "bg-white/[0.03] border-white/10 hover:border-white/30 hover:bg-white/[0.05]"
                    )}
                    onClick={() => onSelectIncident(incident)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn("px-2 py-0.5 rounded text-[8px] font-bold uppercase", severityColors[incident.severity])}>
                         {incident.severity}
                      </div>
                      <span className="text-[9px] font-mono text-gray-600">{incident.startTime}</span>
                    </div>
                    
                    <h4 className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors">{incident.title}</h4>
                    
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Target className="w-3 h-3 text-gray-600" />
                        <span className="text-[10px] font-mono text-gray-500">{incident.affectedPods.length} Affected</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Share2 className="w-3 h-3 text-gray-600" />
                        <span className="text-[10px] font-mono text-gray-500">Chain: {incident.alerts.length}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center">
                           <Zap className="w-2.5 h-2.5 text-accent-blue" />
                        </div>
                        <span className="text-[9px] font-mono text-gray-500 uppercase">AI Root Cause Identified</span>
                      </div>
                      <button className="flex items-center gap-1 text-[10px] font-bold text-accent-blue uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                         Details <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {incidents.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center opacity-20">
                  <CheckCircle2 className="w-12 h-12 mb-4" />
                  <p className="text-xs font-bold uppercase tracking-widest text-center">Infrastructure Normalized<br/>No active incidents detected</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/10 bg-black/40 space-y-4">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                 <span className="text-gray-500">Operator Collaboration</span>
                 <span className="text-accent-green">3 Online</span>
              </div>
              <button className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
                 <MessageSquare className="w-4 h-4" />
                 Open Incident War-Room
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
