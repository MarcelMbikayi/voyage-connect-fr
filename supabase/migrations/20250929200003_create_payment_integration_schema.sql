-- Step 1: Create an enum type for payment status
CREATE TYPE public.payment_status AS ENUM ('pending', 'succeeded', 'failed');

-- Step 2: Create the payments table
CREATE TABLE public.payments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    payment_method TEXT,
    status public.payment_status NOT NULL DEFAULT 'pending',
    transaction_id TEXT, -- To store the ID from the payment provider
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add a trigger to update the 'updated_at' column on every update
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security for the payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Step 3: Define RLS policies for the payment integration

-- Policy for payments: Allow users to view their own payments.
CREATE POLICY "Users can view their own payments"
ON public.payments
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.bookings
    WHERE bookings.id = payments.booking_id
      AND bookings.user_id = auth.uid()
  )
);

-- Policy for payments: Allow company members to view payments for their company.
CREATE POLICY "Company members can view their company's payments"
ON public.payments
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.bookings
    JOIN public.company_members ON bookings.company_id = company_members.company_id
    WHERE bookings.id = payments.booking_id
      AND company_members.user_id = auth.uid()
  )
);

-- Policy for payments: Allow company admins to manage payments for their company.
CREATE POLICY "Company admins can manage their company's payments"
ON public.payments
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.bookings
    JOIN public.company_members ON bookings.company_id = company_members.company_id
    WHERE bookings.id = payments.booking_id
      AND company_members.user_id = auth.uid()
      AND company_members.role = 'admin'
  )
);