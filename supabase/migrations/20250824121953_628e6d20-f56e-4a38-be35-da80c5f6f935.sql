-- Fix the SECURITY DEFINER view issue by recreating without SECURITY DEFINER
DROP VIEW IF EXISTS public.service_status;

-- Create a regular view instead of SECURITY DEFINER
CREATE VIEW public.service_status AS
SELECT 
  id,
  name,
  status,
  last_checked,
  'http' as check_type,  -- Don't expose actual check type
  NULL as host,          -- Don't expose host information
  NULL as port,          -- Don't expose port information
  NULL as description    -- Don't expose internal descriptions
FROM public.services;

-- Grant public access to the view
GRANT SELECT ON public.service_status TO public;
GRANT SELECT ON public.service_status TO anon;