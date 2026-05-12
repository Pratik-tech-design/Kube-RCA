export interface Pod {
  id: string;
  name: string;
  namespace: 'campus-iot' | 'analytics' | 'infra';
  status: 'running' | 'warning' | 'error' | 'restarting';
  cpu: number; // percentage
  memory: number; // MB
  pvcLatency: number; // ms
  network: number; // Mbps
  restarts: number;
  psi: {
    cpu: number;
    memory: number;
    io: number;
  };
}

export interface Metric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export type Severity = 'info' | 'warning' | 'high' | 'critical';

export interface Alert {
  id: string;
  time: string;
  podId?: string;
  description: string;
  severity: Severity;
  type: 'cpu' | 'memory' | 'io' | 'network' | 'probe' | 'restart' | 'security' | 'custom';
  source: string;
}

export type IncidentStatus = 'active' | 'investigating' | 'acknowledged' | 'suppressed' | 'resolved';

export interface Incident {
  id: string;
  title: string;
  status: IncidentStatus;
  severity: Severity;
  startTime: string;
  endTime?: string;
  rootCause?: string;
  alerts: Alert[];
  affectedPods: string[];
  propagationChain: string[]; // List of alert IDs in order
  aiReasoning: AgentInsight[];
  remediation?: RemediationAction;
  assignedTo?: string;
}

export interface RemediationAction {
  id: string;
  action: string;
  description: string;
  risk: 'low' | 'medium' | 'high';
  impact: string;
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  rollbackPlan: string;
}

export interface AgentReasoning {
  step: string;
  evidence: string;
  confidence: number;
}

export interface AgentInsight {
  agent: 'Observability' | 'Log' | 'Infrastructure' | 'RootCause' | 'Security';
  insight: string;
  timestamp: string;
  reasoning: AgentReasoning[];
  recommendation?: string;
  evidenceSource?: string;
}

export interface Link {
  source: string;
  target: string;
  traffic: number;
  latency?: number;
  errorRate?: number;
  throughput?: number;
  health?: number; // 0-100
  isCausal?: boolean;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'privilege_escalation' | 'shell_execution' | 'outbound_anomaly' | 'drift' | 'auth_failure';
  severity: Severity;
  podId: string;
  description: string;
  attackPath?: string[]; // IDs of related pods/nodes
  status: 'active' | 'contained' | 'quarantined' | 'resolved';
  evidence?: string[];
  processTree?: string;
}

export interface RBACAudit {
  id: string;
  entity: string; // ServiceAccount, Role, etc.
  namespace: string;
  risk: Severity;
  issue: string;
  remediation: string;
  permissions: string[];
  lastActivity: string;
}

export interface NetworkFlow {
  id: string;
  source: string;
  target: string;
  status: 'allowed' | 'blocked' | 'suspicious';
  type: 'ingress' | 'egress' | 'internal';
  timestamp: string;
}

export interface SecretAudit {
  id: string;
  name: string;
  namespace: string;
  riskScore: number;
  lastAccessed: string;
  accessedBy: string[];
  status: 'secure' | 'exposed' | 'drift_detected';
  rotationUrgency: 'low' | 'medium' | 'high';
}

export interface QuarantinedWorkload {
  id: string;
  podId: string;
  name: string;
  namespace: string;
  reason: string;
  severity: Severity;
  duration: string;
  behavior: string;
  status: 'isolated' | 'under_investigation' | 'restored';
}

export interface SecurityPosture {
  isolationStatus: 'Strict' | 'Permissive' | 'Custom';
  rbacCompliance: number; // percentage
  policyCount: number;
  suspiciousEvents: number;
  activeSecurityInference: number; // 0-100
  audits: RBACAudit[];
  events: SecurityEvent[];
  networkFlows: NetworkFlow[];
  secrets: SecretAudit[];
  quarantine: QuarantinedWorkload[];
}
