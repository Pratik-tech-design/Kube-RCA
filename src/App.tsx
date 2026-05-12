/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import StatusBar from './components/StatusBar.tsx';
import MetricCard from './components/MetricCard.tsx';
import CausalGraph from './components/CausalGraph.tsx';
import CausalTimeline from './components/CausalTimeline.tsx';
import PSIMetrics from './components/PSIMetrics.tsx';
import SemanticLogSearch from './components/SemanticLogSearch.tsx';
import SecurityWarRoom from './components/SecurityWarRoom.tsx';
import AlertStream from './components/AlertStream.tsx';
import IncidentWorkspace from './components/IncidentWorkspace.tsx';
import CommandPalette from './components/CommandPalette.tsx';
import IncidentDrawer from './components/IncidentDrawer.tsx';
import SecurityWorkspace from './components/SecurityWorkspace.tsx';
import SettingsWorkspace from './components/SettingsWorkspace.tsx';
import CausalInvestigationTerminal from './components/CausalInvestigationTerminal.tsx';
import { Cpu, Database, HardDrive, Share2, AlertTriangle, Activity } from 'lucide-react';
import { 
  INITIAL_PODS, 
  INITIAL_LINKS, 
  MOCK_ALERTS, 
  MOCK_INCIDENT, 
  MOCK_SECURITY, 
  generateLiveMetrics,
  detectAlerts
} from './mockData';
import { Pod, Incident, Alert, SecurityPosture, Severity } from './types';

export default function App() {
  const [pods, setPods] = useState<Pod[]>(INITIAL_PODS);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [incident, setIncident] = useState<Incident>(MOCK_INCIDENT);
  const [security, setSecurity] = useState<SecurityPosture>(MOCK_SECURITY);
  const [investigatingIncident, setInvestigatingIncident] = useState<Incident | null>(null);
  
  // Navigation States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false);
  const [isSecurityWorkspaceOpen, setIsSecurityWorkspaceOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPods(prev => generateLiveMetrics(prev));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Separate effect for active alert detection and escalation to avoid side-effects in updaters
  useEffect(() => {
    const detected = detectAlerts(pods);
    if (detected.length > 0) {
      setAlerts(current => {
        // Filter out detected alerts that already exist in the current stream to prevent duplicates
        // We judge "same" by podId, type, and severity within a short time window or just matching IDs
        const existingIds = new Set(current.map(a => a.id));
        const trulyNew = detected.filter(a => !existingIds.has(a.id));
        
        if (trulyNew.length === 0) return current;

        const combined = [...trulyNew, ...current].slice(0, 50);
        return combined;
      });

      // Escalation Intelligence: If we have multiple critical alerts, escalate to incident
      const criticals = detected.filter(a => a.severity === 'critical');
      if (criticals.length >= 2 && incident.status === 'resolved') {
        setIncident(prev => ({
          ...MOCK_INCIDENT,
          id: `inc-${Date.now()}`,
          status: 'active',
          severity: 'critical',
          title: 'Cascade Resource Failure Detected',
          startTime: new Date().toISOString(),
          alerts: criticals,
          affectedPods: criticals.map(a => a.podId || '').filter(Boolean)
        }));
      }
    }
  }, [pods, incident.status]);

  const handleApproveRemediation = (remId: string) => {
    setIncident(prev => ({
      ...prev,
      remediation: prev.remediation ? { ...prev.remediation, status: 'executed' } : undefined,
      status: 'resolved'
    }));
  };

  const handleSecurityAction = (eventId: string, action: string) => {
    setSecurity(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === eventId ? { ...e, status: 'contained' } : e)
    }));
  };

  const totalCPU = pods.reduce((acc, p) => acc + p.cpu, 0) / pods.length;
  const totalMem = pods.reduce((acc, p) => acc + p.memory, 0);
  const avgLatency = pods.reduce((acc, p) => acc + p.pvcLatency, 0) / pods.length;
  const totalNetwork = pods.reduce((acc, p) => acc + p.network, 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#050507] selection:bg-accent-blue/30 selection:text-white font-sans">
      <Header 
        onSearchClick={() => setIsSearchOpen(true)}
        onAlertsClick={() => setIsAlertDrawerOpen(true)}
        onSecurityClick={() => setIsSecurityWorkspaceOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        hasUnresolvedAlerts={incident.status === 'active'}
        hasSecurityThreats={security.events.some(e => e.status === 'active' && e.severity === 'critical')}
      />
      <StatusBar incident={incident} />
      
      <main className="w-full max-w-[1800px] mx-auto p-4 md:p-6 space-y-6">
        {/* Row 1: High Density Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            label="Node CPU Pressure" 
            value={totalCPU.toFixed(1)} 
            unit="%" 
            trend="up" 
            icon={<Cpu className="w-4 h-4" />} 
          />
          <MetricCard 
            label="Memory Saturation" 
            value={(totalMem / 1024).toFixed(1)} 
            unit="GB" 
            trend="stable" 
            icon={<Database className="w-4 h-4" />}
            color="purple" 
          />
          <MetricCard 
            label="PVC I/O Stall" 
            value={avgLatency.toFixed(1)} 
            unit="ms" 
            trend="up" 
            icon={<HardDrive className="w-4 h-4" />}
            color="red" 
          />
          <MetricCard 
            label="Egress Throughput" 
            value={(totalNetwork / 10).toFixed(0)} 
            unit="Gbps" 
            trend="down" 
            icon={<Share2 className="w-4 h-4" />}
            color="green" 
          />
        </div>

        {/* Row 2 & 3: Primary Diagnostic Surface */}
        <div className="grid grid-cols-12 gap-6">
          {/* Main Workspace: Topology + Timeline */}
          <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
            <div className="min-h-[500px] lg:h-[500px] w-full">
              <CausalGraph pods={pods} links={INITIAL_LINKS} />
            </div>
            <div className="min-h-[220px]">
              <CausalTimeline anomalies={alerts} />
            </div>
          </div>

          {/* Right Sidebar: Incident Command + Security War-Room */}
          <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
            {/* Incident Feed */}
            <div className="min-h-[300px] lg:h-[400px] bg-[#0a0a0f] border border-white/[0.05] rounded-xl overflow-hidden flex flex-col">
              <div className="px-5 py-3 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-accent-red" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Incident Command</h3>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent-red/10 border border-accent-red/20 text-[9px] font-bold text-accent-red uppercase">
                   {incident.status === 'active' ? 'Active Crisis' : 'Mitigated'}
                </div>
              </div>
              <div className="flex-1 p-5 space-y-4">
                 <div className="p-4 rounded-lg bg-accent-red/5 border border-accent-red/20 group hover:bg-accent-red/10 transition-all cursor-pointer" onClick={() => setInvestigatingIncident(incident)}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-mono text-accent-red font-bold uppercase">{incident.id} • {incident.severity}</span>
                      <span className="text-[8px] font-mono text-gray-500">{incident.startTime}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{incident.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                      Root Cause: {incident.rootCause}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                       <div className="flex -space-x-2">
                         {incident.affectedPods.slice(0, 3).map(id => (
                           <div key={id} className="w-5 h-5 rounded-full border border-black bg-gray-800 flex items-center justify-center text-[8px] font-bold italic">P{id}</div>
                         ))}
                       </div>
                       <button className="flex items-center gap-1.5 text-accent-red text-[10px] font-bold uppercase tracking-widest">
                         Investigate <Activity className="w-3 h-3" />
                       </button>
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex-1 min-h-[400px] overflow-hidden">
              <SecurityWarRoom posture={security} onEventAction={handleSecurityAction} />
            </div>
          </div>
        </div>

        {/* Row 4: Deep Telemetry & Investigation */}
        <div className="grid grid-cols-12 gap-6 pb-20">
          <div className="col-span-12 md:col-span-6 lg:col-span-4 min-h-[450px]">
            <PSIMetrics pods={pods} />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-4 min-h-[450px]">
            <AlertStream alerts={alerts} onSelectAlert={() => {}} />
          </div>
          <div className="col-span-12 lg:col-span-4 min-h-[450px]">
              <SemanticLogSearch />
          </div>
        </div>
      </main>

      {/* Investigation Modal */}
      <IncidentWorkspace 
        incident={investigatingIncident} 
        onClose={() => setInvestigatingIncident(null)} 
        onApproveRemediation={handleApproveRemediation}
      />

      {/* Overlays & Drawers */}
      <CommandPalette 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      
      <IncidentDrawer 
        isOpen={isAlertDrawerOpen} 
        onClose={() => setIsAlertDrawerOpen(false)} 
        incidents={[incident]} 
        onSelectIncident={(inc) => {
          setInvestigatingIncident(inc);
          setIsAlertDrawerOpen(false);
        }}
      />

      <SecurityWorkspace 
        isOpen={isSecurityWorkspaceOpen} 
        onClose={() => setIsSecurityWorkspaceOpen(false)} 
        posture={security}
        onEventAction={handleSecurityAction}
      />

      <SettingsWorkspace 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {/* Decorative Atmosphere */}
      <div className="fixed top-0 left-1/4 w-[80vw] h-[60vh] bg-accent-blue/5 blur-[160px] pointer-events-none -translate-y-1/2 opacity-30" />
      <div className="fixed bottom-0 right-1/4 w-[80vw] h-[60vh] bg-accent-purple/5 blur-[160px] pointer-events-none translate-y-1/2 opacity-30" />
    </div>
  );
}

