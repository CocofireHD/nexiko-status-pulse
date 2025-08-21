import { useLanguage } from '@/hooks/useLanguage';

interface StatusFooterProps {
  lastUpdated?: string;
}

export function StatusFooter({ lastUpdated }: StatusFooterProps) {
  const { t } = useLanguage();

  const formatLastUpdated = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return t('common.justNow');
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ${t('common.ago')}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ${t('common.ago')}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${t('common.days')} ${t('common.ago')}`;
  };

  return (
    <footer className="bg-muted/30 border-t mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {t('footer.poweredBy')}
          </div>
          
          {lastUpdated && (
            <div className="text-xs text-muted-foreground">
              {t('footer.lastCheck')}: {formatLastUpdated(lastUpdated)}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}