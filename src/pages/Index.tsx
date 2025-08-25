import { useStatusData } from '@/hooks/useStatusData';
import { useLanguage } from '@/hooks/useLanguage';
import { StatusHeader } from '@/components/StatusHeader';
import { ServiceCard } from '@/components/ServiceCard';
import { IncidentCard } from '@/components/IncidentCard';
import { StatusFooter } from '@/components/StatusFooter';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Loader2, RefreshCcw, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { ServiceStatus } from '@/types/status';
import { groupServices } from '@/lib/serviceGroups';
import { useState } from 'react';

const Index = () => {
  const { data, loading, error, refetch } = useStatusData();
  const { t } = useLanguage();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Minecraft Servers': true,
    'Websites': true,
    'Other Services': true,
    'Other': true
  });

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Calculate overall status
  const getOverallStatus = (): ServiceStatus => {
    if (!data?.services.length) return 'unknown';
    
    const statuses = data.services.map(s => s.status);
    
    if (statuses.includes('major_outage')) return 'major_outage';
    if (statuses.includes('partial_outage')) return 'partial_outage';
    if (statuses.includes('maintenance')) return 'maintenance';
    if (statuses.includes('degraded')) return 'degraded';
    
    return statuses.every(s => s === 'online') ? 'online' : 'degraded';
  };

  const getUptimeLogsForService = (serviceId: string) => {
    return data?.uptime_logs.filter(log => log.service_id === serviceId) || [];
  };

  const getLastUpdated = () => {
    if (!data?.services.length) return undefined;
    
    const lastChecked = data.services
      .map(s => s.last_checked)
      .filter(Boolean)
      .sort()
      .pop();
    
    return lastChecked;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <StatusHeader overallStatus="unknown" />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">{t('common.loading')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <StatusHeader overallStatus="unknown" />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
              <p className="text-destructive mb-4">{t('common.error')}</p>
              <Button onClick={refetch} variant="outline">
                <RefreshCcw className="w-4 h-4 mr-2" />
                {t('common.retry')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const overallStatus = getOverallStatus();
  const activeIncidents = data?.incidents.filter(i => i.status === 'active') || [];
  const recentIncidents = data?.incidents.slice(0, 5) || [];
  
  // Group services by categories
  const { groupedServices, ungroupedServices } = groupServices(data?.services || []);

  return (
    <div className="min-h-screen bg-background">
      <StatusHeader overallStatus={overallStatus} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Services Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t('services.title')}</h2>
          <div className="space-y-6">
            {/* Render grouped services */}
            {Object.entries(groupedServices).map(([groupName, services]) => (
              services.length > 0 && (
                <Collapsible 
                  key={groupName}
                  open={openGroups[groupName]}
                  onOpenChange={() => toggleGroup(groupName)}
                >
                  <CollapsibleTrigger className="flex items-center gap-2 w-full p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                    {openGroups[groupName] ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                    <h3 className="text-xl font-semibold">{groupName}</h3>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {services.length} service{services.length !== 1 ? 's' : ''}
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {services.map((service) => (
                        <ServiceCard 
                          key={service.id} 
                          service={service}
                          uptimeLogs={getUptimeLogsForService(service.id)}
                        />
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )
            ))}
            
            {/* Render ungrouped services if any */}
            {ungroupedServices.length > 0 && (
              <Collapsible 
                open={openGroups['Other']}
                onOpenChange={() => toggleGroup('Other')}
              >
                <CollapsibleTrigger className="flex items-center gap-2 w-full p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                  {openGroups['Other'] ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                  <h3 className="text-xl font-semibold">Other</h3>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {ungroupedServices.length} service{ungroupedServices.length !== 1 ? 's' : ''}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {ungroupedServices.map((service) => (
                      <ServiceCard 
                        key={service.id} 
                        service={service}
                        uptimeLogs={getUptimeLogsForService(service.id)}
                      />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </section>

        {/* Incidents Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">{t('incidents.title')}</h2>
          {recentIncidents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 opacity-50" />
              <p>{t('incidents.noIncidents')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentIncidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          )}
        </section>
      </main>

      <StatusFooter lastUpdated={getLastUpdated()} />
    </div>
  );
};

export default Index;
