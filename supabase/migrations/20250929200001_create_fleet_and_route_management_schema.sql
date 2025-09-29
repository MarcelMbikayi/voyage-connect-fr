-- Step 1: Create a table for vehicles
CREATE TABLE public.vehicles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- e.g., 'bus', 'van'
    capacity INTEGER NOT NULL,
    registration_number TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add a trigger to update the 'updated_at' column on every update
CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security for the vehicles table
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Step 2: Create a table for routes
CREATE TABLE public.routes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_location TEXT NOT NULL,
    end_location TEXT NOT NULL,
    distance_km NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add a trigger to update the 'updated_at' column on every update
CREATE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON public.routes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security for the routes table
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

-- Step 3: Create a table for schedules
CREATE TABLE public.schedules (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add a trigger to update the 'updated_at' column on every update
CREATE TRIGGER update_schedules_updated_at
  BEFORE UPDATE ON public.schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security for the schedules table
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Step 4: Define RLS policies for fleet and route management

-- Policy for vehicles: Allow company members to view vehicles of their company.
CREATE POLICY "Allow members to view their company vehicles"
ON public.vehicles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.company_members
    WHERE company_members.company_id = vehicles.company_id
      AND company_members.user_id = auth.uid()
  )
);

-- Policy for vehicles: Allow company admins to manage vehicles of their company.
CREATE POLICY "Allow admins to manage their company vehicles"
ON public.vehicles
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.company_members
    WHERE company_members.company_id = vehicles.company_id
      AND company_members.user_id = auth.uid()
      AND company_members.role = 'admin'
  )
);

-- Policy for routes: Allow company members to view routes of their company.
CREATE POLICY "Allow members to view their company routes"
ON public.routes
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.company_members
    WHERE company_members.company_id = routes.company_id
      AND company_members.user_id = auth.uid()
  )
);

-- Policy for routes: Allow company admins to manage routes of their company.
CREATE POLICY "Allow admins to manage their company routes"
ON public.routes
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.company_members
    WHERE company_members.company_id = routes.company_id
      AND company_members.user_id = auth.uid()
      AND company_members.role = 'admin'
  )
);

-- Policy for schedules: Public read access for schedules.
CREATE POLICY "Allow public read access to schedules"
ON public.schedules
FOR SELECT
USING (true);

-- Policy for schedules: Allow company admins to manage schedules of their company.
CREATE POLICY "Allow admins to manage their company schedules"
ON public.schedules
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.company_members
    JOIN public.routes ON schedules.route_id = routes.id
    WHERE company_members.company_id = routes.company_id
      AND company_members.user_id = auth.uid()
      AND company_members.role = 'admin'
  )
);