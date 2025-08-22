import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';
import { ServiceStatus } from '@/types/status';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Globe } from 'lucide-react';
import nexikoLogo from '@/assets/nexiko-logo.png';

interface StatusHeaderProps {
  overallStatus: ServiceStatus;
}

export function StatusHeader({ overallStatus }: StatusHeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const getOverallStatusMessage = () => {
    switch (overallStatus) {
      case 'online':
        return t('header.allSystemsOperational');
      case 'degraded':
        return t('header.serviceIssues');
      case 'partial_outage':
        return t('header.partialOutage');
      case 'major_outage':
        return t('header.majorOutage');
      case 'maintenance':
        return t('header.maintenance');
      default:
        return t('header.serviceIssues');
    }
  };

  const getStatusColor = () => {
    switch (overallStatus) {
      case 'online':
        return 'text-status-online';
      case 'degraded':
        return 'text-status-degraded';
      case 'partial_outage':
        return 'text-status-partial';
      case 'major_outage':
        return 'text-status-major';
      case 'maintenance':
        return 'text-status-maintenance';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <header className="bg-gradient-hero border-b">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img 
              src={nexikoLogo} 
              alt="Nexiko Network" 
              className="h-12 w-auto"
              onError={(e) => {
                // Fallback to text logo if image fails
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="text-2xl font-bold text-primary hidden sm:block">
              Nexiko Network
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
              className="flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              {language.toUpperCase()}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/auth'}
            >
              Admin
            </Button>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">
            {t('header.title')}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t('header.subtitle')}
          </p>
          
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card shadow-status ${getStatusColor()}`}>
            <div className={`w-3 h-3 rounded-full ${overallStatus === 'online' ? 'bg-status-online' : overallStatus === 'degraded' ? 'bg-status-degraded' : overallStatus === 'partial_outage' ? 'bg-status-partial' : overallStatus === 'major_outage' ? 'bg-status-major' : 'bg-status-maintenance'}`} />
            <span className="font-medium">
              {getOverallStatusMessage()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}