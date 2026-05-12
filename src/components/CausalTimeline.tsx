import { motion } from 'motion/react';
import { Alert } from '../types';
import { Clock, Activity, HardDrive, Share2, Zap, Server } from 'lucide-react';
import { cn } from '../lib/utils';

interface CausalTimelineProps {
  anomalies: Alert[];
}

export default function CausalTimeline({ anomalies }: CausalTimelineProps) {
  const getIcon = (alert: Alert) => {
    if (alert.type === 'cpu') return <Activity className="w-3 h-3" />;
    if (alert.type === 'io') return <HardDrive className="w-3 h-3" />;
    if (alert.type === 'network') return <Share2 className="w-3 h-3" />;
    if (alert.type === 'probe') return <Server className="w-3 h-3" />;
    return <Zap className="w-3 h-3" />;
  };

  return (
    <div className="glass-panel h-full flex flex-col bg-[#0a0a0c]">
      <div className="p-3 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02] shrink-0">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent-blue" />
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Incident Propagation Chain</h2>
        </div>
        <div className="flex gap-2">
          <span className="text-[8px] font-mono text-gray-600 uppercase">T0: 10:01:00</span>
          <span className="text-[8px] font-mono text-accent-red animate-pulse uppercase">Active Incident</span>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 flex gap-0 items-center style-scrollbar">
        {anomalies.map((anomaly, idx) => (
          <div key={anomaly.id} className="flex items-center shrink-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "w-[220px] bg-white/[0.02] border border-white/[0.05] p-4 rounded-lg flex flex-col justify-between group relative transition-all hover:bg-white/[0.05]",
                anomaly.severity === 'critical' ? 'hover:border-accent-red/40' : 'hover:border-accent-blue/40'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-1.5 rounded bg-white/5 border border-white/10",
                    anomaly.severity === 'critical' ? 'text-accent-red' : 'text-accent-blue'
                  )}>
                    {getIcon(anomaly)}
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-widest">{anomaly.time}</span>
                </div>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  anomaly.severity === 'critical' ? 'bg-accent-red shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-accent-blue'
                )} />
              </div>

              <p className="text-[11px] text-gray-300 font-bold leading-tight mb-4 min-h-[2.5em] line-clamp-2 uppercase tracking-wide">
                {anomaly.description}
              </p>
              
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-gray-500 uppercase">Target Entity</span>
                  <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">{anomaly.podId}</span>
                </div>
                <button className="text-[9px] font-bold text-accent-blue uppercase tracking-tighter hover:underline underline-offset-4 decoration-accent-blue/30">Investigate</button>
              </div>
            </motion.div>

            {idx < anomalies.length - 1 && (
              <div className="w-12 h-px bg-gradient-to-r from-white/10 via-white/5 to-white/10 relative shrink-0">
                <div className="absolute inset-0 bg-accent-blue/20 blur-sm" />
                <motion.div 
                  className="absolute top-1/2 left-0 w-2 h-2 bg-accent-blue rounded-full -translate-y-1/2"
                  animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: idx * 0.5 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
