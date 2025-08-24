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
  
  // Fill missing days with service status or default to current status
  const fillGaps = () => {
    const filled = [];
    const now = new Date();
    
    for (let i = 89; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Find the most recent log for this day
      const logForDay = uptimeLogs.find(log => {
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
      case 'offline':
        return 'bg-muted/20'; // Light gray for offline, not red
      default:
        return 'bg-muted/10'; // Very light for unknown
    }
  };

  const getStatusTooltip = (status: string, date: string) => {
    const formattedDate = new Date(date).toLocaleDateString();
    const statusText = t(`status.${status}`);
    return `${formattedDate}: ${statusText}`;
  };

  const calculateUptime = () => {
    if (days.length === 0) return 100;
    const onlineCount = days.filter(day => day.status === 'online').length;
    const totalDays = days.filter(day => day.status !== 'unknown').length || days.length;
    return Math.round((onlineCount / totalDays) * 100 * 100) / 100;
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex gap-0.5 h-8 rounded-sm overflow-hidden bg-muted/20">
        {days.map((day, index) => (
          <div
            key={index}
            className={cn(
              "flex-1 transition-all hover:opacity-80 cursor-pointer",
              getStatusColor(day.status),
              day.status === 'online' && "hover:brightness-110"
            )}
            title={getStatusTooltip(day.status, day.date)}
          />
        ))}
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>45 {t('common.days')} {t('services.uptime')}</span>
        <span>99%</span>
      </div>
    </div>
  );
}