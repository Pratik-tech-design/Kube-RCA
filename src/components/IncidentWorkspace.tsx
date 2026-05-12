import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  AlertTriangle, 
  Activity, 
  Clock, 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  Brain,
  Terminal,
  Zap,
  Info,
  Server,
  Layers,
  Database
} from 'lucide-react';
import { Incident, Severity, IncidentStatus } from '../types';
import { cn } from '../lib/utils';

interface IncidentWorkspaceProps {
  incident: Incident | null;
  onClose: () => void;
  onApproveRemediation: (id: string) => void;
}

export default function IncidentWorkspace({ incident, onClose, onApproveRemediation }: IncidentWorkspaceProps) {
  if (!incident) return null;

  const severityColors: Record<Severity, string> = {
    info: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
    warning: 'text-accent-yellow bg-accent-yellow/10 border-accent-yellow/20',
    high: 'text-accent-orange bg-accent-orange/10 border-accent-orange/20',
    critical: 'text-accent-red bg-accent-red/10 border-accent-red/20',
  };

  const statusIcons: Record<IncidentStatus, any> = {
    active: <AlertTriangle className="w-4 h-4" />,
    investigating: <Activity className="w-4 h-4 animate-pulse" />,
    acknowledged: <Info className="w-4 h-4" />,
    suppressed: <X className="w-4 h-4" />,
    resolved: <CheckCircle2 className="w-4 h-4" />,
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="w-full max-w-6xl h-full max-h-[900px] bg-[#0a0a0f] border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between bg-gradient-to-r from-accent-red/5 to-transparent">
            <div className="flex items-center gap-4">
              <div className={cn("px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5", severityColors[incident.severity])}>
                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {incident.severity}
              </div>
              <h2 className="text-lg font-bold tracking-tight">{incident.title}</h2>
              <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-gray-400">
                <span className="text-gray-600">ID:</span> {incident.id}
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex">
            {/* Left Sidebar: Timeline & Alerts */}
            <div className="w-[350px] border-r border-white/[0.05] bg-black/20 overflow-y-auto style-scrollbar">
              <div className="p-4 border-b border-white/[0.05]">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Propagation Chain</h3>
                <div className="space-y-4">
                  {incident.alerts.map((alert, idx) => (
                    <div key={alert.id} className="relative pl-6 pb-4 last:pb-0">
                      {idx !== incident.alerts.length - 1 && (
                        <div className="absolute left-2 top-4 bottom-0 w-px bg-white/10" />
                      )}
                      <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-[#0a0a0f] border border-white/20 flex items-center justify-center z-10">
                        <div className={cn("w-1.5 h-1.5 rounded-full", alert.severity === 'critical' ? 'bg-accent-red' : 'bg-accent-yellow')} />
                      </div>
                      <div className="bg-white/[0.02] border border-white/[0.05] p-2 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] font-mono text-gray-500">{alert.time}</span>
                          <span className="text-[8px] font-bold uppercase text-gray-400">{alert.type}</span>
                        </div>
                        <p className="text-[11px] text-gray-300 leading-tight">{alert.description}</p>
                        <div className="mt-1 flex items-center gap-1">
                           <Terminal className="w-3 h-3 text-gray-600" />
                           <span className="text-[9px] font-mono text-gray-600">{alert.source}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Investigation Area */}
            <div className="flex-1 overflow-y-auto style-scrollbar p-6 space-y-8 bg-gradient-to-b from-transparent to-accent-red/[0.02]">
              {/* Root Cause Discovery */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-accent-purple" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">AI Investigation Report</h3>
                </div>
                
                <div className="bg-accent-purple/5 border border-accent-purple/20 rounded-xl p-5 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent-purple/20 flex items-center justify-center shrink-0">
                      <Zap className="w-6 h-6 text-accent-purple" />
                    </div>
                    <div>
                      <h4 className="text-accent-purple font-bold text-sm">Automated Hypothesis</h4>
                      <p className="text-gray-300 text-sm mt-1 leading-relaxed">
                        {incident.rootCause}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {incident.aiReasoning.map((insight, i) => (
                      <div key={i} className="bg-black/40 border border-white/5 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5 text-accent-blue" />
                            <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest">{insight.agent} Agent</span>
                          </div>
                          <span className="text-[9px] font-mono text-gray-600">{insight.timestamp}</span>
                        </div>
                        <p className="text-[12px] text-gray-400 mb-4 italic">{insight.insight}</p>
                        <div className="space-y-2">
                          {insight.reasoning.map((step, si) => (
                            <div key={si} className="flex gap-2 text-[10px]">
                              <ArrowRight className="w-3 h-3 text-gray-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-gray-500">{step.step}:</span>
                                <span className="text-gray-300 ml-1">{step.evidence}</span>
                                <span className="text-accent-green ml-1 font-mono">[{Math.round(step.confidence * 100)}%]</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Blast Radius & Dependencies */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent-blue" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Affected Infrastructure</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {incident.affectedPods.map(podId => (
                    <div key={podId} className="bg-white/[0.02] border border-white/[0.05] p-3 rounded-lg flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-accent-red/20 flex items-center justify-center">
                        <Server className="w-4 h-4 text-accent-red" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-300 uppercase tracking-tight">Pod ID: {podId}</div>
                        <div className="text-[9px] font-mono text-gray-500">Namespace: analytics</div>
                      </div>
                    </div>
                  ))}
                  <div className="bg-white/[0.02] border border-white/[0.05] p-3 rounded-lg flex items-center gap-3 opacity-50">
                    <div className="w-8 h-8 rounded bg-gray-500/20 flex items-center justify-center">
                      <Database className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Volume Mount</div>
                      <div className="text-[9px] font-mono text-gray-600">pvc-8422-x91</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Remediation Flow */}
              {incident.remediation && (
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent-green" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Intelligent Remediation</h3>
                  </div>
                  <div className="bg-accent-green/5 border border-accent-green/20 rounded-xl p-5">
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                      <div className="space-y-4 flex-1">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold text-accent-green uppercase tracking-widest bg-accent-green/10 px-2 py-0.5 rounded border border-accent-green/20">Proposed Action</span>
                            <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border", 
                              incident.remediation.risk === 'low' ? 'text-accent-green border-accent-green/20' : 'text-accent-orange border-accent-orange/20'
                            )}>
                              Risk: {incident.remediation.risk}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-white">{incident.remediation.action}</h4>
                          <p className="text-sm text-gray-400 mt-1">{incident.remediation.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Impact Prediction</div>
                            <p className="text-[11px] text-gray-300 leading-snug">{incident.remediation.impact}</p>
                          </div>
                          <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Rollback Plan</div>
                            <p className="text-[11px] text-gray-300 leading-snug">{incident.remediation.rollbackPlan}</p>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 w-full md:w-auto h-full flex flex-col gap-3">
                        <button 
                          onClick={() => onApproveRemediation(incident.remediation!.id)}
                          disabled={incident.remediation.status === 'executed'}
                          className={cn(
                            "px-6 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all",
                            incident.remediation.status === 'executed' 
                              ? "bg-accent-green/20 text-accent-green border border-accent-green/30 cursor-not-allowed"
                              : "bg-accent-green text-black hover:scale-[1.02] active:scale-[0.98]"
                          )}
                        >
                          {incident.remediation.status === 'executed' ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              REMEDIATION EXECUTED
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4" />
                              APPROVE & EXECUTE
                            </>
                          )}
                        </button>
                        <button className="px-6 py-3 rounded-lg font-bold text-sm bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                          REJECT ACTION
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
