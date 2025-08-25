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
    'services.ping': 'Ping',
    
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
    'incidents.started': 'Started',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error loading data',
    'common.retry': 'Retry',
    'common.days': 'days',
    'common.ago': 'ago',
    'common.ms': 'ms',
    'common.justNow': 'Just now',
    
    // Groups
    'groups.minecraftServers': 'Minecraft Servers',
    'groups.websites': 'Websites',
    'groups.otherServices': 'Other Services',
    'groups.other': 'Other',
    'groups.service': 'service',
    'groups.services': 'services',
    
    // Uptime
    'uptime.30DaysAgo': '30 days ago',
    'uptime.today': 'Today',
    'uptime.uptime': 'uptime',
    
    // 404 Page
    'notFound.title': '404',
    'notFound.message': 'Oops! Page not found',
    'notFound.returnHome': 'Return to Home',
    
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
    'services.ping': 'Ping',
    
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
    'incidents.started': 'Begonnen',
    
    // Common
    'common.loading': 'Lädt...',
    'common.error': 'Fehler beim Laden der Daten',
    'common.retry': 'Wiederholen',
    'common.days': 'Tage',
    'common.ago': 'vor',
    'common.ms': 'ms',
    'common.justNow': 'Gerade eben',
    
    // Groups
    'groups.minecraftServers': 'Minecraft Server',
    'groups.websites': 'Webseiten',
    'groups.otherServices': 'Andere Dienste',
    'groups.other': 'Andere',
    'groups.service': 'Dienst',
    'groups.services': 'Dienste',
    
    // Uptime
    'uptime.30DaysAgo': 'Vor 30 Tagen',
    'uptime.today': 'Heute',
    'uptime.uptime': 'Verfügbarkeit',
    
    // 404 Page
    'notFound.title': '404',
    'notFound.message': 'Ups! Seite nicht gefunden',
    'notFound.returnHome': 'Zurück zur Startseite',
    
    // Footer
    'footer.poweredBy': 'Bereitgestellt von Nexiko Network',
    'footer.lastCheck': 'Letzte Statusprüfung',
  }
};

export type TranslationKey = keyof typeof translations.en;