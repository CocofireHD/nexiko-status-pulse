-- Create services table for monitoring
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  host TEXT NOT NULL,
  port INTEGER,
  check_type TEXT NOT NULL DEFAULT 'http' CHECK (check_type IN ('http', 'tcp', 'ping')),
  status TEXT NOT NULL DEFAULT 'unknown' CHECK (status IN ('online', 'degraded', 'partial_outage', 'major_outage', 'maintenance', 'unknown')),
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create incidents table
CREATE TABLE public.incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_services TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved')),
  severity TEXT NOT NULL DEFAULT 'minor' CHECK (severity IN ('minor', 'major', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create uptime_logs table for historical data
CREATE TABLE public.uptime_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('online', 'degraded', 'partial_outage', 'major_outage', 'maintenance', 'unknown')),
  response_time INTEGER, -- in milliseconds
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uptime_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for services
CREATE POLICY "Services are viewable by everyone" 
ON public.services 
FOR SELECT 
USING (true);

-- Public read access for incidents
CREATE POLICY "Incidents are viewable by everyone" 
ON public.incidents 
FOR SELECT 
USING (true);

-- Public read access for uptime logs
CREATE POLICY "Uptime logs are viewable by everyone" 
ON public.uptime_logs 
FOR SELECT 
USING (true);

-- Admin-only write access for services
CREATE POLICY "Only admins can modify services" 
ON public.services 
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- Admin-only write access for incidents
CREATE POLICY "Only admins can modify incidents" 
ON public.incidents 
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- Admin-only write access for uptime logs
CREATE POLICY "Only admins can modify uptime logs" 
ON public.uptime_logs 
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- Create indexes for better performance
CREATE INDEX idx_services_status ON public.services(status);
CREATE INDEX idx_services_last_checked ON public.services(last_checked);
CREATE INDEX idx_incidents_status ON public.incidents(status);
CREATE INDEX idx_incidents_created_at ON public.incidents(created_at DESC);
CREATE INDEX idx_uptime_logs_service_id ON public.uptime_logs(service_id);
CREATE INDEX idx_uptime_logs_timestamp ON public.uptime_logs(timestamp DESC);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at
  BEFORE UPDATE ON public.incidents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample services
INSERT INTO public.services (name, description, host, port, check_type, status) VALUES
('Web Portal', 'Main customer portal and website', 'nexiko.net', 443, 'http', 'online'),
('API Gateway', 'Core API services and endpoints', 'api.nexiko.net', 443, 'http', 'online'),
('Database Cluster', 'Primary database infrastructure', 'db-cluster.internal', 5432, 'tcp', 'online'),
('CDN Network', 'Global content delivery network', 'cdn.nexiko.net', 443, 'http', 'online'),
('Email Service', 'SMTP and email delivery system', 'mail.nexiko.net', 587, 'tcp', 'online'),
('Monitoring System', 'Infrastructure monitoring and alerting', 'monitor.nexiko.net', 443, 'http', 'online');

-- Insert sample uptime data for the last 90 days
INSERT INTO public.uptime_logs (service_id, status, response_time, timestamp)
SELECT 
  s.id,
  CASE 
    WHEN random() > 0.05 THEN 'online'
    WHEN random() > 0.02 THEN 'degraded'
    ELSE 'partial_outage'
  END as status,
  (50 + random() * 200)::integer as response_time,
  now() - (generate_series(1, 90) || ' days')::interval
FROM public.services s
CROSS JOIN generate_series(1, 90);