import { motion } from 'motion/react';
import { Pod } from '../types';
import { Activity, Database, HardDrive, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';

interface PSIMetricsProps {
  pods: Pod[];
}

export default function PSIMetrics({ pods }: PSIMetricsProps) {
  const criticalPods = pods.filter(p => p.psi.cpu > 50 || p.psi.io > 50).slice(0, 4);

  const PressureBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="flex flex-col gap-1.5 flex-1 max-w-[80px]">
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
        <span className={cn("text-[8px] font-mono font-bold", value > 50 ? 'text-accent-red' : 'text-gray-400')}>{value.toFixed(0)}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={cn("h-full rounded-full", color)}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );

  return (
    <div className="glass-panel flex flex-col h-full bg-[#0a0a0c]">
      <div className="p-3 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01] shrink-0">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-accent-blue" />
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Pod PSI Telemetry (Linux Kernel)</h2>
        </div>
        <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
          <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">Real-time eBPF Probe</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 style-scrollbar space-y-4">
        {criticalPods.map((pod) => (
          <div key={pod.id} className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg group hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-200 uppercase tracking-widest group-hover:text-accent-blue transition-colors">{pod.name}</span>
                <span className="text-[8px] font-mono text-gray-600 uppercase italic">{pod.namespace}</span>
              </div>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent-red/10 border border-accent-red/20">
                <Activity className="w-2.5 h-2.5 text-accent-red" />
                <span className="text-[8px] font-bold text-accent-red">SCALING PRESSURE</span>
              </div>
            </div>

            <div className="flex gap-6">
              <PressureBar label="CPU Stall" value={pod.psi.cpu} color="bg-accent-blue" />
              <PressureBar label="MEM Stall" value={pod.psi.memory} color="bg-accent-purple" />
              <PressureBar label="I/O Stall" value={pod.psi.io} color="bg-accent-red" />
              
              <div className="ml-auto flex flex-col justify-end">
                <span className="text-[7px] font-bold text-gray-600 uppercase tracking-tighter mb-0.5">Evidence</span>
                <div className="text-[9px] font-mono text-gray-400 flex items-center gap-1">
                  <div className="w-1 h-1 bg-accent-green rounded-full shrink-0" />
                  98% Confidence
                </div>
              </div>
            </div>
          </div>
        ))}

        {criticalPods.length === 0 && (
          <div className="flex-1 flex items-center justify-center h-full min-h-[100px] text-gray-600 font-mono text-[10px] uppercase tracking-widest border border-dashed border-white/5 rounded-lg">
            No critical memory/io stall pressure
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-blue opacity-50" />
            <span className="text-[8px] font-mono text-gray-600 uppercase">CPU</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-purple opacity-50" />
            <span className="text-[8px] font-mono text-gray-600 uppercase">MEM</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-red opacity-50" />
            <span className="text-[8px] font-mono text-gray-600 uppercase">I/O</span>
          </div>
        </div>
        <button className="text-[9px] font-bold text-gray-400 hover:text-white uppercase tracking-tighter transition-colors">Export Telemetry</button>
      </div>
    </div>
  );
}
