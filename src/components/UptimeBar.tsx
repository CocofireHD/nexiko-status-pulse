import { UptimeLog } from '@/types/status';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface UptimeBarProps {
  uptimeLogs: UptimeLog[];
  className?: string;
}

export function UptimeBar({ uptimeLogs, className }: UptimeBarProps) {
  const { t } = useLanguage();

  // Get last 90 days of data
  const last90Days = uptimeLogs.slice(-90);
  
  // Fill missing days with 'unknown' status
  const fillGaps = () => {
    const filled = [];
    const now = new Date();
    
    for (let i = 89; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const logForDay = last90Days.find(log => {
        const logDate = new Date(log.timestamp);
        return logDate.toDateString() === date.toDateString();
      });
      
      filled.push({
        date: date.toISOString(),
        status: logForDay?.status || 'unknown'
      });
    }
    
    return filled;
  };

  const days = fillGaps();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-status-online';
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

  const getStatusTooltip = (status: string, date: string) => {
    const formattedDate = new Date(date).toLocaleDateString();
    const statusText = t(`status.${status}`);
    return `${formattedDate}: ${statusText}`;
  };

  const calculateUptime = () => {
    const onlineCount = days.filter(day => day.status === 'online').length;
    return Math.round((onlineCount / days.length) * 100 * 100) / 100;
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex gap-0.5 h-6 rounded overflow-hidden bg-muted/50">
        {days.map((day, index) => (
          <div
            key={index}
            className={cn(
              "flex-1 transition-opacity hover:opacity-80",
              getStatusColor(day.status)
            )}
            title={getStatusTooltip(day.status, day.date)}
          />
        ))}
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>90 {t('common.days')} {t('services.uptime')}</span>
        <span>{calculateUptime()}%</span>
      </div>
    </div>
  );
}