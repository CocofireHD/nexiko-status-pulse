-- Clean up duplicate policies
DROP POLICY IF EXISTS "Anyone can view incidents" ON public.incidents;