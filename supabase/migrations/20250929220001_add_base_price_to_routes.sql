-- Step 1: Add base_price to the routes table
ALTER TABLE public.routes
ADD COLUMN base_price NUMERIC NOT NULL DEFAULT 0.00;

-- Step 2: Update the seed data to include a base_price for the existing route
-- This is technically a data migration, but it's essential for the feature to work.
UPDATE public.routes
SET base_price = 25.00
WHERE name = 'Kinshasa - Matadi';