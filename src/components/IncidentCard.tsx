import { Incident } from '@/types/status';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IncidentCardProps {
  incident: Incident;
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const { t } = useLanguage();

  const getSeverityIcon = () => {
    switch (incident.severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-status-major" />;
      case 'major':
        return <AlertTriangle className="w-4 h-4 text-status-partial" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-status-degraded" />;
    }
  };

  const getSeverityBadgeVariant = () => {
    switch (incident.severity) {
      case 'critical':
        return 'destructive';
      case 'major':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDuration = () => {
    if (incident.status === 'resolved' && incident.resolved_at) {
      const start = new Date(incident.created_at);
      const end = new Date(incident.resolved_at);
      const durationMs = end.getTime() - start.getTime();
      
      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    }
    
    const start = new Date(incident.created_at);
    const now = new Date();
    const durationMs = now.getTime() - start.getTime();
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Card className={cn(
      "transition-all duration-300",
      incident.status === 'active' ? 'border-l-4 border-l-status-major shadow-status' : 'border-l-4 border-l-status-online'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {incident.status === 'active' ? getSeverityIcon() : <CheckCircle className="w-4 h-4 text-status-online" />}
            <div>
              <CardTitle className="text-lg font-semibold">{incident.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={incident.status === 'active' ? getSeverityBadgeVariant() : 'default'}>
                  {t(`incidents.${incident.status}`)}
                </Badge>
                <Badge variant="outline">
                  {t(`incidents.severity.${incident.severity}`)}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {formatDuration()}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{incident.description}</p>
        
        {incident.affected_services.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">{t('incidents.affectedServices')}:</h4>
            <div className="flex flex-wrap gap-1">
              {incident.affected_services.map((service, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>
            Started: {formatDate(incident.created_at)}
          </span>
          {incident.resolved_at && (
            <span>
              Resolved: {formatDate(incident.resolved_at)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}