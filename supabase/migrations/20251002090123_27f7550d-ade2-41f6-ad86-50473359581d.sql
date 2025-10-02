-- Create enum types for the transportation system
CREATE TYPE vehicle_type AS ENUM ('bus', 'minibus', 'van');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('orange_money', 'credit_card', 'debit_card', 'cash');
CREATE TYPE seat_status AS ENUM ('available', 'reserved', 'booked');

-- Transport Companies Table
CREATE TABLE public.transport_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  is_active BOOLEAN DEFAULT true,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Routes Table
CREATE TABLE public.routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.transport_companies(id) ON DELETE CASCADE,
  start_location TEXT NOT NULL,
  end_location TEXT NOT NULL,
  distance_km DECIMAL(10,2),
  estimated_duration_minutes INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vehicles Table
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.transport_companies(id) ON DELETE CASCADE,
  vehicle_type vehicle_type NOT NULL,
  plate_number TEXT NOT NULL UNIQUE,
  model TEXT,
  total_seats INT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Seat Configuration Table (for seat layout)
CREATE TABLE public.seat_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  seat_number TEXT NOT NULL,
  row_number INT NOT NULL,
  column_number INT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(vehicle_id, seat_number)
);

-- Schedules Table (recurring trips)
CREATE TABLE public.schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Seat Availability Table (tracks seat status for each schedule)
CREATE TABLE public.seat_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_id UUID NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
  seat_id UUID NOT NULL REFERENCES public.seat_configurations(id) ON DELETE CASCADE,
  status seat_status DEFAULT 'available',
  reserved_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(schedule_id, seat_id)
);

-- Bookings Table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  schedule_id UUID NOT NULL REFERENCES public.schedules(id) ON DELETE RESTRICT,
  booking_reference TEXT NOT NULL UNIQUE,
  status booking_status DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  qr_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Passengers Table (one booking can have multiple passengers)
CREATE TABLE public.passengers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  seat_id UUID NOT NULL REFERENCES public.seat_configurations(id) ON DELETE RESTRICT,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  id_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payments Table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method payment_method NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  transaction_reference TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notifications Table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_via TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Revenue Tracking Table
CREATE TABLE public.revenue_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.transport_companies(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE RESTRICT,
  gross_amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  net_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  settlement_status TEXT DEFAULT 'pending',
  settlement_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.transport_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Transport Companies
CREATE POLICY "Transport companies are viewable by everyone" 
ON public.transport_companies FOR SELECT USING (is_active = true);

CREATE POLICY "Company owners can manage their companies" 
ON public.transport_companies FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Routes
CREATE POLICY "Routes are viewable by everyone" 
ON public.routes FOR SELECT USING (is_active = true);

CREATE POLICY "Company owners can manage their routes" 
ON public.routes FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.transport_companies 
    WHERE id = routes.company_id AND user_id = auth.uid()
  )
);

-- RLS Policies for Vehicles
CREATE POLICY "Company owners can manage their vehicles" 
ON public.vehicles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.transport_companies 
    WHERE id = vehicles.company_id AND user_id = auth.uid()
  )
);

-- RLS Policies for Seat Configurations
CREATE POLICY "Seat configurations viewable for active vehicles" 
ON public.seat_configurations FOR SELECT USING (is_active = true);

CREATE POLICY "Company owners can manage seat configurations" 
ON public.seat_configurations FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.vehicles v
    JOIN public.transport_companies tc ON v.company_id = tc.id
    WHERE v.id = seat_configurations.vehicle_id AND tc.user_id = auth.uid()
  )
);

-- RLS Policies for Schedules
CREATE POLICY "Active schedules are viewable by everyone" 
ON public.schedules FOR SELECT USING (is_active = true);

CREATE POLICY "Company owners can manage their schedules" 
ON public.schedules FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.routes r
    JOIN public.transport_companies tc ON r.company_id = tc.id
    WHERE r.id = schedules.route_id AND tc.user_id = auth.uid()
  )
);

-- RLS Policies for Seat Availability
CREATE POLICY "Seat availability viewable for active schedules" 
ON public.seat_availability FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.schedules WHERE id = seat_availability.schedule_id AND is_active = true
  )
);

CREATE POLICY "Company owners can manage seat availability" 
ON public.seat_availability FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.schedules s
    JOIN public.routes r ON s.route_id = r.id
    JOIN public.transport_companies tc ON r.company_id = tc.id
    WHERE s.id = seat_availability.schedule_id AND tc.user_id = auth.uid()
  )
);

-- RLS Policies for Bookings
CREATE POLICY "Users can view their own bookings" 
ON public.bookings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" 
ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Company owners can view bookings for their schedules" 
ON public.bookings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.schedules s
    JOIN public.routes r ON s.route_id = r.id
    JOIN public.transport_companies tc ON r.company_id = tc.id
    WHERE s.id = bookings.schedule_id AND tc.user_id = auth.uid()
  )
);

-- RLS Policies for Passengers
CREATE POLICY "Users can manage passengers for their bookings" 
ON public.passengers FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.bookings WHERE id = passengers.booking_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Company owners can view passengers for their schedules" 
ON public.passengers FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.bookings b
    JOIN public.schedules s ON b.schedule_id = s.id
    JOIN public.routes r ON s.route_id = r.id
    JOIN public.transport_companies tc ON r.company_id = tc.id
    WHERE b.id = passengers.booking_id AND tc.user_id = auth.uid()
  )
);

-- RLS Policies for Payments
CREATE POLICY "Users can view their own payments" 
ON public.payments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.bookings WHERE id = payments.booking_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create payments for their bookings" 
ON public.payments FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookings WHERE id = payments.booking_id AND user_id = auth.uid()
  )
);

-- RLS Policies for Notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for Revenue Records
CREATE POLICY "Company owners can view their revenue records" 
ON public.revenue_records FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.transport_companies 
    WHERE id = revenue_records.company_id AND user_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX idx_routes_locations ON public.routes(start_location, end_location);
CREATE INDEX idx_schedules_departure ON public.schedules(departure_time);
CREATE INDEX idx_schedules_route ON public.schedules(route_id);
CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE INDEX idx_bookings_schedule ON public.bookings(schedule_id);
CREATE INDEX idx_seat_availability_schedule ON public.seat_availability(schedule_id);
CREATE INDEX idx_seat_availability_status ON public.seat_availability(status);
CREATE INDEX idx_payments_booking ON public.payments(booking_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_transport_companies_updated_at
BEFORE UPDATE ON public.transport_companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_routes_updated_at
BEFORE UPDATE ON public.routes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at
BEFORE UPDATE ON public.schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seat_availability_updated_at
BEFORE UPDATE ON public.seat_availability
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create view for detailed schedules (for search functionality)
CREATE OR REPLACE VIEW public.detailed_schedules_view AS
SELECT 
  s.id,
  tc.name as company_name,
  s.departure_time,
  s.arrival_time,
  r.start_location,
  r.end_location,
  s.base_price as price,
  COUNT(sa.id) FILTER (WHERE sa.status = 'available') as available_seats,
  r.distance_km,
  r.estimated_duration_minutes,
  v.vehicle_type,
  v.total_seats
FROM public.schedules s
JOIN public.routes r ON s.route_id = r.id
JOIN public.transport_companies tc ON r.company_id = tc.id
JOIN public.vehicles v ON s.vehicle_id = v.id
LEFT JOIN public.seat_availability sa ON s.id = sa.schedule_id
WHERE s.is_active = true AND tc.is_active = true
GROUP BY s.id, tc.name, s.departure_time, s.arrival_time, 
         r.start_location, r.end_location, s.base_price, 
         r.distance_km, r.estimated_duration_minutes, 
         v.vehicle_type, v.total_seats;

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ref TEXT;
BEGIN
  ref := 'BK' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
  RETURN ref;
END;
$$;

-- Function to reserve seats temporarily
CREATE OR REPLACE FUNCTION public.reserve_seats_temporarily(
  p_schedule_id UUID,
  p_seat_ids UUID[],
  p_minutes INT DEFAULT 15
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reserved_until TIMESTAMP WITH TIME ZONE;
BEGIN
  v_reserved_until := NOW() + (p_minutes || ' minutes')::INTERVAL;
  
  -- Update seat availability
  UPDATE public.seat_availability
  SET status = 'reserved',
      reserved_until = v_reserved_until,
      updated_at = NOW()
  WHERE schedule_id = p_schedule_id
    AND seat_id = ANY(p_seat_ids)
    AND status = 'available';
  
  RETURN FOUND;
END;
$$;

-- Function to cleanup expired reservations
CREATE OR REPLACE FUNCTION public.cleanup_expired_reservations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.seat_availability
  SET status = 'available',
      reserved_until = NULL,
      updated_at = NOW()
  WHERE status = 'reserved'
    AND reserved_until < NOW();
END;
$$;