-- Drop all existing RLS policies for incidents table
DROP POLICY IF EXISTS "Anyone can create incidents" ON public.incidents;
DROP POLICY IF EXISTS "Anyone can update incidents" ON public.incidents;
DROP POLICY IF EXISTS "Anyone can delete incidents" ON public.incidents;
DROP POLICY IF EXISTS "Incidents are viewable by everyone" ON public.incidents;
DROP POLICY IF EXISTS "Anyone can view incidents" ON public.incidents;

-- Add attribution columns for audit trail
ALTER TABLE public.incidents 
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES auth.users(id);

-- Create user roles system (check if type exists first)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'user');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create new restrictive RLS policies for incidents
CREATE POLICY "Incidents are viewable by everyone" 
ON public.incidents 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can create incidents" 
ON public.incidents 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update incidents" 
ON public.incidents 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete incidents" 
ON public.incidents 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create policies for user_roles table
CREATE POLICY "Only admins can manage user roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

-- Create function to update attribution fields
CREATE OR REPLACE FUNCTION public.update_incident_attribution()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_by = auth.uid();
    NEW.updated_by = auth.uid();
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.updated_by = auth.uid();
    NEW.created_by = OLD.created_by; -- Preserve original creator
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic attribution
DROP TRIGGER IF EXISTS update_incident_attribution_trigger ON public.incidents;
CREATE TRIGGER update_incident_attribution_trigger
  BEFORE INSERT OR UPDATE ON public.incidents
  FOR EACH ROW EXECUTE FUNCTION public.update_incident_attribution();