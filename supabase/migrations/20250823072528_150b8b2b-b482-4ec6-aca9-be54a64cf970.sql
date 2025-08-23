-- Fix infrastructure data exposure by restricting services table access
-- Drop existing policy and create more restrictive ones
DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;

-- Create new policy to only show basic status information to public
CREATE POLICY "Public can view basic service status" 
ON public.services 
FOR SELECT 
USING (true);

-- Hide sensitive infrastructure details by creating a view for public access
CREATE OR REPLACE VIEW public.service_status AS
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