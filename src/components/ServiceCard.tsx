import { Service, UptimeLog } from '@/types/status';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Activity } from 'lucide-react';
import { UptimeBar } from './UptimeBar';

interface ServiceCardProps {
  service: Service;
  uptimeLogs: UptimeLog[];
}

export function ServiceCard({ service, uptimeLogs }: ServiceCardProps) {
  const { t } = useLanguage();

  const getStatusBadgeVariant = () => {
    switch (service.status) {
      case 'online':
        return 'default';
      case 'offline':
        return 'destructive';
      case 'degraded':
        return 'secondary';
      case 'partial_outage':
        return 'destructive';
      case 'major_outage':
        return 'destructive';
      case 'maintenance':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusColor = () => {
    switch (service.status) {
      case 'online':
        return 'bg-status-online';
      case 'offline':
        return 'bg-status-major';
      case 'degraded':
        return 'bg-status-degraded';
      case 'partial_outage':
        return 'bg-status-partial';
      case 'major_outage':
        return 'bg-status-major';
      case 'maintenance':
        return 'bg-status-maintenance';
      default:
        return 'bg-muted';
    }
  };

  const calculateUptime = () => {
    if (!uptimeLogs.length) return 100;
    
    const last90Days = uptimeLogs.slice(-90);
    const totalLogs = last90Days.filter(log => log.status !== 'unknown').length;
    if (totalLogs === 0) return 100;
    
    const onlineCount = last90Days.filter(log => log.status === 'online').length;
    return Math.round((onlineCount / totalLogs) * 100 * 100) / 100;
  };

  const getAverageResponseTime = () => {
    const recentLogs = uptimeLogs.slice(-30).filter(log => log.response_time);
    if (!recentLogs.length) return null;
    
    const total = recentLogs.reduce((sum, log) => sum + (log.response_time || 0), 0);
    return Math.round(total / recentLogs.length);
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t('common.justNow');
    if (diffInMinutes < 60) return `${diffInMinutes}m ${t('common.ago')}`;
    
    const hours = Math.floor(diffInMinutes / 60);
    if (hours < 24) return `${hours}h ${t('common.ago')}`;
    
    const days = Math.floor(hours / 24);
    return `${days} ${t('common.days')} ${t('common.ago')}`;
  };

  const uptime = calculateUptime();
  const avgResponseTime = getAverageResponseTime();

  return (
    <Card className="hover:shadow-nexiko transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{service.name}</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            <Badge variant={getStatusBadgeVariant()}>
              {t(`status.${service.status}`)}
            </Badge>
          </div>
        </div>
        {service.description && (
          <p className="text-sm text-muted-foreground">{service.description}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{t('services.uptime')}:</span>
            <span className="font-medium">{uptime}%</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{t('services.ping')}:</span>
            <span className="font-medium">
              {service.status === 'offline' ? '--' : 
               service.ping ? `${service.ping}${t('common.ms')}` : '--'
              }
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>90 {t('common.days')}</span>
            <span>{uptime}% {t('services.uptime')}</span>
          </div>
          <UptimeBar uptimeLogs={uptimeLogs} />
        </div>

        {service.last_checked && (
          <div className="text-xs text-muted-foreground">
            {t('services.lastUpdated')}: {formatTimeAgo(service.last_checked)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}