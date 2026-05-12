import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Shield, Lock, Unlock, AlertTriangle, Activity, 
  Terminal, Zap, Fingerprint, Network, Cpu, ShieldAlert,
  Search, Eye, UserCheck, Settings, Server, Globe, Key,
  CheckCircle2
} from 'lucide-react';
import { SecurityPosture, Severity } from '../types';
import { cn } from '../lib/utils';

interface SecurityWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
  posture: SecurityPosture;
  onEventAction: (eventId: string, action: string) => void;
}

type SecurityTab = 'threats' | 'rbac' | 'network' | 'secrets' | 'quarantine';

export default function SecurityWorkspace({ isOpen, onClose, posture, onEventAction }: SecurityWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<SecurityTab>('threats');

  const severityColors: Record<Severity, string> = {
    info: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
    warning: 'text-accent-yellow bg-accent-yellow/10 border-accent-yellow/20',
    high: 'text-accent-orange bg-accent-orange/10 border-accent-orange/20',
    critical: 'text-accent-red bg-accent-red/10 border-accent-red/20',
  };

  const navItems = [
    { id: 'threats' as SecurityTab, icon: <Activity className="w-4 h-4" />, label: 'Threat Stream', count: posture.events.filter(e => e.status === 'active').length },
    { id: 'rbac' as SecurityTab, icon: <UserCheck className="w-4 h-4" />, label: 'RBAC Audits', count: posture.audits.length },
    { id: 'network' as SecurityTab, icon: <Network className="w-4 h-4" />, label: 'Network Isolation' },
    { id: 'secrets' as SecurityTab, icon: <Key className="w-4 h-4" />, label: 'Secret Integrity', count: posture.secrets.filter(s => s.status === 'exposed').length },
    { id: 'quarantine' as SecurityTab, icon: <ShieldAlert className="w-4 h-4" />, label: 'Quarantined List', count: posture.quarantine.length },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="fixed inset-0 z-[150] bg-[#050507] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="h-16 border-b border-white/10 px-8 flex items-center justify-between bg-black">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent-blue/20 flex items-center justify-center border border-accent-blue/30">
                <Shield className="w-6 h-6 text-accent-blue" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight uppercase flex items-center gap-3">
                  Security Operations Center
                  <span className="text-[10px] font-mono bg-white/5 text-gray-500 px-2 py-0.5 rounded border border-white/10 italic">Inference_Engine_V4</span>
                </h1>
                <div className="flex items-center gap-4 mt-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                    <span className="text-[9px] font-mono text-gray-500 uppercase">Runtime Guard Active</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-gray-600">POSTURE_SCORE:</span>
                    <span className="text-[9px] font-mono text-accent-blue font-bold">84.2%</span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
            >
              Exit Portal <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex">
            {/* Left Sidebar: Controls & Navigation */}
            <div className="w-72 border-r border-white/10 bg-black/40 p-6 space-y-8">
              <nav className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Navigation</h3>
                <div className="space-y-1">
                  {navItems.map((item, i) => (
                    <button 
                      key={i}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full px-3 py-2.5 rounded-lg flex items-center justify-between transition-all",
                        activeTab === item.id ? "bg-accent-blue/10 text-accent-blue border border-accent-blue/20" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="text-xs font-bold">{item.label}</span>
                      </div>
                      {item.count ? (
                        <span className={cn(
                          "text-[9px] px-1.5 rounded font-bold",
                          item.id === 'threats' || item.id === 'rbac' || item.id === 'secrets' ? "bg-accent-red/20 text-accent-red" : "bg-white/10 text-gray-400"
                        )}>{item.count}</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </nav>

              <div className="pt-8 space-y-4 border-t border-white/5">
                <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Operational Policy</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">Drift Prevention</span>
                    <div className="w-8 h-4 bg-accent-blue rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-2 h-2 bg-black rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">Egress Filtering</span>
                    <div className="w-8 h-4 bg-gray-600 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-2 h-2 bg-black rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto style-scrollbar bg-gradient-to-br from-transparent to-accent-blue/[0.03] p-10">
              <div className="max-w-6xl mx-auto space-y-10 pb-20">
                {activeTab === 'threats' && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-4 gap-6">
                      {[
                        { label: 'Active Threats', value: posture.events.filter(e => e.status === 'active').length, color: 'text-accent-red' },
                        { label: 'Network Anomalies', value: posture.networkFlows.filter(f => f.status === 'suspicious').length, color: 'text-accent-yellow' },
                        { label: 'Service Coverage', value: '98%', color: 'text-accent-blue' },
                        { label: 'Detections (24h)', value: '1,242', color: 'text-accent-purple' },
                      ].map((stat, i) => (
                        <div key={i} className="bg-black/40 border border-white/10 p-5 rounded-xl">
                          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                          <div className={cn("text-2xl font-mono font-bold", stat.color)}>{stat.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-12 gap-8">
                      <div className="col-span-8 space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-300">Detection Timeline & Attack Propagation</h2>
                        </div>
                        <div className="space-y-4">
                          {posture.events.map((event) => (
                            <div key={event.id} className="group bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-accent-blue/30 transition-all flex">
                              <div className={cn("w-1.5", 
                                event.severity === 'critical' ? 'bg-accent-red shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 
                                event.severity === 'high' ? 'bg-accent-orange' : 'bg-accent-blue'
                              )} />
                              <div className="p-5 flex-1 relative overflow-hidden">
                                <div className="flex items-start justify-between mb-4 relative z-10">
                                  <div className="flex items-start gap-4">
                                    <div className={cn("p-2 rounded-lg border", severityColors[event.severity])}>
                                       <Fingerprint className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-sm font-bold text-gray-200">{event.description}</h3>
                                        <span className={cn("text-[9px] font-bold uppercase px-2 py-0.5 rounded border", severityColors[event.severity])}>
                                          {event.severity}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500">
                                        <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" /> {event.timestamp}</span>
                                        <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> {event.podId}</span>
                                      </div>
                                    </div>
                                  </div>
                                  {event.status === 'active' && (
                                    <button 
                                      onClick={() => onEventAction(event.id, 'quarantine')}
                                      className="px-3 py-1.5 rounded bg-accent-red text-black text-[10px] font-bold uppercase tracking-widest"
                                    >
                                      Execute Quarantine
                                    </button>
                                  )}
                                </div>
                                {event.attackPath && (
                                  <div className="mt-4 p-4 rounded-lg bg-black/60 border border-white/5 flex items-center gap-6 overflow-x-auto">
                                    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest shrink-0">Attack Path</div>
                                    <div className="flex items-center gap-3">
                                      {event.attackPath.map((node, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono font-bold italic">P{node}</div>
                                          {i < event.attackPath!.length - 1 && <ChevronRight className="w-3 h-3 text-gray-700" />}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-4 space-y-8">
                         <div className="bg-black/40 border border-white/10 p-6 rounded-xl">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Security Intelligence</h3>
                            <div className="space-y-4">
                               {[
                                 "Namespace 'analytics' demonstrates high lateral mobility potential.",
                                 "Egress traffic to [64.233.190.100] matches known threat actor patterns.",
                                 "7 pod service accounts lack proper OPA constraint validation."
                               ].map((insight, i) => (
                                 <div key={i} className="flex gap-3 text-[11px] text-gray-500 italic">
                                    <Zap className="w-3.5 h-3.5 text-accent-purple shrink-0 mt-0.5" />
                                    {insight}
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'rbac' && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-4 gap-6">
                      {[
                        { label: 'Critical Bindings', value: posture.audits.filter(a => a.risk === 'critical').length, color: 'text-accent-red' },
                        { label: 'Wildcard Perims', value: '12', color: 'text-accent-orange' },
                        { label: 'Cluster Admin', value: '3', color: 'text-accent-red' },
                        { label: 'Unused SAs', value: '45', color: 'text-accent-blue' },
                      ].map((stat, i) => (
                        <div key={i} className="bg-black/40 border border-white/10 p-5 rounded-xl">
                          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                          <div className={cn("text-2xl font-mono font-bold", stat.color)}>{stat.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                       <table className="w-full text-left border-collapse">
                          <thead>
                             <tr className="bg-white/[0.02] border-b border-white/10">
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Entity</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Namespace</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Risk Level</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Last Activity</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
                             </tr>
                          </thead>
                          <tbody>
                             {posture.audits.map((audit) => (
                               <tr key={audit.id} className="border-b border-white/[0.05] hover:bg-white/[0.01] transition-colors">
                                  <td className="px-6 py-4">
                                     <div className="flex items-center gap-3">
                                        <div className="p-1.5 rounded bg-white/5 border border-white/10">
                                           <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                                        </div>
                                        <div>
                                           <div className="text-xs font-bold text-gray-200">{audit.entity}</div>
                                           <div className="text-[10px] text-gray-500 italic mt-0.5 truncate max-w-[250px]">{audit.issue}</div>
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-6 py-4">
                                     <span className="text-[10px] font-mono text-gray-500">/{audit.namespace}</span>
                                  </td>
                                  <td className="px-6 py-4">
                                     <span className={cn("px-2 py-0.5 rounded text-[8px] font-bold uppercase", severityColors[audit.risk])}>
                                        {audit.risk}
                                     </span>
                                  </td>
                                  <td className="px-6 py-4 text-[10px] font-mono text-gray-500">{audit.lastActivity}</td>
                                  <td className="px-6 py-4 text-right">
                                     <button className="text-[10px] font-bold text-accent-blue uppercase tracking-widest hover:text-white transition-colors">Remediate</button>
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                  </div>
                )}

                {activeTab === 'network' && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-12 gap-8 h-[600px]">
                       <div className="col-span-8 bg-black/40 border border-white/10 rounded-xl p-6 relative flex flex-col">
                          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Live Namespace Traffic Map</h3>
                          <div className="flex-1 flex items-center justify-center p-10 border border-white/5 bg-black/20 rounded-lg relative overflow-hidden">
                             {/* Simulated Flow View */}
                             <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <div className="absolute top-1/2 left-1/4 w-full h-[2px] bg-gradient-to-r from-accent-blue to-transparent" />
                                <div className="absolute top-1/3 left-1/3 w-[2px] h-full bg-gradient-to-b from-accent-red to-transparent" />
                             </div>
                             
                             <div className="grid grid-cols-2 gap-20 relative z-10">
                                {['analytics', 'gateway', 'iot', 'infra'].map((ns, i) => (
                                  <div key={i} className="p-6 rounded-xl border border-white/10 bg-black/40 flex flex-col items-center gap-4 group hover:border-accent-blue/50 transition-all">
                                     <div className="w-12 h-12 rounded bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center">
                                        <Globe className="w-6 h-6 text-accent-blue" />
                                     </div>
                                     <div className="text-center">
                                        <div className="text-[10px] font-bold text-white uppercase tracking-widest">{ns}</div>
                                        <div className="text-[8px] font-mono text-gray-600 mt-1">STATUS: {i === 0 ? 'PARTIAL' : 'LOCKED'}</div>
                                     </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>
                       <div className="col-span-4 space-y-6 flex flex-col">
                          <div className="flex-1 bg-black/40 border border-white/10 rounded-xl p-6 overflow-hidden flex flex-col">
                             <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Traffic Stream</h3>
                             <div className="flex-1 overflow-y-auto style-scrollbar space-y-3">
                                {posture.networkFlows.map(flow => (
                                  <div key={flow.id} className="p-3 rounded bg-white/[0.02] border border-white/5 flex items-center justify-between">
                                     <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                           <span className="text-[10px] font-bold text-gray-300">{flow.source}</span>
                                           <ArrowRight className="w-2.5 h-2.5 text-gray-600" />
                                           <span className="text-[10px] font-bold text-gray-300">{flow.target}</span>
                                        </div>
                                        <span className="text-[8px] font-mono text-gray-600">{flow.timestamp} • {flow.type.toUpperCase()}</span>
                                     </div>
                                     <div className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold uppercase", 
                                        flow.status === 'blocked' ? 'bg-accent-red/20 text-accent-red' : 
                                        flow.status === 'suspicious' ? 'bg-accent-yellow/20 text-accent-yellow' : 
                                        'bg-accent-green/20 text-accent-green'
                                     )}>{flow.status}</div>
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === 'secrets' && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-4 gap-6">
                      {[
                        { label: 'Total Secrets', value: '142', color: 'text-gray-400' },
                        { label: 'Exposed', value: posture.secrets.filter(s => s.status === 'exposed').length, color: 'text-accent-red' },
                        { label: 'Rotation Drift', value: '4', color: 'text-accent-yellow' },
                        { label: 'Unused Keys', value: '28', color: 'text-accent-blue' },
                      ].map((stat, i) => (
                        <div key={i} className="bg-black/40 border border-white/10 p-5 rounded-xl">
                          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-2">{stat.label}</div>
                          <div className={cn("text-2xl font-mono font-bold", stat.color)}>{stat.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                       {posture.secrets.map(secret => (
                         <div key={secret.id} className="bg-black/40 border border-white/10 rounded-xl p-6 flex items-center justify-between group hover:border-accent-blue/30 transition-all">
                            <div className="flex items-center gap-6">
                               <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center border", 
                                  secret.status === 'exposed' ? 'bg-accent-red/10 border-accent-red/30 text-accent-red' : 'bg-accent-blue/10 border-accent-blue/30 text-accent-blue'
                               )}>
                                  <Key className="w-6 h-6" />
                               </div>
                               <div>
                                  <div className="flex items-center gap-3 mb-1">
                                     <h3 className="text-sm font-bold text-white">{secret.name}</h3>
                                     <span className="text-[10px] font-mono text-gray-500">/{secret.namespace}</span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                     <div className="text-[10px] text-gray-600">Accessed by: <span className="text-gray-400">{secret.accessedBy.join(', ')}</span></div>
                                     <div className="text-[10px] text-gray-600">Last used: <span className="text-gray-400">{secret.lastAccessed}</span></div>
                                  </div>
                               </div>
                            </div>
                            <div className="flex items-center gap-8">
                               <div className="flex flex-col items-end">
                                  <span className="text-[8px] font-bold uppercase tracking-widest text-gray-600">Risk Score</span>
                                  <span className={cn("text-lg font-mono font-bold", secret.riskScore > 50 ? 'text-accent-red' : 'text-accent-green')}>{secret.riskScore}</span>
                               </div>
                               <button className={cn("px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                  secret.status === 'exposed' ? 'bg-accent-red text-black hover:bg-accent-red/80' : 'bg-white/5 border border-white/10 text-gray-500 hover:text-white'
                               )}>
                                  {secret.status === 'exposed' ? 'Rotate Immediately' : 'Audit Access'}
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {activeTab === 'quarantine' && (
                  <div className="space-y-10">
                     <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                        <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <ShieldAlert className="w-4 h-4 text-accent-red" />
                              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Isolated Workloads</h3>
                           </div>
                           <span className="text-[10px] font-mono text-gray-600 uppercase">{posture.quarantine.length} Pods restricted</span>
                        </div>
                        <div className="p-0">
                           {posture.quarantine.map((item, idx) => (
                             <div key={item.id} className={cn("p-6 flex items-center justify-between group hover:bg-white/[0.01] transition-colors", idx !== posture.quarantine.length -1 && "border-b border-white/[0.05]")}>
                                <div className="flex items-center gap-5">
                                   <div className="w-10 h-10 rounded-lg bg-accent-red/20 border border-accent-red/30 flex items-center justify-center">
                                      <Server className="w-5 h-5 text-accent-red" />
                                   </div>
                                   <div>
                                      <div className="flex items-center gap-3">
                                         <span className="text-sm font-bold text-white">{item.name}</span>
                                         <span className="text-[9px] font-mono text-gray-500">_NS: {item.namespace}</span>
                                      </div>
                                      <div className="text-[11px] text-gray-500 mt-1 uppercase tracking-tight">REASON: <span className="text-gray-300">{item.reason}</span> • DURATION: <span className="text-accent-blue">{item.duration}</span></div>
                                   </div>
                                </div>
                                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button className="px-3 py-1.5 rounded bg-accent-green text-black text-[10px] font-bold uppercase tracking-widest hover:bg-accent-green/80">Restore Pod</button>
                                   <button className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:text-white">Forensic Logs</button>
                                </div>
                             </div>
                           ))}
                           {posture.quarantine.length === 0 && (
                             <div className="py-20 flex flex-col items-center justify-center opacity-20">
                                <CheckCircle2 className="w-12 h-12 mb-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">No workloads in quarantine</span>
                             </div>
                           )}
                        </div>
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="h-10 border-t border-white/10 bg-black px-8 flex items-center justify-between text-[9px] font-mono text-gray-600 uppercase tracking-widest">
            <div className="flex gap-6">
              <span>Agent Status: Synchronized</span>
              <span>Latency: 12ms</span>
              <span>Engine Status: Operations Critical</span>
            </div>
            <div className="flex gap-6">
              <span>Security Hub V4.2.0-Production</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
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
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
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
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
