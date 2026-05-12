import { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, Search, Filter, Layers, Database, ChevronRight, Hash } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SemanticLogSearch() {
  const [query, setQuery] = useState('');

  const MOCK_LOGS = [
    { type: 'error', cluster: 'I/O', content: 'Connection timeout in java.sql.SQLException on timeseries-db-0' },
    { type: 'error', cluster: 'RESOURCE', content: 'Cgroup memory limit exceeded for pod analytics-engine' },
    { type: 'warning', cluster: 'NETWORK', content: 'Asymmetric packet loss detected on eth0 gateway interface' },
    { type: 'info', cluster: 'ORCHESTRATION', content: 'HPA triggered scale-up event for healthcare-api' },
  ];

  return (
    <div className="glass-panel flex flex-col h-full bg-[#070709] border-[#1a1a1f]">
      <div className="p-3 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01] shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-accent-blue" />
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Semantic Log Explorer (FAISS Indexed)</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
            <Layers className="w-2.5 h-2.5 text-blue-500" />
            <span className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">Vector Rank: 0.94</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-white/[0.05]">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-accent-blue transition-colors" />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search log intent (e.g. 'why did the database timeout?')"
            className="w-full bg-black/40 border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-[11px] font-mono focus:outline-none focus:border-accent-blue/50 transition-all placeholder:text-gray-700"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button className="p-1 px-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Filter className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 style-scrollbar font-mono">
        <div className="px-2 py-2 mb-2">
          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-2">Anomalous Clusters Detected</span>
          <div className="flex flex-wrap gap-2">
            {['unindexed queries', 'disk saturation', 'probe timeouts'].map(c => (
              <span key={c} className="text-[8px] font-bold px-2 py-0.5 rounded bg-accent-red/10 border border-accent-red/20 text-accent-red uppercase tracking-wider cursor-pointer hover:bg-accent-red/20 transition-all">
                {c}
              </span>
            ))}
          </div>
        </div>

        {MOCK_LOGS.map((log, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-start gap-4 p-3 rounded hover:bg-white/[0.03] transition-colors group cursor-pointer border border-transparent hover:border-white/5"
          >
            <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
              <Hash className="w-3 h-3 text-gray-700" />
              <div className="w-px h-full bg-white/[0.05]" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className={cn(
                  "text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-widest shrink-0",
                  log.type === 'error' ? 'bg-accent-red/10 border-accent-red/20 text-accent-red' : 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue'
                )}>
                  {log.type}
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider overflow-hidden text-ellipsis whitespace-nowrap">{log.cluster}</span>
                <span className="text-[8px] text-gray-700 ml-auto shrink-0 tracking-tighter">10:05:22.842</span>
              </div>
              <p className="text-[10px] text-gray-300 leading-relaxed font-mono tracking-tight group-hover:text-white transition-colors break-words">
                {log.content}
              </p>
            </div>

            <ChevronRight className="w-3 h-3 text-gray-800 self-center group-hover:text-gray-500 transition-colors" />
          </motion.div>
        ))}
      </div>

      <div className="p-3 border-t border-white/[0.05] bg-black/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-3 h-3 text-gray-600" />
          <span className="text-[8px] font-mono text-gray-600 uppercase tracking-tighter">Indexing 4.2M events from influx-logs</span>
        </div>
        <button className="text-[9px] font-bold text-accent-blue uppercase tracking-tighter hover:glow-blue transition-all">View related traces</button>
      </div>
    </div>
  );
}
