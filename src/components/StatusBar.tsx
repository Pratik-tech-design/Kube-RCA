import { AlertCircle, Activity, ShieldAlert, Globe, CheckCircle2 } from 'lucide-react';
import { Incident } from '../types';
import { cn } from '../lib/utils';

interface StatusBarProps {
  incident: Incident;
}

export default function StatusBar({ incident }: StatusBarProps) {
  const isActive = incident.status !== 'resolved';

  return (
    <div className="sticky top-14 z-40 w-full bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/[0.05] px-6 py-2 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          {isActive ? (
            <>
              <div className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
              <span className="text-[10px] font-bold text-accent-red uppercase tracking-widest">Active Incident: {incident.id}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3 h-3 text-accent-green" />
              <span className="text-[10px] font-bold text-accent-green uppercase tracking-widest">System Normalized</span>
            </>
          )}
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono text-[9px] text-gray-400">
            <Activity className="w-3 h-3" />
            <span>NODE_LOAD: 84%</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[9px] text-gray-400">
             <ShieldAlert className="w-3 h-3" />
             <span>RBAC_ANOMALY: 1</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-white/5 border border-white/10">
          <Globe className="w-3 h-3 text-accent-blue" />
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Namespace: analytics</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-gray-600">T_ELAPSED: 00:04:12</span>
        </div>
      </div>
    </div>
  );
}
