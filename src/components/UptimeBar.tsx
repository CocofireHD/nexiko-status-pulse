import { UptimeLog } from '@/types/status';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface UptimeBarProps {
  uptimeLogs: UptimeLog[];
  className?: string;
}

export function UptimeBar({ uptimeLogs, className }: UptimeBarProps) {
  const { t } = useLanguage();

  // Get last 30 days of data
  const last30Days = uptimeLogs.slice(-30);
  
  // Fill missing days with actual service status or unknown
  const fillGaps = () => {
    const filled = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Find the most recent log for this day
      const logForDay = uptimeLogs.find(log => {
        const logDate = new Date(log.timestamp);
        return logDate.toDateString() === date.toDateString();
      });
      
      filled.push({
        date: date.toISOString(),
        status: logForDay?.status || 'unknown' // Don't assume online for missing data
      });
    }
    
    return filled;
  };

  const days = fillGaps();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'partial_outage':
        return 'bg-orange-500';
      case 'major_outage':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-blue-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-300'; // Unknown status shows as light gray
    }
  };

  const getStatusTooltip = (status: string, date: string) => {
    const formattedDate = new Date(date).toLocaleDateString();
    const statusText = t(`status.${status}`);
    return `${formattedDate}: ${statusText}`;
  };

  const calculateUptime = () => {
    if (days.length === 0) return 0;
    
    // Only count days where we have actual data
    const daysWithData = days.filter(day => day.status !== 'unknown');
    if (daysWithData.length === 0) return 0;
    
    const onlineCount = daysWithData.filter(day => day.status === 'online').length;
    return Math.round((onlineCount / daysWithData.length) * 100 * 100) / 100;
  };

  const uptime = calculateUptime();

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-1 h-12 items-end bg-gray-900 p-2 rounded">
        {days.map((day, index) => (
          <div
            key={index}
            className={cn(
              "flex-1 transition-all hover:opacity-80 cursor-pointer rounded-sm",
              getStatusColor(day.status),
              "h-6"
            )}
            title={getStatusTooltip(day.status, day.date)}
          />
        ))}
      </div>
      
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>30 days ago</span>
        <span className="font-medium">{uptime}% uptime</span>
        <span>Today</span>
      </div>
    </div>
  );
}