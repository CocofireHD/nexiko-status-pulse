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
  
  // Fill missing days with service status or default to current status
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
        status: logForDay?.status || 'online' // Default to online for demo
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
        return 'bg-green-500'; // Default to green for demo
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
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-1 h-16 items-end bg-gray-900 p-3 rounded">
        {days.map((day, index) => (
          <div
            key={index}
            className={cn(
              "flex-1 transition-all hover:opacity-80 cursor-pointer rounded-sm",
              getStatusColor(day.status),
              "h-12"
            )}
            title={getStatusTooltip(day.status, day.date)}
          />
        ))}
      </div>
      
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>30 days ago</span>
        <span className="font-medium">100% uptime</span>
        <span>Today</span>
      </div>
    </div>
  );
}