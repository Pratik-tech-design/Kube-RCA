import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, Cpu, Server, Database, Activity, Shield, Terminal, Zap, Hash, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMANDS = [
  { icon: <Cpu className="w-4 h-4" />, label: 'Scale timeseries-db', category: 'Infrastructure', shortcut: 'S' },
  { icon: <Terminal className="w-4 h-4" />, label: 'Inspect analytics-engine logs', category: 'Logs', shortcut: 'L' },
  { icon: <Shield className="w-4 h-4" />, label: 'Quarantine iot-gateway-05', category: 'Security', shortcut: 'Q' },
  { icon: <Database className="w-4 h-4" />, label: 'Expand PVC IOPS', category: 'Storage', shortcut: 'V' },
  { icon: <Activity className="w-4 h-4" />, label: 'Run drift analysis', category: 'Intelligence', shortcut: 'D' },
];

const RECENT = [
  { type: 'pod', name: 'iot-gateway-01', namespace: 'campus-iot' },
  { type: 'incident', name: 'INC-4821', status: 'Active' },
  { type: 'query', name: 'memory PSI anomalies > 80%' },
];

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // This logic will be handled by the parent, but good to have as reference
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const getSearchResults = () => {
    if (!query) return [];
    const q = query.toLowerCase();
    const results = [];

    if (q.includes('pod') || q.includes('unhealthy')) {
      results.push({ icon: <Server className="w-4 h-4 text-accent-red" />, label: 'iot-gateway-05', detail: 'Status: CrashLoopBackOff • Restarts: 12', category: 'Pods' });
      results.push({ icon: <Server className="w-4 h-4 text-accent-yellow" />, label: 'timeseries-db-02', detail: 'Status: Pending • PVC Pressure', category: 'Pods' });
    }
    if (q.includes('latency') || q.includes('timeseries')) {
      results.push({ icon: <Activity className="w-4 h-4 text-accent-red" />, label: 'timeseries-db latency', detail: 'Spike detected: 42ms (Threshold 15ms)', category: 'Telemetry' });
    }
    if (q.includes('psi') || q.includes('memory')) {
      results.push({ icon: <Database className="w-4 h-4 text-accent-purple" />, label: 'Memory PSI Anomaly', detail: 'Node memory saturation at 92%', category: 'Intelligence' });
    }
    if (q.includes('incident') || q.includes('restart')) {
      results.push({ icon: <Zap className="w-4 h-4 text-accent-orange" />, label: 'INC-2918: Restart Cascade', detail: 'Active investigation in analytics-engine', category: 'Incidents' });
    }

    return results;
  };

  const searchResults = getSearchResults();

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
          <div className="fixed inset-0 z-[120] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div 
               initial={{ opacity: 0, y: -20, scale: 0.98 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: -10, scale: 0.98 }}
               className="w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-xl shadow-2xl overflow-hidden pointer-events-auto shadow-accent-blue/10"
            >
              <div className="flex items-center px-4 py-3 border-b border-white/10">
                <Search className="w-5 h-5 text-gray-500 mr-3" />
                <input 
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Probe infrastructure, logs, or select agent action..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-gray-200 placeholder:text-gray-600 font-medium"
                />
                <div className="flex items-center gap-1.5 px-1.5 py-0.5 border border-white/10 rounded bg-white/5 text-[10px] text-gray-500 font-mono">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto style-scrollbar p-2">
                {query === '' ? (
                  <div className="space-y-4 py-2">
                    <section>
                      <h3 className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Recent Investigations</h3>
                      <div className="space-y-1">
                        {RECENT.map((item, idx) => (
                          <button key={idx} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 flex items-center justify-between group transition-colors">
                            <div className="flex items-center gap-3">
                              {item.type === 'pod' && <Server className="w-4 h-4 text-accent-blue" />}
                              {item.type === 'incident' && <Zap className="w-4 h-4 text-accent-red" />}
                              {item.type === 'query' && <Hash className="w-4 h-4 text-accent-purple" />}
                              <span className="text-xs text-gray-300">{item.name}</span>
                              {item.namespace && <span className="text-[10px] text-gray-600 font-mono">/{item.namespace}</span>}
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-gray-700 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                          </button>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Suggested Commands</h3>
                      <div className="space-y-1">
                        {COMMANDS.map((cmd, idx) => (
                          <button key={idx} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 flex items-center justify-between group transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="p-1 rounded bg-white/5 text-gray-400 group-hover:text-accent-blue transition-colors">
                                {cmd.icon}
                              </div>
                              <div>
                                <div className="text-xs text-gray-300 font-medium">{cmd.label}</div>
                                <div className="text-[9px] text-gray-600 uppercase tracking-tighter">{cmd.category}</div>
                              </div>
                            </div>
                            <div className="px-1.5 py-0.5 rounded border border-white/5 text-[9px] text-gray-600 font-mono uppercase">
                              {cmd.shortcut}
                            </div>
                          </button>
                        ))}
                      </div>
                    </section>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1 py-1">
                    {searchResults.map((res, idx) => (
                      <button key={idx} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 flex items-center justify-between group transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded bg-white/5">
                            {res.icon}
                          </div>
                          <div>
                            <div className="text-xs text-white font-bold">{res.label}</div>
                            <div className="text-[10px] text-gray-500">{res.detail}</div>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-gray-600 uppercase tracking-wider">{res.category}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center opacity-40">
                    <Zap className="w-8 h-8 text-accent-blue mb-2 animate-pulse" />
                    <p className="text-xs font-bold uppercase tracking-widest">Generating inference vector for "{query}"...</p>
                  </div>
                )}
              </div>

              <div className="px-4 py-2 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[10px] text-gray-600">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><kbd className="px-1 rounded bg-white/5 border border-white/10 uppercase">Esc</kbd> Close</span>
                  <span className="flex items-center gap-1"><kbd className="px-1 rounded bg-white/5 border border-white/10 uppercase">↵</kbd> Select</span>
                  <span className="flex items-center gap-1"><kbd className="px-1 rounded bg-white/5 border border-white/10 uppercase">↑↓</kbd> Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-3 h-3" />
                  <span className="font-mono">KUBERCA_CORE_V2.1</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
