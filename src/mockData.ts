import { Pod, Alert, Incident, AgentInsight, Link, SecurityPosture, SecurityEvent, RBACAudit, Severity } from './types';

// Enhanced Alert Detection Logic
export function detectAlerts(pods: Pod[]): Alert[] {
  const newAlerts: Alert[] = [];
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  pods.forEach(pod => {
    let alertCount = 0;
    // CPU Pressure
    if (pod.cpu > 95) {
      newAlerts.push({
        id: `cpu-crit-${pod.id}-${Date.now()}-${alertCount++}`,
        time: now,
        podId: pod.id,
        description: `Critical CPU saturation: ${pod.cpu.toFixed(1)}% on ${pod.name}`,
        severity: 'critical',
        type: 'cpu',
        source: 'kube-analyzer-01'
      });
    } else if (pod.cpu > 85) {
      newAlerts.push({
        id: `cpu-high-${pod.id}-${Date.now()}-${alertCount++}`,
        time: now,
        podId: pod.id,
        description: `High CPU pressure detected on ${pod.name}`,
        severity: 'high',
        type: 'cpu',
        source: 'kube-analyzer-01'
      });
    }

    // PVC Latency
    if (pod.pvcLatency > 40) {
      newAlerts.push({
        id: `io-crit-${pod.id}-${Date.now()}-${alertCount++}`,
        time: now,
        podId: pod.id,
        description: `Extreme I/O stall: ${pod.pvcLatency.toFixed(1)}ms on ${pod.name}`,
        severity: 'critical',
        type: 'io',
        source: 'storage-oracle'
      });
    }

    // Memory Saturation
    if (pod.memory > 1800) { // Assuming 2000MB limit
      newAlerts.push({
        id: `mem-high-${pod.id}-${Date.now()}-${alertCount++}`,
        time: now,
        podId: pod.id,
        description: `Memory saturation approaching OOM: ${pod.memory}MB`,
        severity: 'high',
        type: 'memory',
        source: 'sidecar-monitor'
      });
    }

    // Network Spikes
    if (pod.network > 250) {
      newAlerts.push({
        id: `net-warn-${pod.id}-${Date.now()}-${alertCount++}`,
        time: now,
        podId: pod.id,
        description: `Egress traffic anomaly on ${pod.name}`,
        severity: 'warning',
        type: 'network',
        source: 'flow-inspector'
      });
    }
  });

  return newAlerts;
}

export const INITIAL_PODS: Pod[] = [
  { id: '1', name: 'iot-gateway-01', namespace: 'campus-iot', status: 'running', cpu: 12, memory: 512, pvcLatency: 2, network: 45, restarts: 0, psi: { cpu: 2, memory: 1, io: 0.5 } },
  { id: '2', name: 'iot-sensor-hub', namespace: 'campus-iot', status: 'running', cpu: 8, memory: 256, pvcLatency: 1.5, network: 12, restarts: 0, psi: { cpu: 1, memory: 0.5, io: 0.2 } },
  { id: '3', name: 'analytics-engine', namespace: 'analytics', status: 'warning', cpu: 85, memory: 1400, pvcLatency: 12, network: 80, restarts: 2, psi: { cpu: 15, memory: 8, io: 4 } },
  { id: '4', name: 'timeseries-db', namespace: 'analytics', status: 'error', cpu: 95, memory: 3200, pvcLatency: 120, network: 15, restarts: 5, psi: { cpu: 82, memory: 45, io: 92 } },
  { id: '5', name: 'traefik-ingress', namespace: 'infra', status: 'running', cpu: 5, memory: 128, pvcLatency: 0.5, network: 150, restarts: 0, psi: { cpu: 0.5, memory: 0.2, io: 0.1 } },
  { id: '6', name: 'core-dns', namespace: 'infra', status: 'running', cpu: 2, memory: 64, pvcLatency: 0.1, network: 5, restarts: 0, psi: { cpu: 0.1, memory: 0.1, io: 0.05 } },
  { id: '7', name: 'healthcare-api', namespace: 'analytics', status: 'running', cpu: 22, memory: 800, pvcLatency: 5, network: 30, restarts: 1, psi: { cpu: 5, memory: 2, io: 1 } },
];

export const INITIAL_LINKS: Link[] = [
  { source: '1', target: '4', traffic: 80, latency: 12, errorRate: 0.01, throughput: 120, health: 98 },
  { source: '2', target: '1', traffic: 40, latency: 2, errorRate: 0, throughput: 50, health: 100 },
  { source: '3', target: '4', traffic: 120, latency: 250, errorRate: 15, throughput: 45, health: 40, isCausal: true },
  { source: '5', target: '3', traffic: 60, latency: 45, errorRate: 5, throughput: 80, health: 85 },
  { source: '5', target: '7', traffic: 30, latency: 5, errorRate: 0, throughput: 40, health: 99 },
  { source: '7', target: '4', traffic: 100, latency: 180, errorRate: 12, throughput: 55, health: 60, isCausal: true },
];

export const MOCK_ALERTS: Alert[] = [
  { id: 'al-1', time: '10:01', podId: '4', description: 'CPU Pressure > 90% (Node: node-04)', severity: 'high', type: 'cpu', source: 'Kubelet/Metrics' },
  { id: 'al-2', time: '10:02', podId: '4', description: 'PVC Latency Spike: 120ms (mount: /data)', severity: 'critical', type: 'io', source: 'eBPF Observer' },
  { id: 'al-3', time: '10:04', podId: '3', description: 'Liveness Probe 3x failure in 60s', severity: 'warning', type: 'probe', source: 'Kubelet' },
  { id: 'al-4', time: '10:05', podId: '3', description: 'Container Restart Event: Exit Code 137', severity: 'critical', type: 'restart', source: 'Containerd' },
];

export const MOCK_INSIGHTS: AgentInsight[] = [
  { 
    agent: 'RootCause', 
    insight: 'Root cause isolated to [timeseries-db] I/O stall triggering cascading failures in [analytics] namespace.', 
    timestamp: '10:06:12',
    recommendation: 'Scale timeseries-db PVC IOPS or migrate to high-performance storage class.',
    evidenceSource: 'eBPF Block I/O Trace',
    reasoning: [
      { step: 'Ingesting eBPF network map', evidence: 'Detected asymmetric latency between gateway and DB', confidence: 0.98 },
      { step: 'Analyzing PSI metrics', evidence: 'IO Stall at 92% on node-04-nvme', confidence: 0.95 },
      { step: 'Correlating log timestamps', evidence: 'Write timeouts match PVC latency spikes', confidence: 0.92 }
    ]
  },
  { 
    agent: 'Observability', 
    insight: 'Full Pressure on Block I/O detected. 82% of tasks blocked on disk wait.', 
    timestamp: '10:05:45',
    reasoning: [
      { step: 'Polling PSI endpoints', evidence: 'io.full average 92.4', confidence: 1.0 }
    ]
  }
];

export const MOCK_INCIDENT: Incident = {
  id: 'INC-4821',
  title: 'Cascading Storage Saturation in Analytics Namespace',
  status: 'active',
  severity: 'critical',
  startTime: '10:01:00',
  rootCause: 'Timeseries DB PVC I/O exhaustion due to unindexed query spikes.',
  alerts: MOCK_ALERTS,
  affectedPods: ['4', '3', '7'],
  propagationChain: ['al-1', 'al-2', 'al-3', 'al-4'],
  aiReasoning: MOCK_INSIGHTS,
  remediation: {
    id: 'rem-1',
    action: 'PVC_IOPS_EXPANSION',
    description: 'Dynamically expand PVC IOPS from 3000 to 10000 for timeseries-db-pvc.',
    risk: 'low',
    impact: 'Restores I/O throughput; no downtime required for storage class expansion.',
    status: 'pending',
    rollbackPlan: 'Shrink PVC IOPS (requires block resize support check).'
  }
};

export const MOCK_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: 'sec-1',
    timestamp: '10:08:45',
    type: 'shell_execution',
    severity: 'high',
    podId: '5',
    description: 'Unexpected /bin/sh execution detected in traefik-ingress pod.',
    attackPath: ['5', '6'],
    status: 'active'
  },
  {
    id: 'sec-2',
    timestamp: '10:10:12',
    type: 'privilege_escalation',
    severity: 'critical',
    podId: '5',
    description: 'Process [id:1422] attempted to modify /etc/shadow.',
    attackPath: ['5'],
    status: 'contained'
  }
];

export const MOCK_RBAC_AUDITS: RBACAudit[] = [
  {
    id: 'rb-1',
    entity: 'sa:telemetry-agent',
    namespace: 'infra',
    risk: 'high',
    issue: 'ServiceAccount carries cluster-admin role bindings across all namespaces.',
    remediation: 'Restrict scope to "telemetry" namespace and reduce permissions to "readonly".',
    permissions: ['cluster-admin'],
    lastActivity: '2h ago'
  },
  {
    id: 'rb-2',
    entity: 'role:developer-access',
    namespace: 'analytics',
    risk: 'warning',
    issue: 'Wildcard verbs [*] allowed on secrets API for "analytics" namespace.',
    remediation: 'Replace wildcard verbs with explicit [get, list, watch] list.',
    permissions: ['secrets:*'],
    lastActivity: '15m ago'
  }
];

export const MOCK_SECURITY: SecurityPosture = {
  isolationStatus: 'Strict',
  rbacCompliance: 74.2,
  policyCount: 128,
  suspiciousEvents: 2,
  activeSecurityInference: 88,
  events: MOCK_SECURITY_EVENTS,
  audits: MOCK_RBAC_AUDITS,
  networkFlows: [],
  secrets: [],
  quarantine: []
};

export function generateLiveMetrics(pods: Pod[]): Pod[] {
  return pods.map(pod => ({
    ...pod,
    cpu: Math.max(0, Math.min(100, pod.cpu + (Math.random() * 4 - 2))),
    network: Math.max(0, pod.network + (Math.random() * 8 - 4)),
    memory: Math.max(0, pod.memory + (Math.random() * 20 - 10)),
  }));
}
