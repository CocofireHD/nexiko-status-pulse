export type ServiceStatus = 'online' | 'degraded' | 'partial_outage' | 'major_outage' | 'maintenance' | 'unknown';

export type IncidentStatus = 'active' | 'resolved';

export type IncidentSeverity = 'minor' | 'major' | 'critical';

export interface Service {
  id: string;
  name: string;
  description?: string;
  host: string;
  port?: number;
  check_type: 'http' | 'tcp' | 'ping';
  status: ServiceStatus;
  last_checked?: string;
  created_at: string;
  updated_at: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  affected_services: string[];
  status: IncidentStatus;
  severity: IncidentSeverity;
  created_at: string;
  resolved_at?: string;
  updated_at: string;
}

export interface UptimeLog {
  id: string;
  service_id: string;
  status: ServiceStatus;
  response_time?: number;
  timestamp: string;
}

export interface StatusData {
  services: Service[];
  incidents: Incident[];
  uptime_logs: UptimeLog[];
}

export interface LanguageContext {
  language: 'en' | 'de';
  setLanguage: (lang: 'en' | 'de') => void;
  t: (key: string) => string;
}