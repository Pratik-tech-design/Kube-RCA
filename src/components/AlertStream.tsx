import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Cpu, 
  Database, 
  Network, 
  Activity, 
  Zap, 
  Clock,
  ArrowRight,
  ShieldAlert,
  Server,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Eye,
  Terminal,
  Brain
} from 'lucide-react';
import { Alert, Severity } from '../types';
import { cn } from '../lib/utils';

interface AlertStreamProps {
  alerts: Alert[];
  onSelectAlert: (alertId: string) => void;
}

interface GroupedAlert extends Alert {
  count: number;
  allInstances: Alert[];
}

export default function AlertStream({ alerts, onSelectAlert }: AlertStreamProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  const typeIcons: Record<string, any> = {
    cpu: <Cpu className="w-3 h-3" />,
    memory: <Activity className="w-3 h-3" />,
    io: <Database className="w-3 h-3" />,
    network: <Network className="w-3 h-3" />,
    probe: <Server className="w-3 h-3" />,
    restart: <Activity className="w-3 h-3" />,
    security: <ShieldAlert className="w-3 h-3" />,
    custom: <Zap className="w-3 h-3" />,
  };

  const severityColors: Record<Severity, string> = {
    info: 'border-accent-blue/20 bg-accent-blue/5 text-accent-blue',
    warning: 'border-accent-yellow/20 bg-accent-yellow/5 text-accent-yellow',
    high: 'border-accent-orange/20 bg-accent-orange/5 text-accent-orange',
    critical: 'border-accent-red/20 bg-accent-red/5 text-accent-red',
  };

  const severityScore: Record<Severity, number> = {
    critical: 4,
    high: 3,
    warning: 2,
    info: 1
  };

  const groupedAlerts = useMemo(() => {
    const groups: Record<string, GroupedAlert> = {};

    alerts.forEach(alert => {
      const key = `${alert.podId}-${alert.type}-${alert.severity}-${alert.description}`;
      if (!groups[key]) {
        groups[key] = { ...alert, count: 1, allInstances: [alert] };
      } else {
        groups[key].count++;
        groups[key].allInstances.push(alert);
        // Keep the most recent one as the primary representation
        if (new Date(alert.time) > new Date(groups[key].time)) {
          const count = groups[key].count;
          const allInstances = groups[key].allInstances;
          groups[key] = { ...alert, count, allInstances };
        }
      }
    });

    return Object.values(groups).sort((a, b) => {
      if (severityScore[b.severity] !== severityScore[a.severity]) {
        return severityScore[b.severity] - severityScore[a.severity];
      }
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });
  }, [alerts]);

  const visibleAlerts = isExpanded ? groupedAlerts : groupedAlerts.slice(0, 6);
  const hasMore = groupedAlerts.length > 6;

  const toggleExpand = (id: string) => {
    setExpandedAlertId(expandedAlertId === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] border border-white/[0.05] rounded-xl overflow-hidden shadow-2xl">
      <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-4 h-4 text-accent-orange" />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-red rounded-full animate-ping" />
            )}
          </div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Live Alert Convergence</h3>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex flex-col items-end">
             <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
               <span className="text-[9px] font-mono text-accent-green uppercase opacity-80">Synchronized</span>
             </div>
             <span className="text-[7px] font-mono text-gray-600 uppercase">Latency: 12ms</span>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto style-scrollbar p-3 space-y-2">
        <AnimatePresence initial={false}>
          {visibleAlerts.map((alert) => (
            <div key={alert.id} className="space-y-1">
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "relative overflow-hidden group rounded-lg border transition-all duration-300",
                  expandedAlertId === alert.id 
                    ? "bg-white/[0.04] border-white/20 shadow-lg" 
                    : "bg-white/[0.02] border-white/[0.05] hover:border-white/10 hover:bg-white/[0.03]"
                )}
              >
                {/* Severity Ribbon for Critical */}
                {alert.severity === 'critical' && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent-red shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                )}

                <button
                  onClick={() => toggleExpand(alert.id)}
                  className="w-full text-left p-2.5 flex items-start gap-3"
                >
                  <div className={cn(
                    "p-2 rounded-lg border flex-shrink-0 transition-transform group-hover:scale-110", 
                    severityColors[alert.severity]
                  )}>
                    {typeIcons[alert.type] || <Zap className="w-3 h-3" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border",
                          alert.severity === 'critical' ? 'bg-accent-red/20 text-accent-red border-accent-red/30' : 
                          alert.severity === 'high' ? 'bg-accent-orange/20 text-accent-orange border-accent-orange/30' :
                          'text-gray-500 border-white/5'
                        )}>
                          {alert.severity}
                        </span>
                        {alert.count > 1 && (
                          <span className="text-[8px] font-bold bg-white/10 text-white/70 px-1.5 py-0.5 rounded-full border border-white/10">
                            {alert.count}x Instances
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-2.5 h-2.5 text-gray-600" />
                        <span className="text-[8px] font-mono text-gray-600">{alert.time}</span>
                      </div>
                    </div>
                    
                    <p className={cn(
                      "text-[11px] font-medium leading-tight",
                      alert.severity === 'critical' ? 'text-white' : 'text-gray-300'
                    )}>
                      {alert.description}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-2">
                       <div className="flex items-center gap-1">
                         <Terminal className="w-2.5 h-2.5 text-gray-600" />
                         <span className="text-[8px] font-mono text-gray-500 uppercase">Src: {alert.source}</span>
                       </div>
                       {alert.podId && (
                         <div className="flex items-center gap-1">
                           <Server className="w-2.5 h-2.5 text-gray-600" />
                           <span className="text-[8px] font-mono text-gray-500 truncate max-w-[100px]">{alert.podId}</span>
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center self-stretch gap-2">
                    <motion.div
                      animate={{ rotate: expandedAlertId === alert.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-3 h-3 text-gray-600 group-hover:text-gray-400" />
                    </motion.div>
                  </div>
                </button>

                {/* Inline Expansion Area */}
                <AnimatePresence>
                  {expandedAlertId === alert.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-white/[0.05]"
                    >
                      <div className="p-3 bg-black/40 space-y-4">
                        {/* AI Analysis Section */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-accent-purple">
                            <Brain className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">AI Reasoning & Context</span>
                          </div>
                          <div className="p-2 rounded bg-accent-purple/5 border border-accent-purple/10">
                            <p className="text-[10px] text-gray-400 leading-relaxed italic">
                              "The convergence of {alert.type} anomalies on {alert.podId || 'unknown pod'} suggests a potential cascading failure 
                              triggered by upstream resource contention. Remediation prioritization: high."
                            </p>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-2 rounded bg-white/5 border border-white/5">
                            <div className="text-[8px] uppercase text-gray-500 mb-1">Impact Radius</div>
                            <div className="text-[10px] text-gray-300 font-medium tracking-tight">Isolated to single namespace</div>
                          </div>
                          <div className="p-2 rounded bg-white/5 border border-white/5">
                            <div className="text-[8px] uppercase text-gray-500 mb-1">Telemetry Origin</div>
                            <div className="text-[10px] text-gray-300 font-medium tracking-tight">Prometheus:KubeStateMetrics</div>
                          </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex gap-2">
                          <button 
                            onClick={() => onSelectAlert(alert.id)}
                            className="flex-1 py-1.5 rounded bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[9px] font-bold uppercase tracking-widest hover:bg-accent-blue/20 transition-colors flex items-center justify-center gap-2"
                          >
                            <Eye className="w-3 h-3" />
                            Investigate
                          </button>
                          <button className="flex-1 py-1.5 rounded bg-white/5 border border-white/10 text-white/60 text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                            <Zap className="w-3 h-3" />
                            Auto-Remediate
                          </button>
                        </div>

                        {/* History if grouped */}
                        {alert.count > 1 && (
                          <div className="pt-2 border-t border-white/5">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[8px] uppercase text-gray-500">Historical Instances</span>
                              <span className="text-[8px] font-mono text-gray-600">Last {alert.count} events</span>
                            </div>
                            <div className="space-y-1">
                              {alert.allInstances.slice(0, 3).map((instance, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[8px] text-gray-600">
                                  <span>{instance.description}</span>
                                  <span>{instance.time}</span>
                                </div>
                              ))}
                              {alert.count > 3 && (
                                <div className="text-[8px] text-gray-700 italic text-center mt-1">
                                  + {alert.count - 3} additional occurrences hidden
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          ))}
        </AnimatePresence>

        {groupedAlerts.length === 0 && (
          <div className="h-40 flex flex-col items-center justify-center opacity-20">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <Activity className="w-12 h-12 mb-4" />
            </motion.div>
            <span className="text-xs font-bold uppercase tracking-[0.3em]">No Active Anomalies</span>
          </div>
        )}

        {hasMore && (
          <motion.button
            layout
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-3 rounded-lg border border-dashed border-white/10 text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/[0.02] flex items-center justify-center gap-2 transition-all group"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Collapse Incident Feed</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                <span className="text-[9px] font-bold uppercase tracking-widest">
                  Show {groupedAlerts.length - 6} More Alerts
                </span>
                <span className="w-1 h-1 rounded-full bg-accent-orange animate-pulse" />
              </>
            )}
          </motion.button>
        )}
      </div>

      <div className="h-8 border-t border-white/5 bg-black/40 px-4 flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
             <AlertCircle className="w-2.5 h-2.5 text-accent-red" />
             <span className="text-[8px] font-mono text-gray-500">{alerts.filter(a => a.severity === 'critical').length} Criticals</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
             <span className="text-[8px] font-mono">Total Streams: {groupedAlerts.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 group cursor-pointer">
          <span className="text-[8px] font-mono text-gray-600 group-hover:text-gray-400 transition-colors uppercase">View Global Index</span>
          <ArrowRight className="w-2.5 h-2.5 text-gray-700 group-hover:text-white transition-all group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  );
}

