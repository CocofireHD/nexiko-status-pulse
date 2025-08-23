import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { StatusHeader } from '@/components/StatusHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Incident } from '@/types/status';

const ResolveIncident = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAdmin, loading: authLoading } = useAuth();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, authLoading, navigate]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<string | null>(null);

  const incidentId = searchParams.get('id');

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIncidents(data as Incident[] || []);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      toast.error('Failed to load incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string) => {
    setResolving(id);

    try {
      const { error } = await supabase
        .from('incidents')
        .update({ 
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Incident resolved successfully');
      await fetchIncidents();
    } catch (error) {
      console.error('Error resolving incident:', error);
      toast.error('Failed to resolve incident');
    } finally {
      setResolving(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-status-major" />;
      case 'major':
        return <AlertTriangle className="w-4 h-4 text-status-partial" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-status-degraded" />;
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'major':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <StatusHeader overallStatus="unknown" />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading incidents...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StatusHeader overallStatus="unknown" />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Status
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-status-online" />
            <h1 className="text-3xl font-bold">Resolve Incidents</h1>
          </div>
          <p className="text-muted-foreground">
            Manage and resolve active incidents
          </p>
        </div>

        {incidents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-status-online opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Active Incidents</h3>
              <p className="text-muted-foreground">
                All incidents have been resolved. Great work!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <Card key={incident.id} className="border-l-4 border-l-status-major">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {getSeverityIcon(incident.severity)}
                      <div>
                        <CardTitle className="text-lg">{incident.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="destructive">Active</Badge>
                          <Badge variant={getSeverityBadgeVariant(incident.severity)}>
                            {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleResolve(incident.id)}
                      disabled={resolving === incident.id}
                      size="sm"
                    >
                      {resolving === incident.id ? 'Resolving...' : 'Resolve'}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{incident.description}</p>
                  
                  {incident.affected_services.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Affected Services:</h4>
                      <div className="flex flex-wrap gap-1">
                        {incident.affected_services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Started: {formatDate(incident.created_at)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ResolveIncident;