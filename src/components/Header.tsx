import { Shield, Zap, Search, Bell, Settings, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';

interface HeaderProps {
  onSearchClick: () => void;
  onAlertsClick: () => void;
  onSecurityClick: () => void;
  onSettingsClick: () => void;
  hasUnresolvedAlerts: boolean;
  hasSecurityThreats: boolean;
}

export default function Header({ 
  onSearchClick, 
  onAlertsClick, 
  onSecurityClick, 
  onSettingsClick,
  hasUnresolvedAlerts,
  hasSecurityThreats
}: HeaderProps) {
  return (
    <header className="h-14 border-b border-white/[0.05] flex items-center justify-between px-6 bg-[#050507] sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.location.reload()}>
          <div className="w-8 h-8 bg-accent-blue/10 flex items-center justify-center rounded border border-accent-blue/30 relative overflow-hidden transition-all group-hover:border-accent-blue/60 group-hover:bg-accent-blue/20">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Terminal className="w-4 h-4 text-accent-blue relative z-10 transition-transform group-hover:scale-110" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-accent-blue blur-[6px]" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-[0.2em] uppercase flex items-center gap-2 transition-colors group-hover:text-white">
              KUBE<span className="text-accent-blue">RCA</span>
              <span className="text-[9px] font-mono bg-white/5 text-gray-400 px-1.5 py-0.5 rounded border border-white/10 ml-1">EBPF_ENABLED</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[8px] text-accent-green font-mono uppercase animate-pulse">● System War-Room Active</span>
              <span className="text-[8px] text-gray-600 font-mono italic">SESSION: 0xc42e...f10a</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden xl:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">Inference Convegence</span>
            <span className="text-xs font-mono font-bold text-accent-purple">98.2%</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">Telemetry Stream</span>
            <span className="text-xs font-mono font-bold text-accent-green">LIVE / 42.8k OPS</span>
          </div>
        </div>

        <div className="h-6 w-px bg-white/[0.05]" />

        <div className="flex items-center gap-3">
          {[
            { icon: <Search className="w-4 h-4" />, label: 'Search', onClick: onSearchClick },
            { icon: <Bell className="w-4 h-4" />, label: 'Alerts', badge: hasUnresolvedAlerts, onClick: onAlertsClick },
            { 
              icon: <Shield className={cn("w-4 h-4", hasSecurityThreats && "text-accent-red")} />, 
              label: 'Security', 
              pulse: hasSecurityThreats,
              onClick: onSecurityClick 
            },
            { icon: <Settings className="w-4 h-4" />, label: 'Settings', onClick: onSettingsClick, rotate: true },
          ].map((item, idx) => (
            <button 
              key={idx} 
              onClick={item.onClick}
              className={cn(
                "p-2 text-gray-500 hover:text-white transition-all relative group rounded-lg hover:bg-white/5",
                item.pulse && "animate-pulse"
              )}
            >
              <div className={cn("transition-transform duration-500 ease-out", item.rotate && "group-active:rotate-[30deg]")}>
                {item.icon}
              </div>
              {item.badge && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent-red rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black border border-white/10 text-[8px] uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100]">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

