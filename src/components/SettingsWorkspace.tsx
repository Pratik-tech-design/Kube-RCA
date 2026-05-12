import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Settings, Bell, Zap, Shield, Activity, 
  Terminal, Globe, Cpu, Database, Save, RotateCcw, 
  ChevronRight, Brain, Sliders, Lock
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SettingsWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsSection = 'alerts' | 'ai' | 'security' | 'observability';

export default function SettingsWorkspace({ isOpen, onClose }: SettingsWorkspaceProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('alerts');

  const sections = [
    { id: 'alerts', label: 'Alerting Engine', icon: <Bell className="w-4 h-4" /> },
    { id: 'ai', label: 'Inference Agents', icon: <Brain className="w-4 h-4" /> },
    { id: 'security', label: 'Security Policy', icon: <Lock className="w-4 h-4" /> },
    { id: 'observability', label: 'Telemetry Stream', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 z-[120] bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-w-5xl mx-auto"
          >
            {/* Header */}
            <div className="px-8 py-5 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent-blue/20 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-accent-blue animate-spin-slow" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-widest uppercase">System Control Workspace</h2>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">Infrastructure Management Core</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Navigation Sidebar */}
              <div className="w-64 border-r border-white/[0.05] p-6 space-y-6">
                <nav className="space-y-1">
                  {sections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id as SettingsSection)}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all group",
                        activeSection === section.id 
                          ? "bg-accent-blue/10 text-accent-blue border border-accent-blue/20" 
                          : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {section.icon}
                        <span className="text-xs font-bold uppercase tracking-widest">{section.label}</span>
                      </div>
                      <ChevronRight className={cn("w-4 h-4 transition-transform", activeSection === section.id ? "rotate-90" : "")} />
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto style-scrollbar p-10 bg-gradient-to-br from-transparent to-accent-blue/[0.02]">
                {activeSection === 'alerts' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Threshold Configuration</h3>
                      <p className="text-sm text-gray-500">Define operational limits for infrastructure-grade observability.</p>
                    </div>

                    <div className="space-y-6">
                      {[
                        { label: 'CPU Pressure Threshold', value: '85%', description: 'Trigger HIGH severity alert when sustained pressure exceeds this limit.' },
                        { label: 'PVC Latency Limit', value: '100ms', description: 'Monitor block storage performance and trigger critical remediation.' },
                        { label: 'Network Retry Growth', value: '12%', description: 'Percentage increase in retries over 5m window before warning.' },
                      ].map((item, i) => (
                        <div key={i} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-300">{item.label}</span>
                            <div className="px-3 py-1 rounded bg-black border border-white/10 text-xs font-mono text-accent-blue">{item.value}</div>
                          </div>
                          <p className="text-[11px] text-gray-600 italic">"{item.description}"</p>
                          <input type="range" className="w-full h-1 bg-white/5 rounded-full appearance-none accent-accent-blue" />
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-white/5 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Autonomous Remediation</h4>
                      <div className="flex items-center justify-between p-4 rounded-lg border border-accent-green/20 bg-accent-green/5">
                        <div className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-accent-green" />
                          <div>
                            <div className="text-xs font-bold text-white">Enable Predictive Scaling</div>
                            <div className="text-[10px] text-gray-500">Allow AI to scale PVC/CPU before saturation occurs.</div>
                          </div>
                        </div>
                        <div className="w-10 h-5 bg-accent-green rounded-full relative">
                          <div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'ai' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Inference Agent Controls</h3>
                      <p className="text-sm text-gray-500">Calibrate the depth and confidence of autonomous investigation agents.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { title: 'Observability Agent', status: 'Optimal', load: '12%' },
                        { title: 'Root Cause Analysis', status: 'Deep Scan', load: '45%' },
                        { title: 'Security Inference', status: 'Hardened', load: '22%' },
                        { title: 'Log Clustering', status: 'Standard', load: '8%' },
                      ].map((agent, i) => (
                        <div key={i} className="p-4 rounded-xl border border-white/5 bg-black/40 flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                               <Brain className="w-4 h-4 text-accent-purple" />
                               <span className="text-xs font-bold text-gray-200">{agent.title}</span>
                             </div>
                             <div className="px-1.5 py-0.5 rounded-full bg-accent-green/10 border border-accent-green/20 text-[8px] font-bold text-accent-green uppercase tracking-tighter">{agent.status}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[9px] font-mono text-gray-600">
                               <span>Compute Load</span>
                               <span>{agent.load}</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-accent-purple" style={{ width: agent.load }} />
                            </div>
                          </div>
                          <button className="text-[10px] font-bold text-accent-blue uppercase tracking-widest text-left mt-2">Adjust Parameters</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeSection === 'security' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Security Enforcement</h3>
                      <p className="text-sm text-gray-500">Configure global protection layers and runtime isolation rules.</p>
                    </div>
                    
                    <div className="space-y-4">
                       {[
                         { icon: <Lock className="w-4 h-4" />, label: 'Namespace Isolation Policy', status: 'STRICT' },
                         { icon: <Shield className="w-4 h-4" />, label: 'Egress Traffic Inspection', status: 'ACTIVE' },
                         { icon: <Terminal className="w-4 h-4" />, label: 'Binary Execution Guard', status: 'HARDENED' },
                       ].map((policy, i) => (
                         <div key={i} className="p-4 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {policy.icon}
                              <span className="text-xs font-bold text-gray-300">{policy.label}</span>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                               Modify Policy <ChevronRight className="w-3 h-3" />
                            </button>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
                
                {activeSection === 'observability' && (
                   <div className="space-y-8 text-center py-20 opacity-40">
                      <Activity className="w-16 h-16 mx-auto mb-4 text-accent-blue" />
                      <p className="text-xs font-bold uppercase tracking-[0.4em]">Telemetry Engine Calibration Interface</p>
                   </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-white/10 bg-black flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-blue text-black text-xs font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <Save className="w-4 h-4" /> Save Global Configuration
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
                  <RotateCcw className="w-4 h-4" /> Reset to Defaults
                </button>
              </div>
              <div className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">
                 System Revision 0xc4e2 • Last Sync: Today 10:02:11
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
