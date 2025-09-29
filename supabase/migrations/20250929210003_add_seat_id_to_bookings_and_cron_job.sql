-- Step 1: Add seat_id to the bookings table
ALTER TABLE public.bookings
ADD COLUMN seat_id UUID REFERENCES public.seats(id) ON DELETE SET NULL;

-- Make sure a booking is unique for a given schedule and seat
ALTER TABLE public.bookings
ADD CONSTRAINT unique_booking_schedule_seat UNIQUE (schedule_id, seat_id);

-- Step 2: Schedule a cron job to clean up expired temporary reservations
-- This uses pg_cron, which needs to be enabled on the Supabase project.
-- This job will run every 5 minutes.
SELECT cron.schedule(
    'cleanup-expired-reservations',
    '*/5 * * * *',
    $$
    DELETE FROM public.temporary_reservations WHERE expires_at < NOW();
    $$
);