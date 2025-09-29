-- Create temporary_reservations table
CREATE TABLE public.temporary_reservations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    schedule_id UUID NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
    seat_id UUID NOT NULL REFERENCES public.seats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.temporary_reservations ENABLE ROW LEVEL SECURITY;

-- Add a unique constraint to prevent double-booking a seat temporarily
ALTER TABLE public.temporary_reservations ADD CONSTRAINT unique_temporary_seat_reservation UNIQUE (schedule_id, seat_id);

-- RLS Policies
CREATE POLICY "Users can manage their own temporary reservations"
ON public.temporary_reservations
FOR ALL
USING (user_id = auth.uid());