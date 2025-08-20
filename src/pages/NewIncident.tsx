import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { StatusHeader } from '@/components/StatusHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Service, IncidentSeverity } from '@/types/status';

const NewIncident = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'minor' as IncidentSeverity,
    affected_services: [] as string[]
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } else {
      setServices(data as Service[] || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('incidents')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim(),
          severity: formData.severity,
          affected_services: formData.affected_services,
          status: 'active'
        });

      if (error) throw error;

      toast.success('Incident created successfully');
      navigate('/');
    } catch (error) {
      console.error('Error creating incident:', error);
      toast.error('Failed to create incident');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (serviceName: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      affected_services: checked 
        ? [...prev.affected_services, serviceName]
        : prev.affected_services.filter(s => s !== serviceName)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <StatusHeader overallStatus="unknown" />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
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
            <AlertTriangle className="w-6 h-6 text-status-major" />
            <h1 className="text-3xl font-bold">Create New Incident</h1>
          </div>
          <p className="text-muted-foreground">
            Report a new incident affecting Nexiko Network services
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Incident Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of the incident"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the incident and its impact"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Severity</Label>
                <Select 
                  value={formData.severity}
                  onValueChange={(value: IncidentSeverity) => 
                    setFormData(prev => ({ ...prev, severity: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor - Limited impact</SelectItem>
                    <SelectItem value="major">Major - Significant impact</SelectItem>
                    <SelectItem value="critical">Critical - Widespread impact</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Affected Services</Label>
                <div className="grid grid-cols-1 gap-3">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={service.id}
                        checked={formData.affected_services.includes(service.name)}
                        onCheckedChange={(checked) => 
                          handleServiceToggle(service.name, checked as boolean)
                        }
                      />
                      <Label htmlFor={service.id} className="flex-1">
                        {service.name}
                        {service.description && (
                          <span className="text-sm text-muted-foreground block">
                            {service.description}
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Creating...' : 'Create Incident'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NewIncident;