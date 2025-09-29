-- Step 1: Create an enum type for booking status
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Step 2: Create the bookings table
CREATE TABLE public.bookings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    schedule_id UUID NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    num_seats INTEGER NOT NULL,
    status public.booking_status NOT NULL DEFAULT 'pending',
    total_price NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add a trigger to update the 'updated_at' column on every update
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security for the bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Step 3: Define RLS policies for the booking engine

-- Policy for bookings: Allow users to view their own bookings.
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
USING (auth.uid() = user_id);

-- Policy for bookings: Allow users to create bookings for themselves.
CREATE POLICY "Users can create their own bookings"
ON public.bookings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for bookings: Allow users to cancel their own pending bookings.
CREATE POLICY "Users can cancel their own bookings"
ON public.bookings
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (status = 'cancelled');

-- Policy for bookings: Allow company members to view all bookings for their company.
CREATE POLICY "Company members can view their company's bookings"
ON public.bookings
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.company_members
    WHERE company_members.company_id = bookings.company_id
      AND company_members.user_id = auth.uid()
  )
);

-- Policy for bookings: Allow company admins to manage all bookings for their company.
CREATE POLICY "Company admins can manage their company's bookings"
ON public.bookings
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.company_members
    WHERE company_members.company_id = bookings.company_id
      AND company_members.user_id = auth.uid()
      AND company_members.role = 'admin'
  )
);