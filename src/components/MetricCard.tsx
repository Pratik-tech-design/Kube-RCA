import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../lib/utils';
import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  icon: ReactNode;
  color?: 'blue' | 'purple' | 'red' | 'green';
}

export default function MetricCard({ label, value, unit, trend, icon, color = 'blue' }: MetricCardProps) {
  const colorMap = {
    blue: 'border-accent-blue/10 text-accent-blue bg-accent-blue/5',
    purple: 'border-accent-purple/10 text-accent-purple bg-accent-purple/5',
    red: 'border-accent-red/10 text-accent-red bg-accent-red/5',
    green: 'border-accent-green/10 text-accent-green bg-accent-green/5',
  };

  return (
    <div className="glass-panel p-3 border-white/5 flex flex-col justify-between gap-2 group hover:border-white/20 transition-all duration-300 cursor-default">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded bg-white/5 border border-white/10 transition-colors group-hover:bg-white/10", 
            color === 'red' && 'text-accent-red', 
            color === 'blue' && 'text-accent-blue', 
            color === 'purple' && 'text-accent-purple', 
            color === 'green' && 'text-accent-green'
          )}>
            {icon}
          </div>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none">{label}</p>
        </div>
        <div className="flex items-center gap-1">
          {trend === 'up' && <TrendingUp className="w-2.5 h-2.5 text-accent-red" />}
          {trend === 'down' && <TrendingDown className="w-2.5 h-2.5 text-accent-green" />}
          {trend === 'stable' && <Minus className="w-2.5 h-2.5 text-gray-600" />}
        </div>
      </div>
      
      <div className="flex items-baseline gap-1 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <span className="text-xl font-bold tracking-tight font-mono tabular-nums">{value}</span>
        <span className="text-[10px] text-gray-600 font-mono font-medium lowercase tracking-tighter">{unit}</span>
      </div>

      <div className="h-0.5 w-full bg-white/[0.03] rounded-full overflow-hidden shrink-0">
        <motion.div 
          className={cn("h-full", 
            color === 'blue' ? 'bg-accent-blue shadow-[0_0_8px_#3b82f644]' : 
            color === 'purple' ? 'bg-accent-purple shadow-[0_0_8px_#9333ea44]' : 
            color === 'red' ? 'bg-accent-red shadow-[0_0_8px_#dc262644]' : 
            'bg-accent-green shadow-[0_0_8px_#16a34a44]'
          )}
          initial={{ width: 0 }}
          animate={{ width: typeof value === 'number' || !isNaN(Number(value)) ? `${Math.min(100, Number(value))}%` : '40%' }}
          transition={{ duration: 1.5 }}
        />
      </div>
    </div>
  );
}
