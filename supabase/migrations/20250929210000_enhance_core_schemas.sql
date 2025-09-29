-- Step 1: Create service_classes table
CREATE TABLE public.service_classes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., 'VIP', 'Business', 'Economy'
    price_modifier NUMERIC NOT NULL DEFAULT 1.0, -- e.g., 1.5 for 50% more expensive
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE public.service_classes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_service_classes_updated_at
  BEFORE UPDATE ON public.service_classes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Step 2: Create seats table
CREATE TABLE public.seats (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    seat_number TEXT NOT NULL,
    service_class_id UUID REFERENCES public.service_classes(id) ON DELETE SET NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;

-- Add a unique constraint for seat_number per vehicle
ALTER TABLE public.seats ADD CONSTRAINT unique_seat_per_vehicle UNIQUE (vehicle_id, seat_number);

-- Step 3: Create cancellation_policies table
CREATE TABLE public.cancellation_policies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    refund_percentage NUMERIC NOT NULL,
    hours_before_departure INTEGER NOT NULL, -- The policy applies if cancellation is this many hours before departure
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE public.cancellation_policies ENABLE ROW LEVEL SECURITY;


-- Step 4: Add platform_role to profiles
CREATE TYPE public.platform_role_enum AS ENUM ('user', 'admin');
ALTER TABLE public.profiles
ADD COLUMN platform_role public.platform_role_enum NOT NULL DEFAULT 'user';

-- Step 5: Create audit_log table
CREATE TABLE public.audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    target_entity TEXT,
    target_id TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables

-- service_classes policies
CREATE POLICY "Allow company members to view their company service classes"
ON public.service_classes FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.company_members WHERE company_id = service_classes.company_id AND user_id = auth.uid())
);
CREATE POLICY "Allow company admins to manage their company service classes"
ON public.service_classes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.company_members WHERE company_id = service_classes.company_id AND user_id = auth.uid() AND role = 'admin')
);

-- seats policies
CREATE POLICY "Allow public read access to seats"
ON public.seats FOR SELECT USING (true);

CREATE POLICY "Allow company admins to manage vehicle seats"
ON public.seats FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.vehicles v
        JOIN public.company_members cm ON v.company_id = cm.company_id
        WHERE v.id = seats.vehicle_id AND cm.user_id = auth.uid() AND cm.role = 'admin'
    )
);


-- cancellation_policies policies
CREATE POLICY "Allow company members to view their company cancellation policies"
ON public.cancellation_policies FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.company_members WHERE company_id = cancellation_policies.company_id AND user_id = auth.uid())
);
CREATE POLICY "Allow company admins to manage their company cancellation policies"
ON public.cancellation_policies FOR ALL USING (
  EXISTS (SELECT 1 FROM public.company_members WHERE company_id = cancellation_policies.company_id AND user_id = auth.uid() AND role = 'admin')
);

-- audit_log policies
CREATE POLICY "Allow platform admins to view audit logs"
ON public.audit_log FOR SELECT USING (
    (SELECT platform_role FROM public.profiles WHERE user_id = auth.uid()) = 'admin'
);

-- Function to create an audit entry (to be called from other triggers/functions)
CREATE OR REPLACE FUNCTION public.create_audit_log(
    p_user_id UUID,
    p_action TEXT,
    p_target_entity TEXT,
    p_target_id TEXT,
    p_details JSONB
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_log (user_id, action, target_entity, target_id, details)
  VALUES (p_user_id, p_action, p_target_entity, p_target_id, p_details);
END;
$$;