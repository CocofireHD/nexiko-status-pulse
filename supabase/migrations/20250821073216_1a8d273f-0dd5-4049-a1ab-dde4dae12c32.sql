-- Fix RLS policy for incidents to allow public incident creation
-- Drop the restrictive policy
DROP POLICY IF EXISTS "Only admins can modify incidents" ON public.incidents;

-- Create more permissive policies for incident management
CREATE POLICY "Anyone can create incidents" 
ON public.incidents 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update incidents" 
ON public.incidents 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete incidents" 
ON public.incidents 
FOR DELETE 
USING (true);