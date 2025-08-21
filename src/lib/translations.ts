export const translations = {
  en: {
    // Header
    'header.title': 'Nexiko Network Status',
    'header.subtitle': 'Real-time service status and incident reports',
    'header.allSystemsOperational': 'All systems operational',
    'header.serviceIssues': 'Service issues detected',
    'header.partialOutage': 'Partial service outage',
    'header.majorOutage': 'Major service outage',
    'header.maintenance': 'Scheduled maintenance',
    
    // Services
    'services.title': 'Service Status',
    'services.lastUpdated': 'Last updated',
    'services.uptime': 'Uptime',
    'services.responseTime': 'Response time',
    
    // Status
    'status.online': 'Online',
    'status.offline': 'Offline',
    'status.degraded': 'Degraded Performance',
    'status.partial_outage': 'Partial Outage',
    'status.major_outage': 'Major Outage',
    'status.maintenance': 'Maintenance',
    'status.unknown': 'Unknown',
    
    // Incidents
    'incidents.title': 'Recent Incidents',
    'incidents.noIncidents': 'No recent incidents',
    'incidents.active': 'Active',
    'incidents.resolved': 'Resolved',
    'incidents.affectedServices': 'Affected services',
    'incidents.severity.minor': 'Minor',
    'incidents.severity.major': 'Major',
    'incidents.severity.critical': 'Critical',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error loading data',
    'common.retry': 'Retry',
    'common.days': 'days',
    'common.ago': 'ago',
    'common.ms': 'ms',
    
    // Footer
    'footer.poweredBy': 'Powered by Nexiko Network',
    'footer.lastCheck': 'Last health check',
  },
  de: {
    // Header
    'header.title': 'Nexiko Network Status',
    'header.subtitle': 'Echtzeitstatus der Dienste und Störungsberichte',
    'header.allSystemsOperational': 'Alle Systeme funktionsfähig',
    'header.serviceIssues': 'Dienstprobleme erkannt',
    'header.partialOutage': 'Teilweiser Dienstausfall',
    'header.majorOutage': 'Größerer Dienstausfall',
    'header.maintenance': 'Geplante Wartung',
    
    // Services
    'services.title': 'Dienststatus',
    'services.lastUpdated': 'Zuletzt aktualisiert',
    'services.uptime': 'Verfügbarkeit',
    'services.responseTime': 'Antwortzeit',
    
    // Status
    'status.online': 'Online',
    'status.offline': 'Offline',
    'status.degraded': 'Beeinträchtigte Leistung',
    'status.partial_outage': 'Teilausfall',
    'status.major_outage': 'Größerer Ausfall',
    'status.maintenance': 'Wartung',
    'status.unknown': 'Unbekannt',
    
    // Incidents
    'incidents.title': 'Aktuelle Vorfälle',
    'incidents.noIncidents': 'Keine aktuellen Vorfälle',
    'incidents.active': 'Aktiv',
    'incidents.resolved': 'Gelöst',
    'incidents.affectedServices': 'Betroffene Dienste',
    'incidents.severity.minor': 'Gering',
    'incidents.severity.major': 'Erheblich',
    'incidents.severity.critical': 'Kritisch',
    
    // Common
    'common.loading': 'Lädt...',
    'common.error': 'Fehler beim Laden der Daten',
    'common.retry': 'Wiederholen',
    'common.days': 'Tage',
    'common.ago': 'vor',
    'common.ms': 'ms',
    
    // Footer
    'footer.poweredBy': 'Bereitgestellt von Nexiko Network',
    'footer.lastCheck': 'Letzte Statusprüfung',
  }
};

export type TranslationKey = keyof typeof translations.en;