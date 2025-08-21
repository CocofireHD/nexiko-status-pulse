import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatusData, Service, Incident, UptimeLog } from '@/types/status';

export function useStatusData() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch services from external API
      const statusResponse = await fetch('http://45.147.7.231:3000/status');
      if (!statusResponse.ok) {
        throw new Error('Failed to fetch status data');
      }
      const statusData = await statusResponse.json();
      const services = statusData.services || [];

      // Fetch active incidents
      const { data: incidents, error: incidentsError } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (incidentsError) throw incidentsError;

      // Fetch uptime logs (last 90 days)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const { data: uptimeLogs, error: uptimeError } = await supabase
        .from('uptime_logs')
        .select('*')
        .gte('timestamp', ninetyDaysAgo.toISOString())
        .order('timestamp', { ascending: true });

      if (uptimeError) throw uptimeError;

      setData({
        services: services as Service[],
        incidents: incidents as Incident[],
        uptime_logs: uptimeLogs as UptimeLog[]
      });
    } catch (err) {
      console.error('Error fetching status data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscriptions
    const servicesSubscription = supabase
      .channel('services-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'services' }, 
        () => fetchData()
      )
      .subscribe();

    const incidentsSubscription = supabase
      .channel('incidents-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'incidents' }, 
        () => fetchData()
      )
      .subscribe();

    const uptimeSubscription = supabase
      .channel('uptime-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'uptime_logs' }, 
        () => fetchData()
      )
      .subscribe();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => {
      supabase.removeChannel(servicesSubscription);
      supabase.removeChannel(incidentsSubscription);
      supabase.removeChannel(uptimeSubscription);
      clearInterval(interval);
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}