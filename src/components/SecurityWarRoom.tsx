import { motion } from 'motion/react';
import { 
  Shield, 
  Lock, 
  Unlock, 
  AlertCircle, 
  Activity, 
  UserCheck, 
  Eye, 
  Terminal,
  Zap,
  ChevronRight,
  Fingerprint,
  Network,
  Cpu
} from 'lucide-react';
import { SecurityPosture, SecurityEvent, RBACAudit, Severity } from '../types';
import { cn } from '../lib/utils';

interface SecurityWarRoomProps {
  posture: SecurityPosture;
  onEventAction: (eventId: string, action: string) => void;
}

export default function SecurityWarRoom({ posture, onEventAction }: SecurityWarRoomProps) {
  const severityColors: Record<Severity, string> = {
    info: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
    warning: 'text-accent-yellow bg-accent-yellow/10 border-accent-yellow/20',
    high: 'text-accent-orange bg-accent-orange/10 border-accent-orange/20',
    critical: 'text-accent-red bg-accent-red/10 border-accent-red/20',
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] border border-white/[0.05] rounded-xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-accent-blue shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
      
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-accent-blue/20 flex items-center justify-center">
            <Lock className="w-4 h-4 text-accent-blue" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase">Security War-Room</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-accent-green font-mono uppercase animate-pulse">● eBPF Runtime Watcher Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-tighter">RBAC Compliance</span>
              <span className="text-xs font-mono font-bold text-accent-green">{posture.rbacCompliance}%</span>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-tighter">Inference Confidence</span>
              <span className="text-xs font-mono font-bold text-accent-blue">{posture.activeSecurityInference}%</span>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto style-scrollbar p-5 space-y-6">
        {/* Active Threats Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-red" />
              <h4 className="text-[10px] font-bold text-accent-red uppercase tracking-[0.2em]">Live Threat Stream</h4>
            </div>
            <span className="text-[9px] font-mono text-gray-500">{posture.events.length} active events</span>
          </div>

          <div className="space-y-2">
            {posture.events.map((event) => (
              <motion.div 
                key={event.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={cn(
                  "p-3 rounded-lg border bg-white/[0.02] flex items-start gap-4 transition-all hover:bg-white/[0.04]",
                  event.severity === 'critical' ? 'border-accent-red/20' : 'border-white/10'
                )}
              >
                <div className={cn("mt-1 p-1.5 rounded", severityColors[event.severity])}>
                   <Fingerprint className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-gray-200">{event.description}</span>
                    <span className="text-[9px] font-mono text-gray-500">{event.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                      <Cpu className="w-3 h-3 text-gray-500" />
                      <span className="text-[9px] font-mono text-gray-400">POD: {event.podId}</span>
                    </div>
                    {event.attackPath && (
                      <div className="flex items-center gap-1">
                         <Network className="w-3 h-3 text-gray-600" />
                         <span className="text-[9px] text-gray-600 uppercase">Blast Radius: {event.attackPath.length} nodes</span>
                      </div>
                    )}
                  </div>
                  
                  {event.status === 'active' && (
                    <div className="mt-3 flex items-center gap-2">
                      <button 
                        onClick={() => onEventAction(event.id, 'quarantine')}
                        className="px-3 py-1 rounded bg-accent-red text-black text-[9px] font-bold uppercase hover:bg-accent-red/80 transition-colors"
                      >
                        Quarantine Workload
                      </button>
                      <button className="px-3 py-1 rounded bg-white/5 border border-white/10 text-gray-400 text-[9px] font-bold uppercase hover:text-white transition-colors">
                        Mute
                      </button>
                    </div>
                  )}
                  {event.status === 'contained' && (
                    <div className="mt-3 flex items-center gap-1.5 text-accent-green">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="text-[9px] font-bold uppercase">Threat Contained via eBPF Rule</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* RBAC Auditor Section */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent-blue" />
            <h4 className="text-[10px] font-bold text-accent-blue uppercase tracking-[0.2em]">RBAC Posture Audits</h4>
          </div>

          <div className="space-y-2">
            {posture.audits.map((audit) => (
              <div key={audit.id} className="p-3 rounded-lg border border-white/5 bg-black/40 group hover:border-accent-blue/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[10px] font-mono font-bold text-gray-300">{audit.entity}</span>
                  </div>
                  <div className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold uppercase", severityColors[audit.risk])}>
                     {audit.risk} risk
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 leading-tight mb-3 italic">"{audit.issue}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[9px] text-accent-blue font-bold px-2 py-0.5 rounded bg-accent-blue/5 border border-accent-blue/20">
                     <AlertCircle className="w-3 h-3" />
                     {audit.remediation}
                  </div>
                  <ChevronRight className="w-3 h-3 text-gray-700 group-hover:text-accent-blue transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer Branding */}
      <div className="px-5 py-3 border-t border-white/[0.05] bg-white/[0.02] flex items-center justify-between text-[8px] font-mono text-gray-600">
        <div className="flex items-center gap-2">
           <Terminal className="w-3 h-3" />
           <span>K-SECURITY-ENGINE V4.2</span>
        </div>
        <div className="flex items-center gap-3">
           <span className="flex items-center gap-1">
             <Eye className="w-3 h-3" /> SHADOW_MODE: OFF
           </span>
           <span className="text-accent-blue">RBAC_SYNC: OK</span>
        </div>
      </div>
    </div>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
